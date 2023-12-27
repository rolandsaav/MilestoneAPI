export default interface database {
  getUsers: getUsers;
  getUser: getUser;
}

interface getUsers {
  (): Array<string>;
}

interface getUser {
  (id: number): string;
}
