import { deleteCookie } from "cookies-next";

const logout = () => {
  deleteCookie("chaty-token");
};

export default logout;
