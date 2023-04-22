import Group, { GroupRoles } from "./group";

export interface GroupToUser {
  id: string;
  group: Group;
  role: GroupRoles;
  user: User;
}

interface User {
  id: number;
  username: string;
  email: string;
  lastLoginAt: Date;
  socketId: string | null;
  online: boolean;
  joinedGroups: GroupToUser[];
}

export default User;
