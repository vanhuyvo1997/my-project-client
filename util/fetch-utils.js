import { checkValidToken } from "./validate-utils";

export async function fetchUserDetail(id) {
  try {
    const userUrl = process.env.NEXT_PUBLIC_USER_BASE_API + "/" + id;
    console.log("fetch from url: " + userUrl);
    const response = await fetchFromAuthenticatedUrl(userUrl, "GET");
    if (response.ok) {
      const data = await response.json();
      return data;
    }
    return null;
  } catch (err) {
    console.error(err);
    return null;
  } 
}

export function fetchFromUnauthenticatedUrl(url, method, body) {
  console.log("fetch from url: " + url);
  return fetch(url, {
    method: method,
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(body),
  });
}

export const fetchFromAuthenticatedUrl = (url, method, body) => {
  if (!checkValidToken()) {
    throw new Error("Tokens is invalid or expired.");
  }
  console.log("fetch from url: " + url);
  return fetch(url, {
    method: method,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      "Content-Type": "application/json",
    },
    body: body,
  });
};

export async function refreshAccessToken() {
  const url = process.env.NEXT_PUBLIC_REFRESH_TOKEN_API;
  console.log("fetch from url: " + url);
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("refreshToken")}`,
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      return true;
    }
    return false;
  } catch (err) {
    console.error(err);
    return false;
  }
}
