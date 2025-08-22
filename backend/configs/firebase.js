import admin from "firebase-admin";

import serviceAccount from "./serviceAccountKey.json" with { type: "json" };

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://ecommerce-ab457.firebaseio.com"
});

const db = admin.firestore();
const auth = admin.auth();

export {
  db,
  auth,
  admin  
}
