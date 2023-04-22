import User from "@/types/user";

export const getUserAvatar = (user: User) => {
  if (!user) return "";
  return `https://api.dicebear.com/6.x/thumbs/svg?seed=${user.username}`;
};
