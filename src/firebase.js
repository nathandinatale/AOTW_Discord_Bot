import { initializeApp } from "firebase/app";
import { get, getDatabase, onValue, ref, set } from "firebase/database";

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

export async function getAlbumTitles() {
  const db = getDatabase();
  const titleRef = ref(db, "albums/");

  return get(titleRef)
    .then((snapshot) => {
      const data = snapshot.val();
      let albums = [];
      Object.entries(data).forEach(([key, value]) => {
        albums = albums.concat({ title: value.title, id: key });
      });
      return albums;
    })
    .catch((error) => {
      console.log("Something went wrong");
      return;
    });
}

export async function getAlbum(messageId) {
  const db = getDatabase();
  const albumRef = ref(db, "albums/" + messageId);

  return get(albumRef)
    .then((snapshot) => {
      const data = snapshot.val();
      console.log(data);
      return data;
    })
    .catch((error) => {
      console.log("Something went wrong fetching this album");
      return;
    });
}

export async function integerizeRatings() {
  const db = getDatabase();
  const titleRef = ref(db, "albums/");

  const converterMap = new Map();
  converterMap.set("1️⃣", 1);
  converterMap.set("2️⃣", 2);
  converterMap.set("3️⃣", 3);
  converterMap.set("4️⃣", 4);
  converterMap.set("5️⃣", 5);
  converterMap.set("6️⃣", 6);
  converterMap.set("7️⃣", 7);
  converterMap.set("8️⃣", 8);
  converterMap.set("9️⃣", 9);
  converterMap.set("🔟", 10);

  return get(titleRef)
    .then((snapshot) => {
      const data = snapshot.val();
      Object.entries(data).forEach(([key, value]) => {
        const albumKey = key;
        Object.entries(value.ratings).forEach(([rateKey, rateValue]) => {
          if (converterMap.get(rateValue.rating)) {
            writeRatingData(
              albumKey,
              rateKey,
              rateValue.user,
              converterMap.get(rateValue.rating)
            );
          }

          console.log(rateKey);
          console.log(albumKey);
          console.log(rateValue);
        });
      });
      return;
    })
    .catch((error) => {
      console.log("Something went wrong");
      return;
    });
}

export const firebaseApp = initializeApp(firebaseConfig);
export const firebaseRDB = getDatabase(firebaseApp);
