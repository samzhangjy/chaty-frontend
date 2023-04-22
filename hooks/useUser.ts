import useSWR, { KeyedMutator } from "swr";

import { serverUrl } from "@/config/server";
import { getCookie } from "cookies-next";
import User from "@/types/user";
import { useAppDispatch, useAppSelector } from "./store";
import { selectUser, setUser } from "@/features/user/userSlice";
import { FetchError } from "@/utils/fetchError";
import { useEffect } from "react";

export type useUserReturns =
  | {
      isLoading: boolean;
      isLoggedOut: true;
      isLoggedIn: false;
      isError: boolean;
      user: undefined;
      mutate: KeyedMutator<any>;
    }
  | {
      isLoading: boolean;
      isLoggedOut: false;
      isLoggedIn: true;
      isError: boolean;
      user: User;
      mutate: KeyedMutator<any>;
    };

const useUser = (): useUserReturns => {
  const { data, isValidating, mutate, error } = useSWR(
    `${serverUrl}/user/current`,
    async (path) => {
      const token = getCookie("chaty-token");

      if (!token) {
        throw new FetchError(403);
      }

      const response = await fetch(path, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new FetchError(response.status);
      }

      return await response.json();
    },
    { revalidateOnFocus: false }
  );

  const isLoggedOut = error && error.status === 403;
  const isError = !!error;
  const isLoading = (!isError && !data) || isValidating;
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);

  useEffect(() => {
    if (!isLoggedOut && !isLoading && !isError && user !== data.user) dispatch(setUser(data.user as User));
  });
  if (!isLoggedOut && !isLoading && !isError) {
    return {
      isLoading,
      isLoggedOut: false,
      isLoggedIn: true,
      isError,
      user: data.user,
      mutate,
    };
  }

  dispatch(setUser(null));

  return {
    isLoading,
    isLoggedOut: true,
    isLoggedIn: false,
    isError,
    user: undefined,
    mutate,
  };
};

export default useUser;
