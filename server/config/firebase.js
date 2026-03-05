const admin = require("firebase-admin");
const serviceAccount = require("../serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://cmsc129-lab1-default-rtdb.asia-southeast1.firebasedatabase.app",
});

const db = admin.firestore();
module.exports = { admin, db };