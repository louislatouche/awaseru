// Les commandes de l'écran de verrouillage et des écouteurs, pendant une lecture.
//
// Le navigateur affiche ces commandes de lui-même dès qu'un fichier audio se joue (une notification
// Android, l'écran verrouillé, les boutons des écouteurs Bluetooth). L'API Media Session permet d'y
// mettre le titre de la pièce et de dire à l'app ce que font Lecture, Pause et Suivant.
// Lu : https://developer.mozilla.org/fr/docs/Web/API/Media_Session_API
//
// Ce module sait aussi si une lecture est en cours : app.js le demande avant de recharger l'app en
// arrière-plan (une nouvelle version qui attend), pour ne pas couper la voix écran éteint.

const disponible = () => 'mediaSession' in navigator;

let lectureEnCours = false;

export const lectureActive = () => lectureEnCours;

// Une lecture commence (ou reprend) : le titre de la pièce, et ce que font les boutons.
// actions : { lecture, pause, suivant }, chacune facultative.
export function ouvrirSession({ titre, sousTitre = '', actions = {} }) {
  lectureEnCours = true;
  if (!disponible()) return;
  navigator.mediaSession.metadata = new MediaMetadata({
    title: titre,
    artist: sousTitre,
    album: 'Awaseru',
    artwork: [{ src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' }],
  });
  const brancher = (nom, action) => {
    try {
      navigator.mediaSession.setActionHandler(nom, action ? () => action() : null);
    } catch {
      // Une action que ce navigateur ne connaît pas : on s'en passe.
    }
  };
  brancher('play', actions.lecture);
  brancher('pause', actions.pause);
  brancher('nexttrack', actions.suivant);
  navigator.mediaSession.playbackState = 'playing';
}

// La lecture se met en pause : les boutons restent, l'écran de verrouillage affiche « Lecture ».
export function sessionEnPause() {
  lectureEnCours = false;
  if (disponible()) navigator.mediaSession.playbackState = 'paused';
}

// La lecture reprend après une pause.
export function sessionEnLecture() {
  lectureEnCours = true;
  if (disponible()) navigator.mediaSession.playbackState = 'playing';
}

// Fin de la lecture, ou on quitte l'écran : plus de titre ni de boutons.
export function fermerSession() {
  lectureEnCours = false;
  if (!disponible()) return;
  for (const nom of ['play', 'pause', 'nexttrack']) {
    try { navigator.mediaSession.setActionHandler(nom, null); } catch { /* inconnue ici */ }
  }
  navigator.mediaSession.metadata = null;
  navigator.mediaSession.playbackState = 'none';
}
