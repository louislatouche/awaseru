// Les langues de l'app.
//
// Dans le code, chaque texte reste écrit en français : t('Mes pièces'). La fonction t cherche cette
// phrase dans le dictionnaire de la langue choisie. Si elle n'y est pas, le français s'affiche :
// jamais de trou à l'écran. Pour ajouter une langue : un fichier dans langues/, une ligne dans LANGUES,
// et une ligne dans la liste du service worker.

import { lireReglages } from './stockage.js';

// Chaque langue est écrite dans sa propre langue : c'est ainsi qu'on la reconnaît.
export const LANGUES = [
  { code: 'fr', nom: 'Français' },
  { code: 'en', nom: 'English' },
  { code: 'de', nom: 'Deutsch' },
  { code: 'es', nom: 'Español' },
  { code: 'it', nom: 'Italiano' },
  { code: 'pt', nom: 'Português' },
  { code: 'nl', nom: 'Nederlands' },
  { code: 'pl', nom: 'Polski' },
  { code: 'sv', nom: 'Svenska' },
  { code: 'da', nom: 'Dansk' },
  { code: 'no', nom: 'Norsk' },
  { code: 'fi', nom: 'Suomi' },
  { code: 'cs', nom: 'Čeština' },
  { code: 'hu', nom: 'Magyar' },
  { code: 'ro', nom: 'Română' },
  { code: 'el', nom: 'Ελληνικά' },
  { code: 'uk', nom: 'Українська' },
  { code: 'ru', nom: 'Русский' },
  { code: 'ja', nom: '日本語' },
  { code: 'ko', nom: '한국어' },
];

const existe = (code) => LANGUES.some((langue) => langue.code === code);

// Le choix fait dans les Réglages. Sans choix : la langue du téléphone si on la connaît, sinon le français.
export function langueActive() {
  const choisie = lireReglages().langue;
  if (existe(choisie)) return choisie;
  const debut = (navigator.language ?? '').slice(0, 2);
  const telephone = ['nb', 'nn'].includes(debut) ? 'no' : debut; // les deux formes du norvégien
  return existe(telephone) ? telephone : 'fr';
}

// Les phrases de la langue active. Le français n'a pas de dictionnaire : c'est la langue du code.
let dictionnaire = null;

// On ne charge que la langue utile, pas les vingt : à appeler au démarrage et à chaque changement.
// import() lit un fichier au moment voulu ; le service worker les garde tous pour le hors-ligne.
export async function chargerLangue() {
  const code = langueActive();
  try {
    dictionnaire = code === 'fr' ? null : (await import(`./langues/${code}.js`)).default;
  } catch {
    dictionnaire = null; // fichier inaccessible : le français plutôt qu'une app bloquée
  }
}

// t('Fiche {position} sur {total}', { position: 2, total: 5 }) remplace aussi ce qui est entre accolades.
export function t(phrase, valeurs = {}) {
  const texte = dictionnaire?.[phrase] ?? phrase;
  return texte.replace(/\{(\w+)\}/g, (_, nom) => valeurs[nom]);
}

// Le nom d'un champ de pièce dans une langue. Le français est la langue d'origine du format : ses
// champs s'appellent fr, titre_fr, nom_fr, ou n'ont pas de suffixe (explication, note, credit).
// Les autres langues prennent leur code : fr devient de, titre_fr devient titre_de, explication
// devient explication_de, etc.
function champDans(champ, langue) {
  if (langue === 'fr') return champ;
  if (champ === 'fr') return langue;
  if (champ.endsWith('_fr')) return champ.replace(/fr$/, langue);
  return `${champ}_${langue}`;
}

// Le contenu d'une pièce. Chaque troupe fait traduire ses pièces dans sa langue, et en anglais,
// la langue commune. On prend donc la langue de l'app si la pièce l'a, sinon l'anglais, sinon le
// français. Avec plusieurs objets (le mot tel qu'il est employé ici, puis le mot du vocabulaire),
// on cherche la langue de l'app chez chacun avant de passer à la langue suivante : mieux vaut le
// sens général dans sa langue que le sens précis dans une autre.
export function traduire(objets, champ) {
  const liste = Array.isArray(objets) ? objets : [objets];
  for (const langue of new Set([langueActive(), 'en', 'fr'])) {
    for (const objet of liste) {
      const valeur = objet?.[champDans(champ, langue)];
      if (valeur !== undefined) return valeur;
    }
  }
  return undefined;
}
