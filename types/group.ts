import Message from "./message";
import { GroupToUser } from "./user";

interface Group {
  id: number;
  name: string;
  createdAt: Date;
  lastMessage: Message;
  unreadCount: number;
  members: GroupToUser[];
}

export type GroupRoles = "owner" | "admin" | "member";

export default Group;
