# Awaseru

*[English version](README.md)*

Une application web installable (PWA) pour apprendre ses répliques de théâtre en japonais, sur un téléphone Android. Elle fonctionne hors ligne et garde toutes ses données sur le téléphone : aucun serveur, aucun compte.

Ce dépôt est **l'original** d'Awaseru : le code seul, sans aucune pièce. Chaque troupe en fait **sa propre copie** sur son compte GitHub, y ajoute ses pièces et la publie gratuitement, à sa propre adresse. Les pièces et les données de chaque troupe restent chez elle. Quand l'original s'améliore, deux clics suffisent pour récupérer la nouveauté.

## Avoir l'Awaseru de ta troupe

### Le plus simple : laisse ton assistant te guider

1. Il te faut un assistant qui travaille **sur ton ordinateur** (la simple discussion en ligne ne suffit pas) :
   - **Claude Code** : l'onglet *Code* de l'application Claude ([l'installer](https://code.claude.com/docs/en/desktop-quickstart)), avec un forfait Claude Pro ou plus ;
   - ou **Codex** : le mode *Codex* de l'application ChatGPT ([l'installer](https://learn.chatgpt.com/docs/app)), inclus dans le forfait gratuit, en accès limité.
2. Crée un dossier vide sur ton ordinateur (par exemple *Documents/Awaseru*) et ouvre-le dans ton assistant.
3. Copie le message ci-dessous, colle-le dans ton assistant, envoie-le, et laisse-toi guider.

Le message est en anglais, la langue que toutes les IA comprennent le mieux. La première chose que fera ton assistant, c'est te demander **dans quelle langue tu veux parler** : réponds « français », et la suite se fera en français. Il te demandera ensuite comment tu veux faire l'installation : **par l'IA** (il fait tout lui-même, tu n'as qu'à te connecter une fois à GitHub en recopiant un code) ou **toi-même** (il te guide, et tu fais les manipulations sur le site de GitHub).

```text
Help me set up Awaseru for my theatre troupe and add our plays to it. First, ask me which language I want us to use, then speak only that language with me for the whole conversation. I am not a computer person: use simple words, one step at a time, and wait for my answer before moving on. Ask for my permission before installing any program. If you cannot run commands on this computer, tell me right away: I need Claude Code or Codex.

Awaseru is a web app for learning one's lines in a Japanese play. The original is https://github.com/awaseru-app/awaseru: each troupe makes its own copy (a fork) on its GitHub account, adds its plays, and publishes it for free with GitHub Pages.

A. If my copy is already on this computer (a folder containing AGENTS.md and pieces/), work in it, get its latest version with git pull, and go straight to D.

B. Otherwise, ask me how I want to set it up:
   - "by the AI": you do everything yourself, I will only have to sign in to GitHub once;
   - "myself": you guide me, and I do the steps on the GitHub website.
   Either way, I need a GitHub account. If I do not have one, send me to https://github.com/signup to create it: I must do that myself.

C. Setup. My app will then be at https://MY-ACCOUNT.github.io/awaseru/ (MY-ACCOUNT in lowercase). My copy goes in a folder of its own: if you are open in a folder that already contains something else (another project), do not put it there; ask me where to put it (for example an Awaseru folder in my Documents).
   By the AI:
   1. Install Git and GitHub CLI if they are missing (Windows: winget install --id Git.Git, then winget install --id GitHub.cli --source winget; Mac: brew install gh; if the brew command does not exist, I must install Homebrew myself in the Terminal app, because it asks for my password: guide me using https://brew.sh).
   2. Sign me in to GitHub: run gh auth login --hostname github.com --git-protocol https --web --skip-ssh-key in the background, so you can read what it prints while it waits. It shows a code and the address https://github.com/login/device: give them to me, I enter the code on that page, and the command finishes by itself. Then run gh auth setup-git.
   3. Create my copy and download it into this folder: gh repo fork awaseru-app/awaseru --fork-name awaseru --default-branch-only --clone
   4. Put it online: gh api -X POST repos/MY-ACCOUNT/awaseru/pages -f "source[branch]=main" -f "source[path]=/". Then check with gh api repos/MY-ACCOUNT/awaseru/pages/builds/latest; if nothing gets published, enable Actions on my copy: gh api -X PUT repos/MY-ACCOUNT/awaseru/actions/permissions -F enabled=true
   Myself:
   1. Guide me to create my copy: on https://github.com/awaseru-app/awaseru, the "Fork" button, my account as "Owner", name "awaseru", then "Create fork".
   2. Then to put it online: in my copy, Settings, Pages, "Deploy from a branch", branch main, folder / (root), Save. If nothing is online after ten minutes: the Actions tab of my copy, allow the workflows.
   3. Install Git if it is missing (Windows: winget install --id Git.Git), then clone my copy into this folder (https://github.com/MY-ACCOUNT/awaseru).

D. Read AGENTS.md in my copy and follow it: in particular, change nothing outside the pieces/ folder, and if git asks for a name and an email address, ask me for them.

E. Ask me for the PDF of the script, then add the play by following .agents/skills/nouvelle-piece/SKILL.md step by step (it also says which tools to install).

F. When everything is checked, send the work to GitHub (commit, then push). If GitHub asks me to sign in, guide me.

G. Finally, explain how to install the app on the troupe's phones, and how to get Awaseru's improvements later (README.md of my copy, sections "Install on Android" and "Get Awaseru's improvements"). Also tell me that you can do it for me, as AGENTS.md explains.
```

Pour ajouter une autre pièce plus tard, ou récupérer les améliorations d'Awaseru, ouvre le même dossier dans ton assistant et recolle le même message.

**À savoir avant de commencer :**

- **Ta copie est publique** (c'est la condition pour la publier gratuitement) : le texte de tes pièces sera visible par tous.
- **Une seule copie d'Awaseru par compte GitHub** (voir plus bas).
- **La première pièce prend du temps** : AivisSpeech, qui fabrique les voix, télécharge près d'un gigaoctet à son premier lancement, puis environ 240 Mo par voix.
- **Avec un forfait limité**, une longue pièce peut épuiser ton quota en route : le travail est enregistré sur ton ordinateur, l'assistant le reprendra plus tard.

### Pourquoi une IA ?

**L'app elle-même n'a aucune IA.** Awaseru fonctionne sans serveur, sans compte et hors ligne. Tes répliques, ta progression et tes réglages restent sur ton téléphone. L'IA n'intervient qu'une fois par pièce, sur l'ordinateur de la troupe, pour la préparer.

**Préparer une pièce, c'est un travail d'expert, long et minutieux.** Pour un script d'une quarantaine de répliques, il faut :

- poser la lecture de chaque kanji selon le contexte (一人 se lit ひとり, 今日 se lit きょう), y compris les lectures irrégulières ;
- découper chaque réplique en mots, donner pour chacun sa forme du dictionnaire, sa traduction, repérer les particules, et garder les mêmes mots d'une pièce à l'autre : près de deux cents mots pour une seule pièce courte ;
- corriger les caractères que certains PDF encodent mal, et ajouter la traduction anglaise ;
- choisir une voix par rôle, fabriquer les voix et vérifier que le moteur prononce bien chaque mot.

Le fichier d'une pièce courte fait près de 100 000 caractères. À la main, il faudrait des jours et une bonne connaissance du japonais. Avec une IA, c'est fait en une séance.

**L'IA ne travaille pas seule.**

- Un outil vérifie chaque pièce avec les mêmes règles que l'app, sans IA.
- L'IA signale les lectures qui se discutent : c'est toi qui tranches.
- Tu écoutes chaque voix avant qu'elle soit publiée.
- Le texte du professeur n'est jamais corrigé : les coquilles sont seulement signalées.

**Elle est aussi là pour l'installation.** Copie GitHub, mise en ligne, outils : elle s'en charge pour les troupes qui n'y connaissent rien en informatique.

**Elle n'est pas obligatoire.** Tout est décrit pour le faire à la main (voir « Ajouter une pièce à la main »).

**À savoir :**

- le PDF du script est envoyé à l'IA (Anthropic pour Claude, OpenAI pour Codex) ;
- les voix sont fabriquées sur ton ordinateur par AivisSpeech, gratuitement, sans rien envoyer en ligne ;
- de toute façon, le texte des pièces devient public sur GitHub.

### Le détail, étape par étape

Ce que ton assistant te fera faire si tu choisis « moi-même », ou si tu préfères te passer de lui.

#### 1. Faire ta copie

1. Connecté à GitHub, ouvre <https://github.com/awaseru-app/awaseru>.
2. En haut à droite, touche **Fork**.
3. À la ligne *Owner*, choisis ton compte. À la ligne *Repository name*, garde `awaseru` : ce nom fait partie de l'adresse de ton app. Laisse cochée la case qui ne copie que la branche `main`.
4. Touche **Create fork**.

**Une seule copie d'Awaseru par compte GitHub.** Deux copies sur le même compte seraient sur le même site, donc dans le même stockage des téléphones : leurs données se mélangeraient. Pour une deuxième troupe, prends un autre compte, ou une organisation GitHub.

#### 2. La mettre en ligne

1. Sur la page de ta copie, ouvre **Settings**, puis **Pages** dans la colonne de gauche.
2. Sous **Build and deployment**, à la ligne **Source**, choisis **Deploy from a branch**.
3. Choisis la branche `main`, le dossier `/ (root)`, puis touche **Save**.
4. Quelques minutes plus tard, ton app est en ligne à l'adresse `https://TONCOMPTE.github.io/awaseru/`. Elle est encore vide : *Mes pièces* n'affiche rien.

Si elle n'est toujours pas en ligne au bout de dix minutes, ouvre l'onglet **Actions** de ta copie : si GitHub demande d'autoriser les workflows, accepte.

#### 3. Ajouter tes pièces

1. Installe Git, qui sert à récupérer ta copie sur ton ordinateur et à la renvoyer sur GitHub. Sur Windows, dans un terminal : `winget install --id Git.Git`. Sur Mac, tape `git --version` dans le Terminal : macOS propose de l'installer s'il manque.
2. Récupère ta copie sur ton ordinateur : `git clone https://github.com/TONCOMPTE/awaseru`.
3. Ouvre le dossier `awaseru` dans ton assistant, puis lance le skill qui ajoute une pièce : `/nouvelle-piece chemin/du/script.pdf` dans Claude Code, `$nouvelle-piece` suivi du chemin du PDF dans Codex. L'assistant vérifie qu'il a ses outils (Node.js, ffmpeg et AivisSpeech) et te demande ton accord pour installer ceux qui manquent. Puis il convertit le script, fabrique les voix, vérifie le tout et te propose de le publier. La première fois que ton ordinateur envoie quelque chose sur GitHub, une fenêtre te demande de te connecter.
4. Relis les points que l'assistant te signale (lectures des kanji, coquilles), et écoute l'extrait de chaque voix qu'il t'envoie dans la conversation, avant qu'il publie.

#### 4. Récupérer les améliorations d'Awaseru

1. Sur la page de ta copie, au-dessus de la liste des fichiers, touche **Sync fork**.
2. Touche **Update branch**.

Ton site se met à jour en quelques minutes, et les téléphones affichent « Nouvelle version prête ». Sur ton ordinateur, ta copie se met à jour avec `git pull` (le message à copier le prévoit).

Si GitHub te propose plutôt d'ouvrir une *pull request*, c'est qu'un fichier a été modifié en dehors du dossier `pieces/` dans ta copie. N'insiste pas, et demande de l'aide sur <https://github.com/awaseru-app/awaseru/issues>.

### La règle d'or

**Dans ta copie, ne modifie rien en dehors du dossier `pieces/`.** C'est ce qui permet de récupérer les améliorations sans jamais rien casser. Codex et Claude Code le savent : c'est écrit dans `AGENTS.md`.

## Installer sur Android

1. Ouvre `https://TONCOMPTE.github.io/awaseru/` dans Chrome et laisse la page se charger quelques secondes.
2. Menu **⋮** de Chrome, puis **Ajouter à l'écran d'accueil** ou **Installer l'application** (le libellé varie selon la version).
3. Awaseru apparaît sur l'écran d'accueil et s'ouvre sans la barre d'adresse.
4. Pour vérifier le hors-ligne : passe en mode avion et ouvre l'app.

Le numéro de version est affiché en bas des Réglages : « 131.4 » veut dire le code en version 131 et les pièces de ta troupe en version 4.

### La voix japonaise

Awaseru lit ses pièces avec ses voix enregistrées. La voix du téléphone ne sert que de secours, ou si tu coupes le réglage « Utiliser les voix enregistrées ». Pour l'installer :

**Paramètres Android > Synthèse vocale** (parfois rangée dans Accessibilité ou Gestion globale) **> moteur Google > installer les données vocales > japonais.** Ferme puis rouvre ensuite Awaseru.

## Choisir ses répliques

Awaseru sert à toute la troupe : rien n'est présélectionné, chacun coche ses répliques dans l'écran *Mes répliques*. Pour aller plus vite, pince l'écran avec deux doigts : il ne reste qu'une grille de numéros à toucher. Écarte deux doigts pour revenir au texte.

## Tes données

Les répliques choisies, la progression et les réglages restent sur le téléphone, dans le stockage du navigateur. Ils disparaissent si tu vides les « cookies et données de site » de Chrome. Dans les Réglages, *Sauvegarder* en fait une copie dans un fichier, et *Restaurer* la récupère, y compris sur un autre téléphone.

*Supprimer du téléphone*, sur la carte d'une pièce, efface ses voix de ce téléphone pour libérer de la place, sans rien changer sur le site. La ligne *Télécharger des pièces*, en bas de *Mes pièces*, ouvre la liste des pièces du site, comme celle des extensions d'un navigateur : on coche celles qui manquent, puis *Télécharger* les récupère (il faut alors du réseau). Une suppression ne touche jamais aux répliques choisies ni à la progression, et les mises à jour de l'app ne réinstallent pas une pièce retirée.

## Les pièces, en détail

Tout ce qui appartient à une troupe est dans `pieces/` :

| Fichier | Rôle |
|---|---|
| `pieces/index.json` | La liste des pièces de la troupe : `["ma-piece.json", "une-autre.json"]`. Vide dans l'original. |
| `pieces/<id>.json` | Une pièce : texte, furigana, traductions, vocabulaire. |
| `pieces/audio/<id>/` | Ses voix : un MP3 par réplique, et `voix.json`, le choix d'une voix par rôle. |
| `pieces/audio/index.json` | La liste de tous les MP3, tenue à jour par `outils/generer-audio.mjs`. |
| `pieces/version.js` | Le numéro de version des pièces. **À augmenter à chaque changement** dans ce dossier, sinon les téléphones gardent les anciennes pièces. |

### Ajouter une pièce à la main

1. Place le fichier dans `pieces/`.
2. Ajoute son nom dans `pieces/index.json`.
3. Choisis les voix dans `pieces/audio/<id>/voix.json`, puis génère l'audio (voir « Les voix »).
4. Vérifie la pièce : `node outils/verifier-piece.mjs <id>`.
5. Augmente `VERSION_PIECES` dans `pieces/version.js`, puis publie.

Le modèle complet, vocabulaire compris, est `.agents/skills/nouvelle-piece/exemple/neko-to-tsuki.json` : une courte pièce inventée.

### Les voix

Les pièces ont une voix enregistrée par rôle : des fichiers MP3 générés à l'avance sur l'ordinateur avec [AivisSpeech](https://aivis-project.com/), gratuit et local. Elles marchent donc hors ligne, avec la même voix sur tous les téléphones. L'app se sert de la voix du téléphone si un fichier manque. Un réglage permet de les comparer.

Pour changer une voix, modifie `pieces/audio/<id>/voix.json`, démarre AivisSpeech, puis :

```bash
node outils/generer-audio.mjs <id>
```

Pour ne refaire que quelques répliques, ajoute leurs numéros à la fin de la commande. Il faut que `ffmpeg` soit installé. Augmente ensuite `VERSION_PIECES` dans `pieces/version.js`, puis publie.

Le script garde les kanji, car le moteur reconnaît mieux les mots qu'avec des kana seuls. Il compare ensuite la lecture du moteur à tes furigana : là où elle diffère, il remplace ce kanji par sa lecture, puis le signale dans son rapport.

### Format d'un fichier de pièce

```json
{
  "format": 1,
  "id": "ma-piece",
  "titre": "ねこと[月|つき]",
  "titre_fr": "Le Chat et la Lune",
  "explication": "Quelques mots sur la pièce.",
  "roles": [
    { "id": "narrateur", "nom": "ナレーター", "nom_fr": "Narrateur" },
    {
      "id": "neko",
      "nom": "[小|ちい]さいねこ",
      "nom_court": "ねこ",
      "nom_fr": "Petit Chat",
      "note": "Facultatif",
      "lien": "https://exemple.fr/facultatif"
    }
  ],
  "scenes": [
    {
      "numero": 1,
      "titre": "[屋根|やね]の[上|うえ]",
      "titre_fr": "Sur le toit",
      "repliques": [
        { "numero": 1, "role": "narrateur", "texte": "むかしむかし。", "fr": "Il était une fois." },
        { "numero": 2, "role": "neko", "texte": "こんばんは。\n（[空|そら]を[見|み]る）", "fr": "Bonsoir. (Il regarde le ciel)" },
        { "numero": 3, "role": null, "texte": "おしまい。", "fr": "Fin." }
      ]
    }
  ]
}
```

Les règles que l'app vérifie au chargement :

- **Numéros de répliques** : uniques dans toute la pièce, pas seulement dans une scène. La progression y est attachée, évite donc de les renuméroter.
- **`role`** : l'`id` d'un rôle déclaré, ou `null` pour une réplique sans rôle. Une réplique sans rôle est lue par l'app, sauf si tu la coches dans *Mes répliques*.
- **`[漢字|よみ]`** : affiche le kanji avec sa lecture, et c'est la lecture qui est prononcée.
- **`（…）`** : didascalie ou bruitage, en gris italique, non lue par défaut. Seules les parenthèses japonaises comptent.
- **`\n`** : retour à la ligne.
- **`lien`** : uniquement une adresse `http` ou `https`. Il s'affiche dans *À propos de cette pièce*, à côté du nom du rôle. Son libellé suit l'adresse : *Voir la vidéo* pour YouTube ou Vimeo, sinon *Ouvrir le lien*.
- **Facultatifs** : `format`, `id` (sinon le nom du fichier est utilisé), `nom_court`, `note`, `lien`.
- **Anglais** : `titre_en`, `explication_en`, `nom_en`, `note_en`, `credit_en`, et `en` sur chaque réplique. Toutes les langues autres que le français les affichent. S'il en manque un, le français s'affiche à sa place.

## Pour qui modifie le code

Le code ne se modifie que dans l'original. Chaque troupe récupère ensuite le changement avec **Sync fork**.

### Rôle de chaque fichier

| Fichier | Rôle |
|---|---|
| `index.html` | L'unique page de l'app : trois zones vides que le JavaScript remplit. |
| `manifest.webmanifest` | La carte d'identité de l'app pour Android : nom, icônes, mode plein écran. |
| `sw.js` | Le service worker : garde une copie de l'app pour le hors-ligne. Contient le numéro de version du code. |
| `css/style.css` | Les styles propres à Awaseru, posés sur le design kit. |
| `css/polices.css` | Déclare les polices rangées dans `polices/`. |
| `design-kit/` | Copie exacte de `tokens.css` et `base.css` du design kit : couleurs, boutons, cartes. Ne pas les modifier ici. |
| `polices/` | Fraunces, Karla et Poppins, servies par l'app pour rester hors ligne, avec leurs licences. |
| `js/app.js` | Le point d'entrée : affiche le bon écran selon l'adresse, enregistre le service worker. |
| `js/version.js` | Lit la version qui tourne et propose de recharger quand une nouvelle est prête. |
| `js/dom.js` | Petits outils pour fabriquer des éléments de page sans `innerHTML`, et les icônes. |
| `js/modale.js` | Les demandes de confirmation, en feuille du bas. |
| `js/texte.js` | Le balisage japonais : `[漢字\|よみ]`, `（…）`, texte à lire à voix haute. |
| `js/validation.js` | Vérifie qu'un fichier de pièce est correct avant de l'accepter. |
| `js/stockage.js` | Lit et écrit dans `localStorage` : réglages, sélection, progression. |
| `js/sauvegarde.js` | Copie ces données dans un fichier et les récupère. |
| `js/telechargement.js` | Retire une pièce du téléphone et la retélécharge. |
| `js/langues.js` et `js/langues/` | La langue de l'app et ses dictionnaires, un fichier par langue. |
| `js/pincement.js` | Reconnaît le pincement à deux doigts. |
| `js/gestes.js` | Les gestes des cartes : appui long, glissement à droite ou à gauche, balayage du filage. |
| `js/tuto.js` | Les tutos des gestes, derrière la pastille « ? ». |
| `js/pieces.js` | Charge les pièces, calcule la progression, le signal d'entrée et les enchaînements. |
| `js/voix.js` | La lecture à voix haute et ses précautions pour Android. |
| `js/affichage.js` | Les briques communes aux écrans : réplique, interrupteurs, avertissements. |
| `js/ecrans/` | Un fichier par écran : pièces, script, mes répliques, fiches, filage, vocabulaire, réglages. |
| `outils/verifier-piece.mjs` | Vérifie une pièce avec les mêmes règles que l'app. Tourne sur l'ordinateur. |
| `outils/generer-audio.mjs` | Fabrique les voix avec AivisSpeech. Tourne sur l'ordinateur. |
| `icons/` | Les dessins sources (SVG) et les icônes exportées (PNG). |
| `.nojekyll` | Fichier vide : dit à GitHub Pages de publier les fichiers tels quels. |
| `AGENTS.md` | Les consignes du projet pour les assistants de code (Codex, Claude Code). |
| `CLAUDE.md` | Importe `AGENTS.md` : Claude Code lit ce nom-là. |
| `.agents/skills/nouvelle-piece/` | Le skill qui transforme un PDF de pièce en fichier Awaseru, avec une pièce d'exemple. Codex le lit ici. |
| `.claude/skills/nouvelle-piece/` | Le même skill pour Claude Code, qui renvoie au précédent. |

### L'apparence

Awaseru utilise le thème clair du design kit de Louis, comme Faktur et SessionConnect : fond papier, sauge, ambre, Fraunces pour les titres, Karla pour le texte. L'app ne suit pas le mode sombre du téléphone.

Le kit fonctionne par copie : le maître est dans `P:\_DEV\design-kit`. Pour reprendre une nouvelle version, recopie `tokens.css` et `base.css` dans `design-kit/`, puis augmente `VERSION` dans `sw.js`.

Le kit charge normalement ses polices depuis Google Fonts. Awaseru garde les siennes dans `polices/` : aucune ressource externe, et la même typographie hors ligne. Le japonais reste affiché avec la police du téléphone.

### Tester sur l'ordinateur

L'original n'a pas de pièces : pour tester avec des pièces, fais-le dans une copie. Dans son dossier :

```bash
python -m http.server 8000
```

Puis ouvre <http://localhost:8000> dans Chrome. Il faut passer par ce petit serveur : ouvrir `index.html` en double-cliquant ne fonctionne pas, car les modules JavaScript et le service worker sont refusés pour un fichier local.

**Piège quand tu modifies le code.** Une fois le service worker en place, le navigateur sert sa copie, pas tes fichiers. Pour voir tes changements : monte le numéro `VERSION` dans `sw.js`, ou bien, dans Chrome, ouvre les outils de développement (F12), onglet *Application*, section *Service workers*, et coche *Update on reload*.

### Tester depuis le téléphone, sur le même Wi-Fi

1. Laisse le serveur tourner sur l'ordinateur.
2. Trouve l'adresse de l'ordinateur : tape `ipconfig` dans un terminal et repère « Adresse IPv4 » (par exemple `192.168.1.20`).
3. Sur le téléphone, ouvre dans Chrome `http://192.168.1.20:8000` avec ton adresse.
4. Si la page ne s'ouvre pas, le pare-feu de Windows bloque sans doute Python : autorise-le sur les réseaux privés.

**Limite importante : sans HTTPS, l'installation et le hors-ligne ne marchent pas.** Chrome réserve les service workers aux adresses sécurisées (HTTPS ou `localhost`). Une adresse en `http://192.168...` permet de tester l'affichage et la voix, rien de plus. Pour installer l'app, il faut la mettre en ligne.

### Publier une mise à jour

1. Modifie les fichiers.
2. **Augmente le bon numéro de version** (1 devient 2) : `VERSION` dans `sw.js` pour le code (dans l'original), `VERSION_PIECES` dans `pieces/version.js` pour une pièce ou une voix (dans une copie). Sans cela, le téléphone garde indéfiniment l'ancienne version : il ne détecte une mise à jour que si l'un de ces deux fichiers change.
3. Envoie les changements :

   ```bash
   git add .
   ```

   ```bash
   git commit -m "Ce que j'ai changé"
   ```

   ```bash
   git push
   ```

4. Pour le code, chaque troupe le récupère ensuite avec **Sync fork**. Sur le téléphone, un bandeau « Nouvelle version prête » apparaît : touche-le.
