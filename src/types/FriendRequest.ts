export type FriendRequest = {
    id: string;
    sender: string;
    recipient: string;
    status: number; //0 - pending, 1 - accepted, 2 - rejected
};