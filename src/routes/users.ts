import express from "express";
import { db } from "../firebase.js";
import { Filter, FieldValue } from "@google-cloud/firestore";
import { v4 as uuidV4 } from "uuid";
import { User } from "../types/User.js";
import { Goal } from "../types/Goal.js";

const router = express.Router();
const userCollection = db.collection("users");
const goalCollection = db.collection("goals");

router.get("/", async (req, res) => {
    try {
        const usersSnapshot = await userCollection.get();
        const users = [];
        usersSnapshot.forEach((doc) => {
            users.push(doc.data());
        });
        res.json(users);
    } catch {
        /* empty */
    }
});
router.get("/:id", async (req, res) => {
    try {
        const userSnapshot = await userCollection.doc(req.params.id).get();

        if (!userSnapshot.exists) {
            res.status(400);
            res.send("No user with that id exists");
            return;
        }

        res.json(userSnapshot.data());
    } catch {
        /* empty */
    }
});

type createUserBody = {
    username: string;
    email: string;
};
router.post("/create", async (req, res) => {
    try {
        const newId = uuidV4();

        const body: createUserBody = req.body;

        if (
            body.email.trim().length === 0 &&
            body.username.trim().length === 0
        ) {
            res.status(400);
            res.send("Body wasn't right");
            return;
        }
        const newUser: User = {
            id: newId,
            username: req.body.username,
            email: req.body.email,
            friends: [],
            goals: [],
            incomingRequests: [],
            outgoingRequests: [],
        };

        const containsUserRes = await userCollection
            .where(
                Filter.or(
                    Filter.where("username", "==", newUser.username),
                    Filter.where("email", "==", newUser.email),
                ),
            )
            .get();

        if (!containsUserRes.empty) {
            res.status(400);
            res.send("The user already exists");
            return;
        }

        await userCollection.doc(newId).set(newUser);
        res.json(newUser);
    } catch {
        /* empty */
    }
});
router.get("/:id", async (req, res) => {
    try {
        const userSnapshot = await userCollection.doc(req.params.id).get();

        if (!userSnapshot.exists) {
            res.status(400);
            res.send("No user with that id exists");
            return;
        }

        res.json(userSnapshot.data());
    } catch {
        /* empty */
    }
});

router.post("/:id/request", async (req, res) => {
    const id = req.params.id;
    const otherId = req.body.friendId;

    if (otherId === undefined) {
        res.status(400);
        res.send("No other user id was provided");
        return;
    }

    const userPromise = userCollection.doc(id).get();
    const otherUserPromise = userCollection.doc(otherId).get();

    const userResults = await Promise.all([userPromise, otherUserPromise]);

    const userSnapshot = userResults[0];
    const otherUserSnapshot = userResults[1];

    if (!userSnapshot.exists || !otherUserSnapshot.exists) {
        res.status(400);
        res.send("At least one of those users was not found in the database");
        return;
    }

    const userData = userSnapshot.data();
    const otherUserData = otherUserSnapshot.data();

    if (
        userData.friends !== undefined &&
        (userData.friends as string[]).includes(otherId)
    ) {
        res.status(400);
        res.send("The users are already friends");
        return;
    }

    if (
        userData !== undefined &&
        (userData.outgoingRequests as string[]).includes(otherId)
    ) {
        res.status(400);
        res.send("A friend request has already been sent.");
        return;
    }

    if (
        userData !== undefined &&
        (userData.incomingRequests as string[]).includes(otherId)
    ) {
        const updateUserPromise = userCollection
            .doc(id)
            .update({ friends: FieldValue.arrayUnion(otherId) });

        const updateOtherUserPromise = userCollection
            .doc(otherId)
            .update({ friends: FieldValue.arrayUnion(id) });

        const updateResults = await Promise.all([
            updateUserPromise,
            updateOtherUserPromise,
        ]);

        res.send(
            `User with id ${userSnapshot.data().username} and user with id ${
                otherUserSnapshot.data().username
            } are now friends!`,
        );

        return;
    }

    const updateUserPromise = userCollection
        .doc(id)
        .update({ outgoingRequests: FieldValue.arrayUnion(otherId) });

    const updateOtherUserPromise = userCollection
        .doc(otherId)
        .update({ incomingRequests: FieldValue.arrayUnion(id) });

    const updateResults = await Promise.all([
        updateUserPromise,
        updateOtherUserPromise,
    ]);

    res.send(
        `User with id ${
            userSnapshot.data().username
        } has sent a friend requests to user with id ${
            otherUserSnapshot.data().username
        }!`,
    );
});

