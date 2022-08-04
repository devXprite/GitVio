const {
  initializeApp,
  deleteApp,
} = require("firebase/app");

const {
  orderBy,
} = require("lodash");

const dotenv = require("dotenv");

const {
  getDatabase,
  ref,
  set,
  get,
  serverTimestamp,
  query,
  orderByChild,
  limitToLast,
} = require("firebase/database");

dotenv.config();
const { FIREBASE_DATABASE } = process.env;

const firebaseConfig = {
  databaseURL: FIREBASE_DATABASE,
};

// eslint-disable-next-line max-len
const saveToRecent = async (renderData) => new Promise((resolve) => {
  const app = initializeApp(firebaseConfig);
  const db = getDatabase(app);

  const { followers } = renderData.stats;
  const { following } = renderData.stats;
  const { login, avatarUrl } = renderData;

  set(ref(db, `recent/${login}`), {
    login,
    followers,
    following,
    avatarUrl,
    serverTimestamp: serverTimestamp(),
  }).then(() => {
    //
  }).catch((error) => {
    console.log(error);
  }).then(() => {
    deleteApp(app);
    resolve();
  });
});

const recentProfiles = (count = 8) => new Promise((resolve) => {
  const app = initializeApp(firebaseConfig);
  const db = getDatabase(app);

  const qry = query(ref(db, "recent"), orderByChild("serverTimestamp"), limitToLast(count));

  get(qry).then((snapshot) => {
    if (snapshot.exists()) {
      resolve(orderBy(snapshot.val(), "serverTimestamp", "desc"));
    } else {
      resolve([]);
    }
  }).catch((error) => {
    console.log(error);
    resolve([]);
  }).then(() => {
    deleteApp(app);
  });
});

module.exports = { saveToRecent, recentProfiles };
