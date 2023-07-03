import Layout from "@my-project/components/layout/layout";
import SignInAndUpFrom from "@my-project/components/sign-in-and-out/sign-in-up-form";
import TextInput, {
  TextInputType,
} from "@my-project/components/text-input/text-input";
import { useRouter } from "next/router";
import { useState, useEffect, useContext } from "react";
import { isValidEmail } from "@my-project/util/validate-utils";
import {
  NotifyObject,
  NotifyType,
} from "@my-project/components/notification/notification";
import jwtDecode from "jwt-decode";
import { ContainerSize } from "@my-project/components/page-container/page-container";
import Loading from "@my-project/components/loading/loading";
import { checkValidToken } from "@my-project/util/validate-utils";
import { fetchFromUnauthenticatedUrl } from "@my-project/util/fetch-utils";
import ApplicationProvider from "@my-project/providers/application-provider";
import { NotifcationContext } from "@my-project/contexts/application-context";

export default function SignInPage() {
  return (
    <ApplicationProvider>
      <PageContent />
    </ApplicationProvider>
  );
}

function PageContent() {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [initalizeFinsied, setInitalizeFinished] = useState(false);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [invalidEmailError, setInvalidEmailError] = useState("");
  const [invalidPasswordError, setInvalidPasswordError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [notifications, pushNotification, deleteNotification] =
    useContext(NotifcationContext);

  const router = useRouter();
  useEffect(() => {
    setIsSignedIn(checkValidToken());
    setInitalizeFinished(true);
  }, []);
  if (!initalizeFinsied) {
    return <Loading />;
  }
  if (isSignedIn) {
    router.push("/projects");
    return <Loading />;
  }

  function clearErr() {
    setInvalidEmailError("");
    setInvalidPasswordError("");
  }

  async function signIn(e) {
    e.preventDefault();
    setIsLoading(true);
    clearErr();
    //validations
    if (!username && username.trim().length === 0 && !isValidEmail(username)) {
      setInvalidEmailError("Your email is invalid");
      setIsLoading(false);
      return;
    }
    if (!password && password.length === 0) {
      setInvalidPasswordError("Your password is invalid");
      setIsLoading(false);
      return;
    }

    try {
      const url = process.env.NEXT_PUBLIC_SIGN_IN_API;
      const body = {
        username: username,
        password: password,
      };
      const response = await fetchFromUnauthenticatedUrl(url, "POST", body);
      if (response.ok) {
        let data = await response.json();
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);
        jwtDecode(data.accessToken).role === "ADMIN"
          ? router.push("my-admin")
          : router.push("projects");
        return;
      }
      throw new Error("Failed to login, user or password is invalid");
    } catch (err) {
      console.log(err);
      pushNotification(NotifyType.FAIL, err.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Layout
      stage="sign-in"
      isLoading={isLoading}
      notifications={notifications}
      containerSize={ContainerSize.SMALL}
      onDeleteNotification={deleteNotification}
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
            setInvalidEmailError("");
            setUsername(e.target.value);
          }}
          type={TextInputType.ORANGE}
          iconSrc="/images/username-icon.png"
          placeholder="Your eamil"
          error={invalidEmailError}
        />
        <TextInput
          onChange={(e) => {
            setInvalidPasswordError("");
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
