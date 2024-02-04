import express from "express";
import { bucket, db } from "../firebase.js";
import { v4 as uuidV4 } from "uuid";
import { User } from "../types/User.js";
import { Goal } from "../types/Goal.js";
import { UploadedFile } from "express-fileupload";
import { Post } from "../types/Post.js";

const router = express.Router();
const userCollection = db.collection("users");
const goalCollection = db.collection("goals");

router.get("/", async (req, res) => {
    try {
        const goalsSnapshot = await goalCollection.get();

        const goals: Array<FirebaseFirestore.DocumentData> = [];
        goalsSnapshot.forEach((goal) => {
            goals.push(goal.data());
        });

        res.json(goals);
    } catch {
        /* empty */
    }
});

// Create post route
router.post("/:goalId/post/:userId", async (req, res) => {
    const goalId = req.params.goalId;
    const userId = req.params.userId;

    const goalDoc = goalCollection.doc(goalId);
    const goalPromise = await goalDoc.get();

    const userDoc = userCollection.doc(userId);
    const userPromise = await userDoc.get();

    const results = await Promise.all([goalPromise, userPromise]);

    const goalSnapshot = results[0];
    const userSnapshot = results[1];

    if (!goalSnapshot.exists) {
        res.status(400);
        res.send("No goal with that id exists");
        return;
    }
    if (!userSnapshot.exists) {
        res.status(400);
        res.send("No user with that id exists");
        return;
    }

    const evidenceFile: UploadedFile = req.files.evidence as UploadedFile;
    const evidenceId = uuidV4();

    const uploadFileResponse = await bucket
        .file(`evidence/${evidenceId}.jpg`)
        .save(evidenceFile.data)
        .catch(() => {
            console.log("Could not upload file");
        });
    const userData = userSnapshot.data() as User;
    const goalData = goalSnapshot.data() as Goal;

    const postId = uuidV4();

    const newPost = {
        id: postId,
        creatorId: userData.id,
        goalId: goalData.id,
        storageId: evidenceId,
        date: new Date().toISOString(),
    };

    const result = await goalDoc.collection("posts").doc(postId).set(newPost);

    res.send(`New post created at ${result.writeTime.toDate().toDateString()}`);
});

export default router;
