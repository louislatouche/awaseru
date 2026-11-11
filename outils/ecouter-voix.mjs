// Fait une page pour écouter les voix d'une pièce : un extrait par rôle, avec un bouton lecture.
// Ce script tourne sur ton ordinateur, avec Node : il ne fait pas partie de l'app.
//
//   node outils/ecouter-voix.mjs hanasaka-jiisan
//
// Pour chaque rôle, la page montre la voix choisie dans pieces/audio/<id>/voix.json, son style,
// un lien vers sa fiche sur AivisHub (pour en écouter d'autres), et la première réplique du rôle
// déjà fabriquée, prête à écouter. Les répliques qui demandent un autre style ont leur ligne.
// La page tient en un seul fichier, sons compris : on peut l'ouvrir partout, l'envoyer par
// e-mail ou sur un téléphone. Elle est rangée dans le dossier temporaire de l'ordinateur, hors
// du dépôt, puis ouverte dans le navigateur.
//
// Il manque des extraits (voix choisies, mais pas encore fabriquées) ? Le script donne la commande
// qui ne fabrique qu'eux : c'est plus rapide que toute la pièce pour essayer des voix.

import { spawn } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { texteBrut } from '../js/texte.js';

const RACINE = join(dirname(fileURLToPath(import.meta.url)), '..');

// Le texte passe dans du HTML : ses caractères spéciaux ne doivent pas être pris pour des balises.
const echapper = (texte) => String(texte ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

// ---- Le programme ----

const [id, ...options] = process.argv.slice(2);
if (!id) {
  console.error('Usage : node outils/ecouter-voix.mjs <id-de-la-piece> [--sans-ouvrir]');
  process.exit(1);
}

const dossier = join(RACINE, 'pieces', 'audio', id);
const piece = JSON.parse(readFileSync(join(RACINE, 'pieces', `${id}.json`), 'utf8'));
const config = JSON.parse(readFileSync(join(dossier, 'voix.json'), 'utf8'));
const repliques = piece.scenes.flatMap((scene) => scene.repliques);
const roleDe = (ligne) => ligne.role ?? config.sans_role; // une réplique sans rôle prend la voix de sans_role
const fichierDe = (ligne) => join(dossier, `${ligne.numero}.mp3`);

// Un son dans la page même : le fichier MP3 écrit en texte (base64).
const sonEnLigne = (chemin) => `data:audio/mpeg;base64,${readFileSync(chemin).toString('base64')}`;

const lignes = [];
const manquants = [];

// Une ligne du tableau : qui parle, avec quelle voix, et l'extrait à écouter.
function ajouterLigne({ qui, choix, extrait, variante }) {
  const fiche = `https://hub.aivis-project.com/aivm-models/${choix.modele}`;
  const son = extrait && existsSync(fichierDe(extrait))
    ? `<audio controls preload="none" src="${sonEnLigne(fichierDe(extrait))}"></audio>`
    : '<span class="manque">pas encore fabriqué</span>';
  if (extrait && !existsSync(fichierDe(extrait))) manquants.push(extrait.numero);
  lignes.push(`
    <tr${variante ? ' class="variante"' : ''}>
      <td>${qui}</td>
      <td><a href="${fiche}" target="_blank" rel="noopener">${echapper(choix.nom)}</a><br><span class="style">${echapper(choix.style)}</span></td>
      <td>${extrait ? `<span class="numero">${extrait.numero}</span> <span lang="ja">${echapper(texteBrut(extrait.texte))}</span>` : '<span class="manque">aucune réplique</span>'}</td>
      <td>${son}</td>
    </tr>`);
}

for (const [roleId, choix] of Object.entries(config.roles)) {
  const role = piece.roles.find((r) => r.id === roleId);
  const qui = role
    ? `${echapper(role.nom_fr)}<br><span lang="ja">${echapper(texteBrut(role.nom))}</span>`
    : echapper(roleId);
  const siennes = repliques.filter((ligne) => roleDe(ligne) === roleId);
  // L'extrait : la première réplique du rôle dans son style habituel, déjà fabriquée si possible.
  const habituelles = siennes.filter((ligne) => !config.repliques?.[ligne.numero]?.style);
  const extrait = habituelles.find((ligne) => existsSync(fichierDe(ligne))) ?? habituelles[0] ?? siennes[0];
  ajouterLigne({ qui, choix, extrait });

  // Les répliques de ce rôle qui demandent un autre style ont chacune leur ligne, juste dessous.
  for (const ligne of siennes.filter((l) => config.repliques?.[l.numero]?.style)) {
    ajouterLigne({ qui: `<span class="style">réplique ${ligne.numero}, autre style</span>`, choix: { ...choix, ...config.repliques[ligne.numero] }, extrait: ligne, variante: true });
  }
}

const page = `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Les voix de ${echapper(texteBrut(piece.titre))}</title>
<style>
  body { margin: 0; padding: 24px 16px; background: #faf9f7; color: #2b2a28; font: 16px/1.45 system-ui, sans-serif; }
  main { max-width: 900px; margin: 0 auto; }
  h1 { font-size: 1.4rem; margin: 0 0 4px; }
  p { margin: 0 0 20px; color: #6b6862; }
  table { width: 100%; border-collapse: collapse; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 1px 3px rgb(0 0 0 / 8%); }
  th, td { padding: 12px; text-align: left; vertical-align: middle; border-bottom: 1px solid #ece9e4; }
  th { font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.04em; color: #6f7c6a; }
  tr.variante td { background: #f6f5f2; }
  a { color: #4f5d4a; }
  .style, .numero { color: #8a867f; font-size: 0.85rem; }
  .manque { color: #b5562f; font-size: 0.9rem; }
  audio { width: 220px; max-width: 100%; }
  @media (max-width: 640px) {
    table, tbody, tr, td { display: block; width: auto; }
    thead { display: none; }
    tr { border-bottom: 1px solid #ece9e4; }
    td { border: 0; padding: 6px 12px; }
  }
</style>
</head>
<body>
<main>
  <h1>Les voix de ${echapper(texteBrut(piece.titre))}</h1>
  <p>${echapper(piece.titre_fr)} : un extrait par rôle. Le nom de chaque voix ouvre sa fiche sur AivisHub, pour en écouter d'autres.</p>
  <table>
    <thead><tr><th>Rôle</th><th>Voix</th><th>Extrait</th><th>Écouter</th></tr></thead>
    <tbody>${lignes.join('')}
    </tbody>
  </table>
</main>
</body>
</html>
`;

const sortie = join(tmpdir(), `awaseru-voix-${id}.html`);
writeFileSync(sortie, page);
console.log(`Page d'écoute : ${sortie}`);

if (manquants.length > 0) {
  console.log(`Extraits pas encore fabriqués. Pour ne fabriquer qu'eux :\n  node outils/generer-audio.mjs ${id} ${manquants.join(' ')}`);
}

// Ouvre la page dans le navigateur de l'ordinateur.
if (!options.includes('--sans-ouvrir')) {
  // Sous Windows, « start » prend son premier argument entre guillemets pour un titre : d'où le "".
  const [commande, ...args] = process.platform === 'win32' ? ['cmd', '/c', 'start', '""', `"${sortie}"`]
    : process.platform === 'darwin' ? ['open', sortie] : ['xdg-open', sortie];
  spawn(commande, args, { detached: true, stdio: 'ignore', windowsVerbatimArguments: process.platform === 'win32' }).unref();
}
