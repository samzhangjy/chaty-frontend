import { serverUrl } from "@/config/server";
import Message from "@/types/message";
import { getCookie } from "cookies-next";
import { Socket, io } from "socket.io-client";

export interface ServerToClientEvents {
  recvGroupMessage: (v: Message) => void;
}

export interface ClientToServerEvents {
  sendGroupMessage: (body: { msg: string; groupId: number; type: string }) => {
    msg: string;
    groupId: number;
    type: string;
  };
}

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(serverUrl!, {
  extraHeaders: {
    Authorization: `Bearer ${getCookie("chaty-token")}`,
  },
});
