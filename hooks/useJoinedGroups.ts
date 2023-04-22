import useSWR, { KeyedMutator } from "swr";

import { serverUrl } from "@/config/server";
import { GroupToUser } from "@/types/user";
import { FetchError } from "@/utils/fetchError";
import { getCookie } from "cookies-next";

export type useJoinedGroupsReturns = {
  isLoading: boolean;
  isError: boolean;
  joinedGroups: GroupToUser[];
  mutate: KeyedMutator<any>;
};

const useJoinedGroups = (): useJoinedGroupsReturns => {
  const { data, isValidating, mutate, error } = useSWR(
    `${serverUrl}/user/current/joinedGroups`,
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
    { revalidateOnFocus: false, refreshInterval: 60 * 1000 /* 1 minute */ }
  );

  const isError = !!error;
  const isLoading = (!isError && !data) || isValidating;

  return {
    isLoading,
    isError,
    joinedGroups: data?.joinedGroups,
    mutate,
  };
};

export default useJoinedGroups;
