import { initializeApp, applicationDefault, cert } from "firebase-admin/app";
import { ServiceAccount } from "firebase-admin";
import {
    getFirestore,
    Timestamp,
    FieldValue,
    Filter,
} from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";

import serviceAccount from "../secretKey.json" assert { type: "json" };

initializeApp({
    credential: cert(serviceAccount as ServiceAccount),
    storageBucket: "mile-4b447.appspot.com",
});

export const bucket = getStorage().bucket();
export const db = getFirestore();
