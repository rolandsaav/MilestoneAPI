export interface Database {
  getUsers: getUsers;
  getUser: getUser;
}

interface getUser {
  (): string;
}

interface getUsers {
  (): Array<string>;
}
