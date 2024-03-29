import { FriendRequest } from "./FriendRequest.js";

export type User = {
  id: string;
  friends: string[];
  goals: string[];
  username: string[];
  email: string;
  posts: string[];
  incomingRequests: string[];
  outgoingRequests: string[];
};