router.post("/:id/accept", async (req, res) => {
    const id = req.params.id;
    const otherId = req.body.friendId;

    if (otherId === undefined) {
        res.status(400);
        res.send("No other user id was provided");
        return;
    }

    const userPromise = userCollection.doc(id).get();
    const otherUserPromise = userCollection.doc(otherId).get();

    const userResults = await Promise.all([userPromise, otherUserPromise]);

    const userSnapshot = userResults[0];
    const otherUserSnapshot = userResults[1];

    if (!userSnapshot.exists || !otherUserSnapshot.exists) {
        res.status(400);
        res.send("At least one of those users was not found in the database");
        return;
    }

    const userData = userSnapshot.data();
    const otherUserData = otherUserSnapshot.data();

    if (
        userData.friends !== undefined &&
        (userData.friends as string[]).includes(otherId)
    ) {
        res.status(400);
        res.send("The users are already friends");
        return;
    }

    if (
        userData !== undefined &&
        !(userData.incomingRequests as string[]).includes(otherId)
    ) {
        res.status(400);
        res.send("Specified request does not exist.");
        return;
    }

    const updateUserPromise = userCollection
        .doc(id)
        .update({
            friends: FieldValue.arrayUnion(otherId),
            incomingRequests: FieldValue.arrayRemove(otherId),
        });

    const updateOtherUserPromise = userCollection
        .doc(otherId)
        .update({
            friends: FieldValue.arrayUnion(id),
            outgoingRequests: FieldValue.arrayRemove(id),
        });

    const updateResults = await Promise.all([
        updateUserPromise,
        updateOtherUserPromise,
    ]);

    res.send(
        `User with id ${userSnapshot.data().username} and user with id ${
            otherUserSnapshot.data().username
        } are now friends!`,
    );
});

router.post("/:id/reject", async (req, res) => {
    const id = req.params.id;
    const otherId = req.body.friendId;

    if (otherId === undefined) {
        res.status(400);
        res.send("No other user id was provided");
        return;
    }

    const userPromise = userCollection.doc(id).get();
    const otherUserPromise = userCollection.doc(otherId).get();

    const userResults = await Promise.all([userPromise, otherUserPromise]);

    const userSnapshot = userResults[0];
    const otherUserSnapshot = userResults[1];

    if (!userSnapshot.exists || !otherUserSnapshot.exists) {
        res.status(400);
        res.send("At least one of those users was not found in the database");
        return;
    }

    const userData = userSnapshot.data();
    const otherUserData = otherUserSnapshot.data();

    if (
        userData.friends !== undefined &&
        (userData.friends as string[]).includes(otherId)
    ) {
        res.status(400);
        res.send("The users are already friends");
        return;
    }

    if (
        userData !== undefined &&
        !(userData.incomingRequests as string[]).includes(otherId)
    ) {
        res.status(400);
        res.send("Specified request does not exist.");
        return;
    }

    const updateUserPromise = userCollection
        .doc(id)
        .update({ incomingRequests: FieldValue.arrayRemove(otherId) });

    const updateOtherUserPromise = userCollection
        .doc(otherId)
        .update({ outgoingRequests: FieldValue.arrayRemove(id) });

    const updateResults = await Promise.all([
        updateUserPromise,
        updateOtherUserPromise,
    ]);

    res.send(
        `User with id ${
            userSnapshot.data().username
        } has rejected the request from id ${
            otherUserSnapshot.data().username
        }`,
    );
});

