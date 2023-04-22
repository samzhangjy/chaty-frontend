import { serverUrl } from "@/config/server";
import Message from "@/types/message";
import { FetchError } from "@/utils/fetchError";
import { getCookie } from "cookies-next";

export interface GetGroupMessagesResponse {
  data: Message[];
  total: number;
  currentPage: number;
  nextPage: number | null;
  prevPage: number | null;
  lastPage: number;
}

export type GetGroupMessagesReturns =
  | {
      hasFetchError: true;
      data: undefined;
    }
  | { hasFetchError: false; data: GetGroupMessagesResponse };

const getGroupMessages = async (groupId: number, page: number, skip = 0): Promise<GetGroupMessagesReturns> => {
  try {
    const token = getCookie("chaty-token");

    if (!token) {
      throw new FetchError(403);
    }

    const response = await fetch(`${serverUrl}/chat/messages?groupId=${groupId}&page=${page}&skip=${skip}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const data: GetGroupMessagesResponse = await response.json();

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

export default getGroupMessages;
