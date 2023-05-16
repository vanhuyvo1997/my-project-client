import Layout from "@my-project/components/layout/layout";
import SignInAndUpFrom from "@my-project/components/sign-in-and-out/sign-in-up-form";
import TextInput, {
  TextInputType,
} from "@my-project/components/text-input/text-input";
import { useRouter } from "next/router";
import { useState } from "react";
import { isValidEmail } from "@my-project/util/validate-utils";
import { NotifyType } from "@my-project/components/notification/notification";
import { onDeleteNotifycation } from "@my-project/util/notification-utils";
import jwtDecode from "jwt-decode";
import { ContainerSize } from "@my-project/components/page-container/page-container";

export default function SignIn() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [invalidEmailError, setInvalidEmailError] = useState("");
  const [invalidPasswordError, setInvalidPasswordError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const router = useRouter();

  const deleteNotification = (e) =>
    onDeleteNotifycation(e, notifications, setNotifications);

  async function signIn(e) {
    e.preventDefault();
    setIsLoading(true);

    // clear err
    setInvalidEmailError("");
    setInvalidPasswordError("");

    //validations
    if (!isValidEmail(username)) {
      setInvalidEmailError("Your email is invalid");
    }
    if (!password) {
      setInvalidPasswordError("Your password is invalid");
    }

    if (!invalidEmailError && !invalidPasswordError) {
      const url = "http://localhost:8080/api/auth";
      try {
        const respone = await fetch(url, {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({
            username: username,
            password: password,
          }),
        });
        if (respone.ok) {
          let data = await respone.json();
          localStorage.setItem("accessToken", data.accessToken);
          localStorage.setItem("refreshToken", data.refreshToken);
          jwtDecode(data.accessToken).role === "USER" &&
            router.push("my-projects");

            jwtDecode(data.accessToken).role === "ADMIN" &&
            router.push("my-admin");
        } else {
          throw new Error("Failed to login, user or password is invalid");
        }
      } catch (err) {
        notifications.push({
          type: NotifyType.FAIL,
          message: err.message,
          onDelete: deleteNotification,
        });
      }

      setIsLoading(false);
    }
  }

  return (
    <Layout
      navBarButtonContent="Sign up"
      onClickCornerButton={() => router.push("sign-up")}
      isLoading={isLoading}
      notifications={notifications}
      containerSize={ContainerSize.SMALL}
    >
      <SignInAndUpFrom
        title="Sign in with your account"
        onClickBack={() => router.push("sign-up")}
        backButtonContent="To sign up"
        nextButtonContent="Sign in"
        onSubmit={signIn}
      >
        <TextInput
          onChange={(e) => {
            setUsername(e.target.value);
          }}
          type={TextInputType.ORANGE}
          iconSrc="/images/username-icon.png"
          placeholder="Your eamil"
          error={invalidEmailError}
        />
        <TextInput
          onChange={(e) => {
            setPassword(e.target.value);
          }}
          password
          type={TextInputType.ORANGE}
          iconSrc="/images/password-icon.png"
          placeholder="Your password"
          error={invalidPasswordError}
        />
      </SignInAndUpFrom>
    </Layout>
  );
}
