import { initializeApp, applicationDefault, cert } from "firebase-admin/app";
import { ServiceAccount } from "firebase-admin";
import {
  getFirestore,
  Timestamp,
  FieldValue,
  Filter,
} from "firebase-admin/firestore";

import serviceAccount from "../secretKey.json" assert { type: "json" };

initializeApp({
  credential: cert(serviceAccount as ServiceAccount),
});

export const db = getFirestore();
