import { serverUrl } from "@/config/server";
import { GroupToUser } from "@/types/user";
import { BaseResponse } from "@/utils/baseResponse";
import { FetchError } from "@/utils/fetchError";
import { getCookie } from "cookies-next";

export interface GetGroupResponse extends BaseResponse {
  group: GroupToUser;
}

export type GetGroupReturns =
  | {
      data: GetGroupResponse;
      hasFetchError: false;
    }
  | {
      data: undefined;
      hasFetchError: true;
    };

const getGroup = async (groupId: number): Promise<GetGroupReturns> => {
  try {
    const token = getCookie("chaty-token");

    if (!token) {
      throw new FetchError(403);
    }

    const response = await fetch(`${serverUrl}/user/current/joinedGroups/${groupId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const data: GetGroupResponse = await response.json();

    return {
      data,
      hasFetchError: false,
    };
  } catch {
    return { data: undefined, hasFetchError: true };
  }
};

export default getGroup;
