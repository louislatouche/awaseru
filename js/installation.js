// Installer Awaseru sur l'écran d'accueil (demandé par Louis le 2026-11-17).
//
// Une app web ne s'installe pas toute seule : c'est le navigateur qui le fait. Deux cas :
// - Chrome sur Android prévient la page qu'elle peut être installée, par l'événement
//   « beforeinstallprompt ». On le garde de côté, et notre bouton « Installer Awaseru » ouvre
//   alors la vraie fenêtre d'installation de Chrome ;
// - Safari sur iPhone n'a pas cet événement (vérifié le 2026-11-17 : caniuse et le suivi de bugs
//   de WebKit, aucune version de Safari iOS ne l'a). Aucune page ne peut y lancer l'installation :
//   on explique le geste à faire, avec le bouton Partager de Safari.
// Les autres navigateurs (Firefox...) ont souvent l'installation dans leur menu : on le dit.
//
// L'app propose l'installation une fois, au premier lancement, dans une feuille du bas, et les
// Réglages gardent une ligne « Installer l'app » pour plus tard.

import { el, signaler } from './dom.js';
import { t } from './langues.js';
import { ouvrirFeuille } from './modale.js';
import { changerReglage, lireReglages } from './stockage.js';

// L'événement de Chrome, gardé jusqu'à ce que l'on touche le bouton. Il ne sert qu'une fois.
let invitation = null;

// Les parties de l'écran à redessiner quand la situation change (le bouton des Réglages).
const abonnes = new Set();
const prevenir = () => abonnes.forEach((redessiner) => redessiner());

// Ouverte depuis l'icône de l'écran d'accueil, l'app n'a pas de barre d'adresse : c'est le mode
// « standalone » du manifeste. navigator.standalone est l'ancienne façon de le dire, sur iPhone.
export function estInstallee() {
  return window.matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
}

// Un iPhone ou un iPad. Un iPad récent se présente comme un Mac, mais il a un écran tactile.
function surAppareilApple() {
  return /iPhone|iPad|iPod/.test(navigator.userAgent)
    || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
}

// Où en est-on : 'installee', 'bouton' (Chrome peut ouvrir sa fenêtre d'installation),
// 'apple' (expliquer le geste de Safari) ou 'menu' (renvoyer au menu du navigateur).
function situation() {
  if (estInstallee()) return 'installee';
  if (invitation) return 'bouton';
  // Ouverte dans un onglet alors qu'elle est déjà installée : Chrome ne propose plus rien, et
  // renvoyer au menu serait trompeur. Si elle est désinstallée un jour, Chrome renverra son
  // événement, et le bouton (vérifié juste au-dessus) reviendra.
  if (lireReglages().appInstallee) return 'installee';
  if (surAppareilApple()) return 'apple';
  return 'menu';
}

// Ouvre la fenêtre d'installation de Chrome. Rien ne se passe sans l'accord de la personne :
// c'est Chrome qui pose la question.
async function installer() {
  if (!invitation) return;
  const evenement = invitation;
  invitation = null; // Chrome ne permet de l'utiliser qu'une fois
  evenement.prompt();
  const { outcome } = await evenement.userChoice;
  if (outcome === 'accepted') {
    changerReglage('appInstallee', true);
    signaler(t("Awaseru est installée : retrouve-la sur ton écran d'accueil."));
  }
  prevenir();
}

const TEXTE_POURQUOI = () => t("Installée, Awaseru s'ouvre depuis l'écran d'accueil comme une vraie app, en plein écran, et marche sans Internet.");
const TEXTE_APPLE = () => t("Sur iPhone, une page ne peut pas s'installer toute seule : dans Safari, touche le bouton Partager (parfois rangé dans le menu « ... »), puis « Sur l'écran d'accueil ».");
const TEXTE_MENU = () => t("Dans le menu ⋮ du navigateur, choisis « Installer l'application » ou « Ajouter à l'écran d'accueil ».");

// ---- La proposition du premier lancement ----

// Une seule fois, et seulement sur Mes pièces : on ne coupe pas quelqu'un au milieu d'un filage.
// Sur Android, il faut attendre que Chrome ait dit que l'app est installable ; sur iPhone, on
// peut expliquer tout de suite. Sinon (navigateur sans installation connue), on ne dit rien ici.
export function proposerInstallation() {
  if (lireReglages().installationProposee) return;
  if (location.hash !== '' && location.hash !== '#/') return;
  const cas = situation();
  if (cas !== 'bouton' && cas !== 'apple') return;
  if (document.querySelector('.modal-overlay')) return; // une autre feuille est déjà ouverte
  changerReglage('installationProposee', true); // posée tout de suite : la feuille ne revient jamais
  ouvrirFeuille({
    titre: t('Installer Awaseru ?'),
    corps: el('div', { className: 'pile' },
      el('p', { className: 'modal-msg' }, TEXTE_POURQUOI()),
      cas === 'apple' && el('p', { className: 'modal-msg' }, TEXTE_APPLE()),
      el('p', { className: 'legende' }, t('Tu pourras aussi le faire plus tard, depuis les Réglages.'))),
    actions: (fermer) => (cas === 'bouton'
      ? [
        el('button', { type: 'button', className: 'btn-ghost btn-petit', onclick: fermer }, t('Plus tard')),
        el('button', {
          type: 'button',
          className: 'btn btn-petit',
          onclick: () => {
            fermer();
            installer();
          },
        }, t('Installer')),
      ]
      : el('button', { type: 'button', className: 'btn btn-petit', onclick: fermer }, t("J'ai compris"))),
  });
}

// À appeler une fois, au démarrage, avant tout affichage : Chrome peut envoyer son événement très tôt.
export function ecouterInstallation() {
  window.addEventListener('beforeinstallprompt', (evenement) => {
    // Sans cela, Chrome afficherait son propre petit bandeau : on garde la main sur le moment.
    evenement.preventDefault();
    invitation = evenement;
    changerReglage('appInstallee', false); // Chrome la dit installable : elle ne l'est donc plus
    prevenir();
    proposerInstallation();
  });
  // Installée (par notre bouton ou par le menu de Chrome) : plus rien à proposer.
  window.addEventListener('appinstalled', () => {
    invitation = null;
    changerReglage('installationProposee', true);
    changerReglage('appInstallee', true);
    prevenir();
  });
}

// ---- La ligne des Réglages ----

export function creerInstallation() {
  const contenu = el('div', { className: 'pile' });
  const dessiner = () => {
    const cas = situation();
    contenu.replaceChildren(...[
      cas === 'installee'
        ? el('p', { className: 'legende' }, t('Awaseru est installée sur ce téléphone.'))
        : el('p', { className: 'legende' }, TEXTE_POURQUOI()),
      cas === 'bouton' && el('button', { type: 'button', className: 'btn', onclick: installer }, t('Installer Awaseru')),
      cas === 'apple' && el('p', { className: 'legende' }, TEXTE_APPLE()),
      cas === 'menu' && el('p', { className: 'legende' }, TEXTE_MENU()),
    ].filter(Boolean));
  };
  dessiner();
  abonnes.add(dessiner);
  // L'écran des Réglages peut être remplacé : on oublie ce bouton quand il n'est plus affiché.
  const section = el('section', { className: 'card pile' },
    el('h2', { className: 'titre-section' }, t("Installer l'app")),
    contenu);
  window.addEventListener('hashchange', () => abonnes.delete(dessiner), { once: true });
  return section;
}
