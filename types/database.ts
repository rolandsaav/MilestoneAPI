export default interface Database {
  getUsers: getUsers;
  getUser: getUser;
}

interface getUsers {
  (): Array<string>;
}

interface getUser {
  (id: number): string;
}
