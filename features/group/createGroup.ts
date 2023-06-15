import { serverUrl } from "@/config/server";
import Group from "@/types/group";
import { BaseResponse } from "@/utils/baseResponse";
import { FetchError } from "@/utils/fetchError";
import { getCookie } from "cookies-next";

export type CreateGroupProps = {
  name: string;
  members?: number[];
};

export interface CreateGroupResponse extends BaseResponse {
  group: Group;
}

export type CreateGroupReturns =
  | {
      data: CreateGroupResponse;
      hasFetchError: false;
    }
  | {
      data: undefined;
      hasFetchError: true;
    };

const createGroup = async ({ name, members = [] }: CreateGroupProps): Promise<CreateGroupReturns> => {
  try {
    const token = getCookie("chaty-token");

    if (!token) {
      throw new FetchError(403);
    }

    const response = await fetch(`${serverUrl}/chat/group/create`, {
      method: "POST",
      body: JSON.stringify({
        name,
        members,
      }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const data: CreateGroupResponse = await response.json();

    return {
      data,
      hasFetchError: false,
    };
  } catch {
    return { data: undefined, hasFetchError: true };
  }
};

export default createGroup;
