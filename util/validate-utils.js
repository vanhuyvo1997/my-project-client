import { refreshAccessToken } from "./fetch-utils";
import jwtDecode from "jwt-decode";

const emailRegex =
  /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/;
const passwordRegex =
  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

export function isValidName(name) {
  return name && name.trim() != "";
}

export function isValidEmail(email) {
  return String(email).toLocaleLowerCase().match(emailRegex);
}

export function isValidPassword(password) {
  return String(password).match(passwordRegex);
}

export function isValidTitle(title){
  return title&&title.trim() != "";
}

function checkValidAccessToken() {
  const accessToken = localStorage.getItem("accessToken");
  return accessToken && !isTokenExpired(jwtDecode(accessToken).exp);
}

function checkValidRefreshToken() {
  const refreshToken = localStorage.getItem("refreshToken");
  return refreshToken && !isTokenExpired(jwtDecode(refreshToken).exp);
}
export function checkValidToken() {
  if (checkValidAccessToken()) {
    return true;
  }
  if (checkValidRefreshToken() && refreshAccessToken()) {
    return checkValidAccessToken();
  }
  return false;
}

function isTokenExpired(tokenExp) {
  const now = Date.now();
  return now > tokenExp * 1000;
}
