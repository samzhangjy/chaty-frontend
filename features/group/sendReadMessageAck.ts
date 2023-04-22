import { serverUrl } from "@/config/server";
import { FetchError } from "@/utils/fetchError";
import { getCookie } from "cookies-next";

export interface SendReadMessageAckResponse {
  status: "success" | "error";
}

const sendReadMessageAck = async (groupId: number, messageId: string) => {
  try {
    const token = getCookie("chaty-token");

    if (!token) {
      throw new FetchError(403);
    }

    const response = await fetch(`${serverUrl}/user/current/read/group/${groupId}/${messageId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const data: SendReadMessageAckResponse = await response.json();

    if (!response.ok) {
      throw new FetchError(response.status);
    }

    return {
      data,
      hasFetchError: false,
    };
  } catch {
    return { data: undefined, hasFetchError: true };
  }
};

export default sendReadMessageAck;
