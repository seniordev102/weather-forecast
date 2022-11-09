import Cookie from "js-cookie";
import { Storage } from "./types";

const storage: Partial<Storage> = {};

try {
  if (!window.localStorage) {
    throw Error("No local storage");
  }

  storage.set = (key: any, value: any) =>
    localStorage.setItem(key, JSON.stringify(value));
  storage.get = (key: any) => {
    const item = localStorage.getItem(key);
    if (item) {
      return JSON.parse(item);
    }
    return null;
  };
  storage.remove = (key: any) => localStorage.removeItem(key);
} catch (e) {
  storage.set = Cookie.set;
  storage.get = Cookie.get("json");
  storage.remove = Cookie.remove;
}

export default storage;
