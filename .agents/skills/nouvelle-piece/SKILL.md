---
name: nouvelle-piece
description: Convertit le script PDF d'une pièce de théâtre japonais en fichier de pièce Awaseru (JSON avec furigana, vocabulaire et voix enregistrées) et l'ajoute à l'app. À utiliser quand on donne un nouveau script ou un PDF de pièce, ou qu'on demande d'ajouter une pièce.
---

# Ajouter une pièce à Awaseru

Le PDF à traiter est celui que la personne indique. Si elle n'en indique pas, demande-le.

Le modèle de référence est `exemple/hanasaka-jiisan.json`, dans le dossier de ce skill, avec `exemple/voix.json` pour les voix : une pièce complète et validée, où toutes les règles ci-dessous sont appliquées. C'est un exemple : ne l'ajoute pas à l'app.

Ne modifie rien en dehors du dossier `pieces/` (voir AGENTS.md).

## Avant de commencer : les outils

Trois outils doivent être installés sur l'ordinateur. Vérifie chacun. S'il manque, dis à la personne ce que tu vas installer et pourquoi, demande son accord, puis installe-le.

- **Node.js**, pour vérifier la pièce et préparer les voix. Vérifier : `node --version`. Windows : `winget install --id OpenJS.NodeJS.LTS --exact`. macOS : `brew install node`, ou l'installateur de https://nodejs.org.
- **ffmpeg**, pour enregistrer les voix en MP3. Vérifier : `ffmpeg -version`. Windows : `winget install --id Gyan.FFmpeg --exact`. macOS : `brew install ffmpeg`.
- **AivisSpeech**, qui fabrique les voix japonaises, gratuitement, sur l'ordinateur. C'est une application, sur Windows comme sur Mac (macOS 13 ou plus récent) ; Awaseru ne se sert que de son **moteur**, qu'elle contient, et qui peut tourner seul, sans fenêtre. **Tu t'en occupes toi-même**, la personne n'a rien à ouvrir :
  1. Cherche si elle est déjà installée. Le moteur est alors ici :
     - Windows : `C:\Program Files\AivisSpeech\AivisSpeech-Engine\run.exe`, ou `%LOCALAPPDATA%\Programs\AivisSpeech\AivisSpeech-Engine\run.exe` ;
     - Mac : `/Applications/AivisSpeech.app/Contents/Resources/AivisSpeech-Engine/run`.
  2. Sinon, avec l'accord de la personne, télécharge la version « Zip » (pas d'installateur à suivre) sur https://github.com/Aivis-Project/AivisSpeech/releases, la plus récente : `AivisSpeech-Windows-x64-<version>.zip`, ou pour Mac `AivisSpeech-macOS-arm64-<version>.zip` (puce Apple) ou `AivisSpeech-macOS-x64-<version>.zip` (Mac Intel ; `uname -m` répond `arm64` ou `x86_64`). Décompresse-la dans un dossier de la personne (par exemple `AivisSpeech` dans son dossier personnel), et repère le moteur : le fichier `run.exe` (Windows) ou `run` (Mac) du dossier `AivisSpeech-Engine`.
  3. Avant de fabriquer les voix, lance ce moteur **en arrière-plan**, puis attends qu'il réponde sur http://127.0.0.1:10101. À son tout premier lancement, il télécharge ses modèles de base (environ 900 Mo) : préviens que cela prend plusieurs minutes. Les voix de chaque rôle sont ensuite installées par `outils/generer-audio.mjs`.
  4. Une fois les voix faites, arrête le moteur.

  **La seule chose qui revient à la personne** : AivisSpeech n'est pas signée par son éditeur (FAQ d'AivisSpeech). La première fois, Windows ou macOS peut refuser de lancer le moteur et demander une validation humaine. C'est une protection voulue : ne la contourne pas (ni `xattr`, ni désactivation de Gatekeeper ou de SmartScreen). Explique à la personne quoi faire, puis relance le moteur :
  - Mac (méthode d'Apple) : Réglages Système, Confidentialité et sécurité, descendre jusqu'au message sur AivisSpeech, « Ouvrir quand même », puis confirmer ;
  - Windows : dans la fenêtre « Windows a protégé votre ordinateur », « Informations complémentaires », puis « Exécuter quand même ».

**Sur Mac, les outils s'installent avec Homebrew** (`brew install node ffmpeg`). Si la commande `brew` n'existe pas, tu ne peux pas l'installer toi-même : son installation demande le mot de passe de l'ordinateur. Demande à la personne d'ouvrir l'application Terminal, d'y coller la commande donnée sur https://brew.sh, de taper son mot de passe quand il est demandé (rien ne s'affiche pendant la frappe, c'est normal), puis de coller aussi les lignes que Homebrew affiche à la fin (« Next steps »). Si `git` manque, `git --version` propose de l'installer.

Après une installation par winget (Windows) ou Homebrew (Mac), le programme n'est connu que des terminaux ouverts ensuite : si `node` ou `ffmpeg` reste introuvable, ouvre un nouveau terminal, ou appelle-le par son chemin complet (Homebrew les range dans `/opt/homebrew/bin` sur les Mac récents).

## Les étapes

1. Lis le PDF, en texte ET en image des pages pour vérifier. Attention : certains PDF ont une police mal encodée où des hiragana sortent en caractères CJK rares : 䛸=と 䛾=の 䛿=は 䛷=で 䛺=な 䛻=に 䜀=ば 䛶=て 䛹=ど. Corrige-les, et vérifie avec les images qu'il ne reste aucun caractère bizarre.
2. Structure la pièce exactement comme le modèle : rôles avec un id court en ascii, scènes, répliques numérotées comme dans le PDF, role à null quand le PDF n'indique pas de rôle. Recopie la traduction française telle quelle (ne corrige pas le texte du script, signale seulement les coquilles).
3. Furigana : chaque kanji du japonais (titre, noms de rôles, titres de scènes, répliques) au format [漢字|よみ].
   - Lecture selon le contexte (一人=ひとり, 二人=ふたり, 今日=きょう…).
   - Annotation par mot ; les lectures irrégulières (熟字訓) en bloc sur le mot entier.
   - Les lectures déjà entre parenthèses dans le PDF, ex. 掘（ほ）, passent en furigana et les parenthèses disparaissent.
   - Didascalies et bruitages restent entre （）.
   - Anglais : ajoute la traduction anglaise à côté du français (`titre_en`, `explication_en`, `nom_en`, `note_en`, `credit_en`, `titre_en` sur chaque scène, `en` sur chaque réplique). L'app l'affiche dans toutes les langues autres que le français.
3 bis. Vocabulaire (l'onglet Vocabulaire de l'app) : sur le modèle, format vérifié par js/validation.js.
   - Une liste `vocabulaire` à la fin de la pièce : chaque mot employé, pas seulement les kanji (mots en kana et en katakana, particules, interjections, onomatopées, noms). `{ "id": "horu", "mot": "[掘|ほ]る", "fr": "creuser", "en": "to dig" }` : id court en ascii, le mot à sa forme du dictionnaire avec les mêmes furigana que le texte, traductions courtes.
   - Sur chaque réplique, juste après `en`, un découpage `mots` : `[{ "t": "[掘|ほ]って", "v": "horu", "fr": "creusez", "en": "dig" }, { "t": "！" }]`. Mis bout à bout, les `t` redonnent exactement `texte` (espaces, retours à la ligne, ponctuation et （ ） compris, chacun dans son propre morceau sans `v`). Ne jamais couper un bloc [漢字|よみ]. Un verbe garde sa conjugaison dans un seul morceau ; les particules sont à part. `fr`/`en` sur le morceau quand le sens en contexte diffère de celui du dictionnaire.
   - Le même mot garde le même id et le même sens de base dans toute la pièce.
   - Et d'une pièce à l'autre : avant de créer un id, cherche le mot dans le vocabulaire des autres pièces (pieces/*.json). Un mot déjà présent avec le même sens reprend exactement son id et son `mot` : une coche « Je savais » vaut pour toutes les pièces, et « Toutes » ne lui donne qu'une carte. Un homographe d'un autre sens prend un autre id (ある « un certain » et ある « il y a »). verifier-piece signale les mots écrits pareil sous un autre id ailleurs : à vérifier un par un.
   - Les particules portent `"particule": true` (après `en`) : la liste du Vocabulaire ne les montre pas, et elles ne s'y révisent pas (le texte les garde touchables). Ce sont les particules casuelles et de liaison (に, と, が, を, は, の, で, から, も, や, へ, まで, より…), leurs emplois de liaison entre propositions (と « quand », が « mais », の « c'est que ») et les particules de fin de phrase (か, よ, ね, ぞ, な, わ…). Pas les copules だ et です, ni の « le fait que » : ils restent des mots ordinaires (choix de l'auteur d'Awaseru, 2026-11-10). Modèle : les 18 particules du modèle.
4. Vérifie avec `node outils/verifier-piece.mjs <id>` (mêmes règles que l'app) jusqu'à « Pièce valide. », toutes les répliques découpées, aucun morceau japonais sans mot et aucun mot inutilisé ; relis la ligne « Particules » qu'il affiche, pour qu'il n'en manque aucune. Vérifie aussi : numéros continus, chaque role existe dans roles. Relis toutes les lectures et liste à la personne celles qui ont plusieurs lectures possibles (私, 何, 方…) avec le choix que tu as fait, ainsi que les découpages ou traductions de mots qui pourraient se discuter.
5. Enregistre pieces/<id>.json et ajoute-le à pieces/index.json.
6. Voix : crée pieces/audio/<id>/voix.json sur le modèle de `exemple/voix.json`, avec une voix par rôle prise sur AivisHub (licence ACML ou CC0, voix bien distinctes entre rôles qui se répondent). Si tu ne parviens pas à consulter AivisHub, reprends les voix de `exemple/voix.json` (modèles déjà éprouvés avec Awaseru), une par rôle, en donnant des voix différentes aux rôles qui se répondent ; chaque voix pèse environ 240 Mo à installer. Démarre le moteur AivisSpeech (voir « Les outils »), lance `node outils/generer-audio.mjs <id>`, puis relis le rapport des lectures. Ajoute à la pièce le champ "audio" avec le crédit des voix. Tu ne peux pas écouter : dis quelles voix tu as choisies et demande à la personne de vérifier à l'oreille.
7. Augmente VERSION_PIECES dans pieces/version.js (jamais VERSION dans sw.js, qui est celle du code), puis propose de faire le commit et le push pour mettre en ligne.
8. Termine par un résumé : titre, nombre de scènes et de répliques, rôles, voix choisies, points à vérifier. Chacun choisit ses répliques dans l'app : ne présélectionne rien.
