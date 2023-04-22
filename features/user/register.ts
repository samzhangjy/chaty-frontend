import { serverUrl } from "@/config/server";
import User from "@/types/user";
import { BaseResponse } from "@/utils/baseResponse";

export type RegisterProps = {
  username: string;
  password: string;
  email: string;
};

export interface LoginResponse extends BaseResponse {
  user: User;
}

export type RegisterReturns =
  | {
      data: LoginResponse;
      hasFetchError: false;
    }
  | { data: undefined; hasFetchError: true };

const register = async ({ username, password, email }: RegisterProps): Promise<RegisterReturns> => {
  let response = null;
  try {
    response = await fetch(`${serverUrl}/auth/register`, {
      method: "POST",
      body: JSON.stringify({
        username,
        password,
        email,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (e) {
    return { data: undefined, hasFetchError: true };
  }
  const data = await response.json();

  return {
    data: data,
    hasFetchError: false,
  };
};

export default register;
