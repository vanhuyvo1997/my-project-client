import {
  AuthenticationContext,
  NotifcationContext,
} from "@my-project/contexts/application-context";
import { checkValidToken } from "@my-project/util/validate-utils";
import Loading from "@my-project/components/loading/loading";
import { useState, useEffect } from "react";
import { NotifyObject } from "@my-project/components/notification/notification";
import { fetchUserDetail } from "@my-project/util/fetch-utils";
import jwtDecode from "jwt-decode";

export default function ApplicationProvider({ children }) {
  const [authentication, setAuthentication] = useState(null);
  const [initalizeFinsied, setInitalizeFinished] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    let ignore = false;
    let loadedAuthentication = loadAuthentication();
    if (!ignore) {
      setAuthentication(loadedAuthentication);
      setInitalizeFinished(true);
    }
    return () => (ignore = true);
  }, []);

  if (!initalizeFinsied) {
    return <Loading />;
  }

  function pushNotification(type, message) {
    const notification = NotifyObject(type, message);
    setNotifications([...notifications, notification]);
    setTimeout(
      () => setNotifications((n) => n.filter((e) => e.id !== notification.id)),
      6000
    );
  }

  function deleteNotification(notification) {
    setNotifications(notifications.filter((e) => e.id !== notification.id));
  }
  return (
    <AuthenticationContext.Provider value={authentication}>
      <NotifcationContext.Provider value={[notifications, pushNotification, deleteNotification]}>
        {children}
      </NotifcationContext.Provider>
    </AuthenticationContext.Provider>
  );
}

async function loadAuthentication() {
  const isValidToken = checkValidToken();
  if (isValidToken) {
    const id = jwtDecode(localStorage.getItem("accessToken")).id;
    let principal = await fetchUserDetail(id);
    return {
      principal: principal,
      isAuthenticated: principal !== null,
    };
  }
  return null;
}
