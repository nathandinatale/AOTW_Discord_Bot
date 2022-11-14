import { initializeApp } from "firebase/app";
import { getDatabase, ref, set } from "firebase/database";

export const firebaseConfig = {
  apiKey: process.env.FIREBASE_KEY,
  authDomain: "aotw-bot.firebaseapp.com",
  databaseURL:
    "https://aotw-bot-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "aotw-bot",
  storageBucket: "aotw-bot.appspot.com",
  messagingSenderId: "454722374310",
  appId: "1:454722374310:web:35f156924807fbb9430267",
  measurementId: "G-HWTKE5N3QZ",
};

export function writeAlbumData(
  messageId,
  albumTitle,
  albumArtist,
  albumDescription,
  link,
  posterId,
  posterName
) {
  const db = getDatabase();
  set(ref(db, "albums/" + messageId), {
    title: albumTitle,
    description: albumDescription,
    artist: albumArtist,
    link: link,
    posterId: posterId,
    posterName: posterName,
    ratings: {},
  });
}

export function writeRatingData(messageId, userId, username, rating) {
  const db = getDatabase();
  set(ref(db, "albums/" + messageId + "/ratings/" + userId), {
    user: username,
    rating: rating,
  });
}

export const firebaseApp = initializeApp(firebaseConfig);
export const firebaseRDB = getDatabase(firebaseApp);
