---
name: nouvelle-piece
description: Convertit le script PDF d'une pièce de théâtre japonais en fichier de pièce Awaseru (JSON avec furigana, vocabulaire et voix enregistrées) et l'ajoute à l'app. À utiliser quand on donne un nouveau script ou un PDF de pièce, ou qu'on demande d'ajouter une pièce.
---

# Ajouter une pièce à Awaseru

Le PDF à traiter est celui que la personne indique. Si elle n'en indique pas, demande-le.

Le modèle de référence est `exemple/neko-to-tsuki.json`, dans le dossier de ce skill, avec `exemple/voix.json` pour les voix : une courte pièce inventée et validée, où toutes les règles ci-dessous sont appliquées (furigana, lecture irrégulière, didascalie, retour à la ligne, réplique sans rôle, vocabulaire, particules, anglais). C'est un exemple : ne l'ajoute pas à l'app.

Ne modifie rien en dehors du dossier `pieces/` (voir AGENTS.md).

## Avant de commencer : les outils

Trois outils doivent être installés sur l'ordinateur. Vérifie chacun. S'il manque, dis à la personne ce que tu vas installer et pourquoi, demande son accord, puis installe-le.

**Prends chaque outil exactement à la source indiquée ici, et nulle part ailleurs**, même si une recherche en propose une autre. Lors du premier essai réel (2026-11-11, sur un Mac), l'assistant avait pris une autre version d'AivisSpeech et un autre ffmpeg, et rien ne marchait.

Commence par savoir sur quel ordinateur tu es : Windows, Mac à puce Apple (`uname -m` répond `arm64`) ou Mac Intel (`x86_64`).

| Outil | À quoi il sert | Vérifier | Windows | Mac (avec Homebrew, voir plus bas) |
|---|---|---|---|---|
| Node.js | vérifier la pièce, préparer les voix | `node --version` | `winget install --id OpenJS.NodeJS.LTS --exact` | `brew install node` |
| ffmpeg | enregistrer les voix en MP3 | `ffmpeg -hide_banner -encoders` doit citer `libmp3lame` | `winget install --id Gyan.FFmpeg --exact` | `brew install ffmpeg` |
| AivisSpeech | fabriquer les voix japonaises | voir ci-dessous | voir ci-dessous | voir ci-dessous |

**ffmpeg sur Mac : uniquement par Homebrew.** Ne le télécharge pas depuis un site : ceux que propose ffmpeg.org pour le Mac ne conviennent pas (evermeet.cx ne fait que des versions pour Mac Intel, osxexperts.net des versions non signées que macOS bloque). `brew install ffmpeg` prend plusieurs minutes (il installe beaucoup de dépendances) : lance-le dès le début, en arrière-plan, pendant que tu t'occupes d'AivisSpeech.

**AivisSpeech** : une application, sur Windows comme sur Mac (macOS 13 ou plus récent). Awaseru ne se sert que de son **moteur**, qu'elle contient, et qui peut tourner seul, sans fenêtre. **Tu t'en occupes toi-même**, la personne n'a rien à ouvrir.

- **La bonne version** est celle que propose le site officiel, https://aivis-project.com/ : aujourd'hui la **1.1.0-dev**, celle qui a servi à fabriquer les voix d'Awaseru. **Ne prends pas la version marquée « Latest » sur GitHub** : c'est la 1.0.0, de novembre 2024, plus ancienne. Prends la version « Zip » (pas d'installateur à suivre), à ces adresses exactes :
  - Windows : https://github.com/Aivis-Project/AivisSpeech/releases/download/1.1.0-dev/AivisSpeech-Windows-x64-1.1.0-dev.zip
  - Mac à puce Apple : https://github.com/Aivis-Project/AivisSpeech/releases/download/1.1.0-dev/AivisSpeech-macOS-arm64-1.1.0-dev.zip
  - Mac Intel : https://github.com/Aivis-Project/AivisSpeech/releases/download/1.1.0-dev/AivisSpeech-macOS-x64-1.1.0-dev.zip

