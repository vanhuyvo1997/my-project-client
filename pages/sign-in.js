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

export default function SignIn() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [invalidEmailError, setInvalidEmailError] = useState("");
  const [invalidPasswordError, setInvalidPasswordError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const router = useRouter();

  const navigateToRegister = () => router.push("/sign-up");

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
          notifications.push({
            type: NotifyType.SUCCESS,
            message: "Ok",
            onDelete: deleteNotification,
          });
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
      cornerButtonContent="Register"
      onClickCornerButton={navigateToRegister}
      isLoading={isLoading}
      notifications={notifications}
    >
      <div className="sign-in-and-up-container">
        <SignInAndUpFrom
          title="Sign in with your account"
          onClickBack={navigateToRegister}
          backButtonContent="To resgister"
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
      </div>
    </Layout>
  );
}