router.post("/:id/add", async (req, res) => {
    const id = req.params.id;
    const otherId = req.body.friendId;

    if (otherId === undefined) {
        res.status(400);
        res.send("No other user id was provided");
        return;
    }

    const userPromise = userCollection.doc(id).get();
    const otherUserPromise = userCollection.doc(otherId).get();

    const userResults = await Promise.all([userPromise, otherUserPromise]);

    const userSnapshot = userResults[0];
    const otherUserSnapshot = userResults[1];

    if (!userSnapshot.exists || !otherUserSnapshot.exists) {
        res.status(400);
        res.send("At least one of those users was not found in the database");
        return;
    }

    const userData = userSnapshot.data();
    // const otherUserData = otherUserSnapshot.data();

    if (
        userData.friends !== undefined &&
        (userData.friends as string[]).includes(otherId)
    ) {
        res.status(400);
        res.send("The users are already friends");
        return;
    }

    const updateUserPromise = userCollection
        .doc(id)
        .update({ friends: FieldValue.arrayUnion(otherId) });

    const updateOtherUserPromise = userCollection
        .doc(otherId)
        .update({ friends: FieldValue.arrayUnion(id) });

    await Promise.all([updateUserPromise, updateOtherUserPromise]);

    res.send(
        `User with id ${userSnapshot.data().username} and user with id ${
            otherUserSnapshot.data().username
        } are now friends!`,
    );
});

router.delete("/delete/:id", async (req, res) => {
    const id = req.params.id;
    const userSnapshot = await userCollection.doc(id).get();

    if (!userSnapshot.exists) {
        res.status(400);
        res.send("Cannot delete user that does not exist");
        return;
    }

    const friends = userSnapshot.data().friends as string[];
    const promises = [] as Promise<FirebaseFirestore.WriteResult>[];

    if (friends !== undefined) {
        friends.forEach((friendId) => {
            promises.push(
                userCollection
                    .doc(friendId)
                    .update({ friends: FieldValue.arrayRemove(id) }),
            );
        });
    }

    const deleteRes = userCollection.doc(id).delete();

    promises.push(deleteRes);

    await Promise.all(promises);
    res.send(`${userSnapshot.data().username} was deleted`);
});

router.post("/:id/create", async (req, res) => {
    const userId = req.params.id;
    const body = req.body;
    const goalId = uuidV4();
    const userDoc = userCollection.doc(userId);

    const userSnapshot = await userDoc.get();
    if (!userSnapshot.exists) {
        res.status(400);
        res.send("Cannot create a goal for a user that does not exist");
        return;
    }

    const updateUserPromise = userDoc.update({
        goals: FieldValue.arrayUnion(goalId),
    });

    const newGoal = {
        id: goalId,
        name: body.name,
        description: body.description,
        members: [userId],
    };

    const createGoalPromise = goalCollection.doc(goalId).set(newGoal);

    await Promise.all([updateUserPromise, createGoalPromise]);

    res.json(newGoal);
});

router.post("/:userId/join/:goalId", async (req, res) => {
    const userId = req.params.userId;
    const goalId = req.params.goalId;

    const userDoc = userCollection.doc(userId);
    const goalDoc = goalCollection.doc(goalId);

    const promises = [];
    promises.push(userDoc.get());
    promises.push(goalDoc.get());

    const results: FirebaseFirestore.DocumentSnapshot[] =
        await Promise.all(promises);

    if (!results[0].exists || !results[1].exists) {
        res.status(400);
        res.send("Either the user or the goal did not exist");
        return;
    }
    const userData = results[0].data() as User;
    const goalData = results[1].data() as Goal;

    if (userData.goals.includes(goalData.id)) {
        res.status(400);
        res.send("This user is already a member of this goal");
        return;
    }

    const updateUserPromise = userDoc.update({
        goals: FieldValue.arrayUnion(goalId),
    });
    const updateGoalPromise = goalDoc.update({
        members: FieldValue.arrayUnion(userId),
    });

    const updateResults = await Promise.all([
        updateUserPromise,
        updateGoalPromise,
    ]);

    res.send(
        `${userData.username} has joined ${
            goalData.name
        }. Data was written at: ${updateResults[0].writeTime.toMillis()} and ${updateResults[1].writeTime.toMillis()}`,
    );
});
export default router;