1. Cherche si AivisSpeech est déjà installée. Le moteur est alors ici :
   - Windows : `C:\Program Files\AivisSpeech\AivisSpeech-Engine\run.exe`, ou `%LOCALAPPDATA%\Programs\AivisSpeech\AivisSpeech-Engine\run.exe` ;
   - Mac : `/Applications/AivisSpeech.app/Contents/Resources/AivisSpeech-Engine/run`.
2. Sinon, avec l'accord de la personne, télécharge le Zip qui correspond à son ordinateur, décompresse-le dans un dossier à elle (par exemple `AivisSpeech` dans son dossier personnel), et repère le moteur : le fichier `run.exe` (Windows) ou `run` (Mac) du dossier `AivisSpeech-Engine`.

   **Vérifie toujours que ce fichier existe avant de continuer.** L'application pèse près d'1 Go : si la personne l'installe ou la copie elle-même (par exemple en la glissant dans Applications), cela prend plusieurs minutes. Lors du premier essai réel, elle a répondu « c'est fait » alors que la copie n'en était qu'à 70 Mo. Attends que le fichier du moteur soit là.
3. Avant de fabriquer les voix, lance ce moteur **en arrière-plan**, puis attends qu'il réponde : http://127.0.0.1:10101/version doit renvoyer `1.1.0-dev`. Une autre version est déjà installée ? Préviens la personne et installe la bonne à côté, dans un dossier à part. À son tout premier lancement, le moteur télécharge ses modèles de base (environ 900 Mo) : préviens que cela prend plusieurs minutes (sur un PC qui les a déjà, il répond en une vingtaine de secondes). Les voix de chaque rôle sont ensuite installées par `outils/generer-audio.mjs`.
4. Une fois les voix faites, arrête le moteur.

  **La seule chose qui revient à la personne** : AivisSpeech n'est pas signée par son éditeur (FAQ d'AivisSpeech). La première fois, Windows ou macOS peut refuser de lancer le moteur et demander une validation humaine. C'est une protection voulue : ne la contourne pas (ni `xattr`, ni désactivation de Gatekeeper ou de SmartScreen). Explique à la personne quoi faire, puis relance le moteur :
  - Mac (méthode d'Apple) : Réglages Système, Confidentialité et sécurité, descendre jusqu'au message sur AivisSpeech, « Ouvrir quand même », puis confirmer ;
  - Windows : dans la fenêtre « Windows a protégé votre ordinateur », « Informations complémentaires », puis « Exécuter quand même ».

**Sur Mac, Node.js et ffmpeg s'installent avec Homebrew** (`brew install node ffmpeg`), le gestionnaire de programmes de référence sur Mac. Si la commande `brew` n'existe pas, tu ne peux pas l'installer toi-même : son installation demande le mot de passe de l'ordinateur. Demande à la personne d'ouvrir l'application Terminal, d'y coller la commande donnée sur https://brew.sh, de taper son mot de passe quand il est demandé (rien ne s'affiche pendant la frappe, c'est normal), puis de coller aussi les lignes que Homebrew affiche à la fin (« Next steps »). Si `git` manque, `git --version` propose de l'installer.

Après une installation par winget (Windows) ou Homebrew (Mac), le programme n'est connu que des terminaux ouverts ensuite : si `node` ou `ffmpeg` reste introuvable, ouvre un nouveau terminal, ou appelle-le par son chemin complet (Homebrew les range dans `/opt/homebrew/bin` sur les Mac récents).

## Les langues de traduction

Une pièce est traduite dans **la langue de la troupe** et en **anglais**, la langue commune. L'app affiche la traduction dans la langue du téléphone si la pièce l'a, sinon l'anglais, sinon le français. Avant de commencer, demande à la personne dans quelle langue sa troupe veut les traductions (propose celle de votre conversation). Si c'est l'anglais, une seule langue suffit.

Le nom des champs : le français est la langue d'origine du format, ses champs s'écrivent `fr`, `titre_fr`, `nom_fr`, et `explication`, `note`, `credit` sans suffixe. Les autres langues prennent leur code de deux lettres, parmi ceux de l'app : `en`, `de`, `es`, `it`, `pt`, `nl`, `pl`, `sv`, `da`, `no`, `fi`, `cs`, `hu`, `ro`, `el`, `uk`, `ru`, `ja`, `ko`. Pour l'allemand, par exemple : `de` sur chaque réplique, chaque mot du vocabulaire et chaque morceau traduit, `titre_de` sur la pièce et sur chaque scène, `nom_de`, `note_de`, `explication_de`, `credit_de`. Le modèle, en français et en anglais, montre où va chaque champ.

La traduction que donne le PDF, quelle que soit sa langue, se recopie telle quelle dans les champs de sa langue. L'autre langue, c'est toi qui la traduis.

## Les étapes

1. Lis le PDF, en texte ET en image des pages pour vérifier. Attention : certains PDF ont une police mal encodée où des hiragana sortent en caractères CJK rares : 䛸=と 䛾=の 䛿=は 䛷=で 䛺=な 䛻=に 䜀=ば 䛶=て 䛹=ど. Corrige-les, et vérifie avec les images qu'il ne reste aucun caractère bizarre.
2. Structure la pièce exactement comme le modèle : rôles avec un id court en ascii, scènes, répliques numérotées comme dans le PDF, role à null quand le PDF n'indique pas de rôle. Recopie la traduction du PDF telle quelle, dans les champs de sa langue (ne corrige pas le texte du script, signale seulement les coquilles).
   - Les liens du PDF (vidéos, pages) concernent la pièce, même quand la mise en page les place sur la ligne d'un rôle : mets-les tous dans `liens`, dans l'ordre du PDF, y compris ceux qui ne s'ouvrent pas. Signale ceux-là à la personne (vidéo privée, page disparue). Un lien ne va sur un rôle (`lien`) que si le PDF dit clairement qu'il est pour ce rôle.
3. Furigana : chaque kanji du japonais (titre, noms de rôles, titres de scènes, répliques) au format [漢字|よみ].
   - Lecture selon le contexte (一人=ひとり, 二人=ふたり, 今日=きょう…).
   - Annotation par mot ; les lectures irrégulières (熟字訓) en bloc sur le mot entier.
   - Les lectures déjà entre parenthèses dans le PDF, ex. 歌（うた）, passent en furigana et les parenthèses disparaissent.
   - Didascalies et bruitages restent entre （）.
   - Traductions : dans les deux langues décidées au départ (voir « Les langues de traduction »), sur le titre, l'explication, les rôles, les scènes, chaque réplique, le vocabulaire et le crédit des voix.
3 bis. Vocabulaire (l'onglet Vocabulaire de l'app) : sur le modèle, format vérifié par js/validation.js.
   - Une liste `vocabulaire` à la fin de la pièce : chaque mot employé, pas seulement les kanji (mots en kana et en katakana, particules, interjections, onomatopées, noms). `{ "id": "utau", "mot": "[歌|うた]う", "fr": "chanter", "en": "to sing" }` : id court en ascii, le mot à sa forme du dictionnaire avec les mêmes furigana que le texte, traductions courtes.
   - Sur chaque réplique, juste après `en`, un découpage `mots` : `[{ "t": "[歌|うた]いましょう", "v": "utau", "fr": "chantons", "en": "let's sing" }, { "t": "！" }]`. Mis bout à bout, les `t` redonnent exactement `texte` (espaces, retours à la ligne, ponctuation et （ ） compris, chacun dans son propre morceau sans `v`). Ne jamais couper un bloc [漢字|よみ]. Un verbe garde sa conjugaison dans un seul morceau ; les particules sont à part. Une traduction sur le morceau (dans les deux langues décidées) quand le sens en contexte diffère de celui du dictionnaire. Ces exemples sont en `fr` et `en` : pour une autre troupe, mets les codes de ses deux langues.
   - Le même mot garde le même id et le même sens de base dans toute la pièce.
   - Et d'une pièce à l'autre : avant de créer un id, cherche le mot dans le vocabulaire des autres pièces (pieces/*.json). Un mot déjà présent avec le même sens reprend exactement son id et son `mot` : une coche « Je savais » vaut pour toutes les pièces, et « Toutes » ne lui donne qu'une carte. Un homographe d'un autre sens prend un autre id (ある « un certain » et ある « il y a »). verifier-piece signale les mots écrits pareil sous un autre id ailleurs : à vérifier un par un.
   - Les particules portent `"particule": true` (après `en`) : la liste du Vocabulaire ne les montre pas, et elles ne s'y révisent pas (le texte les garde touchables). Ce sont les particules casuelles et de liaison (に, と, が, を, は, の, で, から, も, や, へ, まで, より…), leurs emplois de liaison entre propositions (と « quand », が « mais », の « c'est que ») et les particules de fin de phrase (か, よ, ね, ぞ, な, わ…). Pas les copules だ et です, ni の « le fait que » : ils restent des mots ordinaires (choix de l'auteur d'Awaseru, 2026-11-10). Modèle : les particules du modèle.
4. Vérifie avec `node outils/verifier-piece.mjs <id>` (mêmes règles que l'app) jusqu'à « Pièce valide. », toutes les répliques découpées, aucun morceau japonais sans mot et aucun mot inutilisé ; relis la ligne « Particules » qu'il affiche, pour qu'il n'en manque aucune. Vérifie aussi : numéros continus, chaque role existe dans roles. Relis toutes les lectures et liste à la personne celles qui ont plusieurs lectures possibles (私, 何, 方…) avec le choix que tu as fait, ainsi que les découpages ou traductions de mots qui pourraient se discuter.
5. Enregistre pieces/<id>.json et ajoute-le à pieces/index.json.
6. Voix : crée pieces/audio/<id>/voix.json sur le modèle de `exemple/voix.json`, avec une voix par rôle prise sur AivisHub (licence ACML ou CC0, voix bien distinctes entre rôles qui se répondent). Si tu ne parviens pas à consulter AivisHub, reprends des voix déjà éprouvées avec Awaseru, une par rôle, en donnant des voix différentes aux rôles qui se répondent ; chaque voix pèse environ 240 Mo à installer. Ce sont celles de `exemple/voix.json` (阿井田 茂, style Calm ; コハク, styles ノーマル et せつなめ ; morioki, style ノーマル), et aussi : ろてじん（長老ボイス）, modèle `696c98a2-c0b7-4fe7-8cf2-c7e9b8a9bd82`, style ノーマル ; TANAKA, modèle `470a41e2-863f-4bf2-8a20-bf7cde0d8f7b`, styles Anger et Happy ; fumifumi, modèle `71e72188-2726-4739-9aa9-39567396fb2a`, style ノーマル. Démarre le moteur AivisSpeech (voir « Les outils »), lance `node outils/generer-audio.mjs <id>`, puis relis le rapport des lectures. Ajoute à la pièce le champ "audio" avec le crédit des voix. Tu ne peux pas écouter : quand les voix sont choisies, fais écouter un extrait de chaque voix directement dans la conversation, en y envoyant le fichier MP3 (un extrait : une réplique du rôle, fabriquée avec `node outils/generer-audio.mjs <id> <numéro>`). Si ton application ne le permet pas, dis-le franchement.
7. Augmente VERSION_PIECES dans pieces/version.js (jamais VERSION dans sw.js, qui est celle du code), puis propose de faire le commit et le push pour mettre en ligne.
8. Termine par un résumé : titre, nombre de scènes et de répliques, rôles, voix choisies, points à vérifier. Chacun choisit ses répliques dans l'app : ne présélectionne rien.
