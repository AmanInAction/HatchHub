import axios from "axios";

export const clientServer = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SERVER_URL,
});
