import axios from "axios";

import { getToken, getUserId } from "./auth";
import {
  NEREO_API_URL,
  NEREO_MIN_DATE,
  NEREO_MAX_DATE
} from "./constants";

const isAuthenticated = () => axios.defaults.headers.common['Authorization'] !== undefined

const setHeaders = () => {
  try {
    const token = getToken();
    axios.defaults.headers.common['Authorization'] = `Token ${getToken()}`;
  } catch (e) {
    throw new Error('Unauthenticated');
  }
}

export const getTimedAccounts = () => {
  if (!isAuthenticated()) { setHeaders() }
  return axios.get(`${NEREO_API_URL}/timed-accounts`, {
    params: {
      user: getUserId()
    }
  }) 
};

export const getLeaveRequests = () => {
  if (!isAuthenticated()) { setHeaders() }
  return axios.get(`${NEREO_API_URL}/leaverequests`, {
    params: {
      userId: getUserId(),
      min_date: NEREO_MIN_DATE,
      max_date: NEREO_MAX_DATE,
      state: ["RE", "V1", "VA"],
      is_cancellation_request: "false"
    }
  })
};

export const getBalances = () => {
  if (!isAuthenticated()) { setHeaders() }
  return axios.post(`${NEREO_API_URL}/users/${getUserId()}/balances/`, {
    start_date: NEREO_MIN_DATE,
    end_date: NEREO_MAX_DATE,
  })
};

export const getCurrentUser = () => {
  if (!isAuthenticated()) { setHeaders() }
  return axios.get(`${NEREO_API_URL}/users/current`)
};
