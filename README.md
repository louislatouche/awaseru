# Awaseru

*[Version française](README.fr.md)*

An installable web app (PWA) for learning your lines in a Japanese play, on an Android phone. It works offline and keeps all its data on the phone: no server, no account.

This repository is **the original** Awaseru: the code only, without any play. Each troupe makes **its own copy** on its GitHub account, adds its plays, and publishes it for free at its own address. Each troupe's plays and data stay with that troupe. When the original improves, two clicks are enough to get the improvement.

## Get Awaseru for your troupe

### The easiest way: let your assistant guide you

1. You need an assistant that works **on your computer** (an online chat alone is not enough):
   - **Claude Code**: the *Code* tab of the Claude app ([install it](https://code.claude.com/docs/en/desktop-quickstart)), with a Claude Pro plan or higher;
   - or **Codex**: the *Codex* mode of the ChatGPT app ([install it](https://learn.chatgpt.com/docs/app)), included in the free plan, with limited access.
2. Create an empty folder on your computer (for example *Documents/Awaseru*) and open it in your assistant.
3. Copy the message below, paste it into your assistant, send it, and let it guide you.

The first thing your assistant will do is ask **which language you want to speak**: answer with yours, and everything else will be in that language. It will then ask how you want to set things up: **by the AI** (it does everything itself; you only sign in to GitHub once by typing a code) or **yourself** (it guides you, and you do the steps on the GitHub website).

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

To add another play later, or to get Awaseru's improvements, open the same folder in your assistant and paste the same message again.

**Good to know before you start:**

- **Your copy is public** (that is the condition for publishing it for free): the text of your plays will be visible to everyone.
- **Only one copy of Awaseru per GitHub account** (see below).
- **The first play takes time**: AivisSpeech, which makes the voices, downloads almost one gigabyte when it first starts, then about 240 MB per voice.
- **With a limited plan**, a long play may use up your quota along the way: the work is saved on your computer, and the assistant will pick it up later.

### Why an AI?

**The app itself has no AI.** Awaseru works without a server, without an account, and offline. Your lines, your progress and your settings stay on your phone. The AI only steps in once per play, on the troupe's computer, to prepare it.

**Preparing a play is expert work, long and meticulous.** For a script of about forty lines, you need to:

- give the reading of each kanji according to its context (一人 is read ひとり, 今日 is read きょう), including irregular readings;
- split each line into words, give each one its dictionary form and its translation, mark the particles, and keep the same words from one play to the next: almost two hundred words for a single short play;
- fix the characters that some PDFs encode badly, and add the translations;
- choose a voice for each role, make the voices, and check that the engine pronounces every word correctly.

The file of a short play is almost 100,000 characters long. By hand, it would take days and a good knowledge of Japanese. With an AI, it is done in one session.

**The AI does not work alone.**

- A tool checks each play with the same rules as the app, without AI.
- The AI points out readings that are open to debate: you decide.
- You listen to each voice before it is published.
- The teacher's text is never corrected: typos are only pointed out.

**It also handles the setup.** GitHub copy, publishing, tools: it takes care of them for troupes that know nothing about computers.

**It is not mandatory.** Everything is described so you can do it by hand (see "Adding a play by hand").

**Good to know:**

- the PDF of the script is sent to the AI (Anthropic for Claude, OpenAI for Codex);
- the voices are made on your computer by AivisSpeech, for free, without sending anything online;
- in any case, the text of the plays becomes public on GitHub.

### Step by step, in detail

What your assistant will have you do if you choose "myself", or if you would rather do without it.

#### 1. Make your copy

1. Signed in to GitHub, open <https://github.com/awaseru-app/awaseru>.
2. At the top right, tap **Fork**.
3. On the *Owner* line, choose your account. On the *Repository name* line, keep `awaseru`: this name is part of your app's address. Leave the box that copies only the `main` branch checked.
4. Tap **Create fork**.

**Only one copy of Awaseru per GitHub account.** Two copies on the same account would be on the same site, and therefore in the same phone storage: their data would get mixed up. For a second troupe, use another account, or a GitHub organization.

#### 2. Put it online

1. On your copy's page, open **Settings**, then **Pages** in the left column.
2. Under **Build and deployment**, on the **Source** line, choose **Deploy from a branch**.
3. Choose the `main` branch and the `/ (root)` folder, then tap **Save**.
4. A few minutes later, your app is online at `https://YOURACCOUNT.github.io/awaseru/`. It is still empty: *My plays* shows nothing.

If it is still not online after ten minutes, open the **Actions** tab of your copy: if GitHub asks you to allow the workflows, accept.

#### 3. Add your plays

1. Install Git, which downloads your copy to your computer and sends it back to GitHub. On Windows, in a terminal: `winget install --id Git.Git`. On a Mac, type `git --version` in the Terminal: macOS offers to install it if it is missing.
2. Download your copy to your computer: `git clone https://github.com/YOURACCOUNT/awaseru`.
3. Open the `awaseru` folder in your assistant, then start the skill that adds a play: `/nouvelle-piece path/to/the/script.pdf` in Claude Code, `$nouvelle-piece` followed by the path of the PDF in Codex. The assistant checks that it has its tools (Node.js, ffmpeg and AivisSpeech) and asks for your permission to install the missing ones. Then it converts the script, makes the voices, checks everything and offers to publish it. The first time your computer sends something to GitHub, a window asks you to sign in.
4. Read the points the assistant raises (kanji readings, typos), and listen to the excerpt of each voice that it sends you in the conversation, before it publishes.

#### 4. Get Awaseru's improvements

1. On your copy's page, above the list of files, tap **Sync fork**.
2. Tap **Update branch**.

Your site updates within a few minutes, and the phones show "New version ready". On your computer, your copy is updated with `git pull` (the message to copy takes care of it).

If GitHub offers to open a *pull request* instead, a file was changed outside the `pieces/` folder in your copy. Do not insist, and ask for help at <https://github.com/awaseru-app/awaseru/issues>.

### The golden rule

**In your copy, change nothing outside the `pieces/` folder.** That is what lets you get the improvements without ever breaking anything. Codex and Claude Code know it: it is written in `AGENTS.md`.

## Install on Android

1. Open `https://YOURACCOUNT.github.io/awaseru/` in Chrome and let the page load for a few seconds.
2. Chrome's **⋮** menu, then **Add to Home screen** or **Install app** (the wording depends on the version).
3. Awaseru appears on the home screen and opens without the address bar.
4. To check that it works offline: switch to airplane mode and open the app.

The version number is shown at the bottom of the Settings: "131.4" means the code in version 131 and your troupe's plays in version 4.

### The Japanese voice

Awaseru reads its plays with its recorded voices. The phone's voice is only a fallback, or used if you turn off the "Use the recorded voices" setting. To install it:

**Android Settings > Text-to-speech** (sometimes under Accessibility or General management) **> Google engine > install voice data > Japanese.** Then close and reopen Awaseru.

## Choosing your lines

Awaseru is for the whole troupe: nothing is preselected, everyone checks their own lines in the *My lines* screen. To go faster, pinch the screen with two fingers: only a grid of numbers to tap remains. Spread two fingers to go back to the text.

## Your data

The chosen lines, the progress and the settings stay on the phone, in the browser's storage. They disappear if you clear Chrome's "cookies and site data". In the Settings, *Back up* makes a copy of them in a file, and *Restore* gets them back, even on another phone.

*Remove from this phone*, on a play's card, deletes its voices from this phone to free up space, without changing anything on the site. The *Download plays* line, at the bottom of *My plays*, opens the list of the site's plays, like a browser's extensions list: check the missing ones, then *Download* gets them (a network connection is needed). Removing a play never touches the chosen lines or the progress, and app updates do not reinstall a removed play.

## Plays, in detail

Everything that belongs to a troupe is in `pieces/`:

| File | Role |
|---|---|
| `pieces/index.json` | The troupe's list of plays: `["my-play.json", "another.json"]`. Empty in the original. |
| `pieces/<id>.json` | A play: text, furigana, translations, vocabulary. |
| `pieces/audio/<id>/` | Its voices: one MP3 per line, and `voix.json`, the choice of a voice for each role. |
| `pieces/audio/index.json` | The list of all the MP3s, kept up to date by `outils/generer-audio.mjs`. |
| `pieces/version.js` | The plays' version number. **Increase it with every change** in this folder, otherwise the phones keep the old plays. |

### Adding a play by hand

1. Put the file in `pieces/`.
2. Add its name to `pieces/index.json`.
3. Choose the voices in `pieces/audio/<id>/voix.json`, then generate the audio (see "The voices").
4. Check the play: `node outils/verifier-piece.mjs <id>`.
5. Increase `VERSION_PIECES` in `pieces/version.js`, then publish.

The full model, vocabulary included, is `.agents/skills/nouvelle-piece/exemple/neko-to-tsuki.json`: a short invented play.

### The voices

The plays have one recorded voice per role: MP3 files generated in advance on the computer with [AivisSpeech](https://aivis-project.com/), free and local. They therefore work offline, with the same voice on every phone. The app uses the phone's voice if a file is missing. A setting lets you compare them.

To change a voice, edit `pieces/audio/<id>/voix.json`, start AivisSpeech, then:

```bash
node outils/generer-audio.mjs <id>
```

To redo only a few lines, add their numbers at the end of the command. `ffmpeg` must be installed. Then increase `VERSION_PIECES` in `pieces/version.js`, and publish.

The script keeps the kanji, because the engine recognizes words better than with kana alone. It then compares the engine's reading with your furigana: where they differ, it replaces that kanji with its reading, and reports it.

### Format of a play file

```json
{
  "format": 1,
  "id": "my-play",
  "titre": "ねこと[月|つき]",
  "titre_fr": "Le Chat et la Lune",
  "explication": "Quelques mots sur la pièce.",
  "liens": ["https://exemple.fr/facultatif"],
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

The rules the app checks when loading a play:

- **Line numbers** (`numero`): unique in the whole play, not just within a scene. Progress is attached to them, so avoid renumbering.
- **`role`**: the `id` of a declared role, or `null` for a line without a role. A line without a role is read by the app, unless you check it in *My lines*.
- **`[漢字|よみ]`**: shows the kanji with its reading, and the reading is what gets pronounced.
- **`（…）`**: stage direction or sound effect, in grey italics, not read by default. Only Japanese parentheses count.
- **`\n`**: line break.
- **`liens`**: the addresses about the whole play (a video, a page...), as a list. They are shown in *About this play*, each with the name of its site.
- **`lien`**: only an `http` or `https` address. It is shown in *About this play*, next to the role's name. Its label depends on the address: *Watch the video* for YouTube or Vimeo, otherwise *Open the link*.
- **Optional**: `format`, `id` (otherwise the file name is used), `liens`, `nom_court`, `note`, `lien`.
- **Translations**: each troupe has its plays translated into its own language and into English, the common language. French fields are named as above (`fr`, `titre_fr`, `nom_fr`, and `explication`, `note`, `credit` without a suffix); other languages use their two-letter code instead: `en`, `titre_en`, `explication_en`, `nom_en`, `note_en`, `credit_en`, or `de`, `titre_de`... for German. The app shows the phone's language if the play has it, otherwise English, otherwise French. At least one translation is required, in any language.

## For those who change the code

The code is only changed in the original. Each troupe then gets the change with **Sync fork**. The code comments are in French.

### What each file does

| File | Role |
|---|---|
| `index.html` | The app's only page: three empty areas that the JavaScript fills. |
| `manifest.webmanifest` | The app's identity card for Android: name, icons, full-screen mode. |
| `sw.js` | The service worker: keeps a copy of the app for offline use. Holds the code's version number. |
| `css/style.css` | Awaseru's own styles, on top of the design kit. |
| `css/polices.css` | Declares the fonts stored in `polices/`. |
| `design-kit/` | An exact copy of the design kit's `tokens.css` and `base.css`: colors, buttons, cards. Do not edit them here. |
| `polices/` | Fraunces, Karla and Poppins, served by the app to stay offline, with their licenses. |
| `js/app.js` | The entry point: shows the right screen for the address, registers the service worker. |
| `js/version.js` | Reads the running version and offers to reload when a new one is ready. |
| `js/dom.js` | Small tools to build page elements without `innerHTML`, and the icons. |
| `js/modale.js` | Confirmation requests, as bottom sheets. |
| `js/texte.js` | The Japanese markup: `[漢字\|よみ]`, `（…）`, text to read aloud. |
| `js/validation.js` | Checks that a play file is correct before accepting it. |
| `js/stockage.js` | Reads and writes `localStorage`: settings, selection, progress. |
| `js/sauvegarde.js` | Copies this data to a file and gets it back. |
| `js/telechargement.js` | Removes a play from the phone and downloads it again. |
| `js/langues.js` and `js/langues/` | The app's language and its dictionaries, one file per language. |
| `js/pincement.js` | Recognizes the two-finger pinch. |
| `js/gestes.js` | The card gestures: long press, swipe left or right, the run-through's swipe up. |
| `js/tuto.js` | The gesture tutorials, behind the "?" badge. |
| `js/pieces.js` | Loads the plays, computes progress, the cue line and the sequences. |
| `js/voix.js` | Reading aloud, and its precautions for Android. |
| `js/affichage.js` | The building blocks shared by the screens: line, toggles, warnings. |
| `js/ecrans/` | One file per screen: plays, script, my lines, cards, run-through, vocabulary, settings. |
| `outils/verifier-piece.mjs` | Checks a play with the same rules as the app. Runs on the computer. |
| `outils/generer-audio.mjs` | Makes the voices with AivisSpeech. Runs on the computer. |
| `icons/` | The source drawings (SVG) and the exported icons (PNG). |
| `.nojekyll` | Empty file: tells GitHub Pages to publish the files as they are. |
| `AGENTS.md` | The project's instructions for coding assistants (Codex, Claude Code). |
| `CLAUDE.md` | Imports `AGENTS.md`: Claude Code reads this name. |
| `.agents/skills/nouvelle-piece/` | The skill that turns a play's PDF into an Awaseru file, with an example play. Codex reads it here. |
| `.claude/skills/nouvelle-piece/` | The same skill for Claude Code, pointing to the previous one. |

### The look

Awaseru uses the light theme of Louis's design kit, like Faktur and SessionConnect: paper background, sage, amber, Fraunces for titles, Karla for text. The app does not follow the phone's dark mode.

The kit works by copy: the master is in `P:\_DEV\design-kit`. To take a new version, copy `tokens.css` and `base.css` into `design-kit/`, then increase `VERSION` in `sw.js`.

The kit normally loads its fonts from Google Fonts. Awaseru keeps its own in `polices/`: no external resource, and the same typography offline. Japanese is shown with the phone's font.

### Testing on the computer

The original has no plays: to test with plays, do it in a copy. In its folder:

```bash
python -m http.server 8000
```

Then open <http://localhost:8000> in Chrome. You have to go through this small server: opening `index.html` by double-clicking does not work, because JavaScript modules and the service worker are refused for a local file.

**A trap when you change the code.** Once the service worker is in place, the browser serves its copy, not your files. To see your changes: increase the `VERSION` number in `sw.js`, or, in Chrome, open the developer tools (F12), *Application* tab, *Service workers* section, and check *Update on reload*.

### Testing from the phone, on the same Wi-Fi

1. Leave the server running on the computer.
2. Find the computer's address: type `ipconfig` in a terminal and look for "IPv4 Address" (for example `192.168.1.20`).
3. On the phone, open `http://192.168.1.20:8000` in Chrome, with your address.
4. If the page does not open, Windows' firewall is probably blocking Python: allow it on private networks.

**Important limit: without HTTPS, installing and offline use do not work.** Chrome reserves service workers for secure addresses (HTTPS or `localhost`). An `http://192.168...` address lets you test the display and the voice, nothing more. To install the app, it has to be online.

### Publishing an update

1. Change the files.
2. **Increase the right version number** (1 becomes 2): `VERSION` in `sw.js` for the code (in the original), `VERSION_PIECES` in `pieces/version.js` for a play or a voice (in a copy). Without this, the phone keeps the old version forever: it only detects an update if one of these two files changes.
3. Send the changes:

   ```bash
   git add .
   ```

   ```bash
   git commit -m "What I changed"
   ```

   ```bash
   git push
   ```

4. For the code, each troupe then gets it with **Sync fork**. On the phone, a "New version ready" banner appears: tap it.
