/**
 * Auth
 * 
 * Handles all the logic related to the .nereorc file, i.e. authentication
 */

import { readFileSync, writeFileSync } from "jsonfile";

import { getCurrentUser } from "./nereo-api.js";

import { NEREO_RC_PATH } from "./constants";

export const getToken = () => {
  const rcFileObject = readFileSync(NEREO_RC_PATH);
  return rcFileObject.token;
};

export const getUserId = () => {
  const rcFileObject = readFileSync(NEREO_RC_PATH);
  return rcFileObject.userId;
};

export const setToken = token => {
  let rcFileObject = readFileSync(NEREO_RC_PATH, { throws: false });
  rcFileObject ? (rcFileObject.token = token) : (rcFileObject = { token });
  return writeFileSync(NEREO_RC_PATH, rcFileObject);
};

export const setUserId = () =>
  getCurrentUser().then(({ data: { id } }) => {
    let rcFileObject = readFileSync(NEREO_RC_PATH, { throws: false });
    rcFileObject ? (rcFileObject.userId = id) : (rcFileObject = { userId: id });
    return writeFileSync(NEREO_RC_PATH, rcFileObject);
  });
