import Group from "./group";
import User from "./user";

interface Message {
  id: string;
  content: string;
  createdAt: string;
  type: MessageType;
  sender: User;
  group: Group;
}

export type MessageType = "text" | "image" | "video" | "voice" | "file" | "system";

export default Message;
