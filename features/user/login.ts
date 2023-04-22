import { serverUrl } from "@/config/server";
import { BaseResponse } from "@/utils/baseResponse";
import { setCookie } from "cookies-next";

export type LoginProps = {
  username: string;
  password: string;
  rememberMe: boolean;
};

export interface LoginResponse extends BaseResponse {
  token: string;
}

export type LoginReturns =
  | {
      data: LoginResponse;
      hasFetchError: false;
    }
  | {
      data: undefined;
      hasFetchError: true;
    };

const login = async ({ password, rememberMe, username }: LoginProps): Promise<LoginReturns> => {
  try {
    const response = await fetch(`${serverUrl}/auth/login`, {
      method: "POST",
      body: JSON.stringify({
        username,
        password,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data: LoginResponse = await response.json();

    if (response.ok) {
      setCookie("chaty-token", data.token, rememberMe ? { maxAge: 60 * 60 * 24 * 31 /* 31 days */ } : {});
    }

    return {
      data,
      hasFetchError: false,
    };
  } catch {
    return { data: undefined, hasFetchError: true };
  }
};

export default login;
