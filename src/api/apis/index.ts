import user from "@/api/apis/user";
import client from "./client";
import service from "./service";
import authority from "./authority";

export default {
  ...user,
  ...client,
  ...service,
  ...authority
};
