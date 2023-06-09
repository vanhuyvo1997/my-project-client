export const fetchFromAuthenticatedUrl = (url, method, body) => {
  return fetch(url, {
    method: method,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      "Content-Type": "application/json",
    },
    body: body,
  });
};
