import express from "express";
import { db } from "../firebase.js";
import { Filter, FieldValue } from "@google-cloud/firestore";
import { v4 as uuidV4 } from "uuid";

const router = express.Router();
const userCollection = db.collection("users");
const goalCollection = db.collection("goals");

router.get("/", async (req, res) => {
  try {
    const goalsSnapshot = await goalCollection.get();

    let goals = [];
    goalsSnapshot.forEach((goal) => {
      goals.push(goal.data());
    });

    res.json(goals);
  } catch {}
});

export default router;
