import Layout from "@my-project/components/layout/layout";
import SignInAndUpFrom from "@my-project/components/sign-in-and-out/sign-in-up-form";
import TextInput from "@my-project/components/text-input/text-input";
import { useRouter } from "next/router";
import { TextInputType } from "@my-project/components/text-input/text-input";
import { useContext, useState } from "react";
import { NotifyType } from "@my-project/components/notification/notification";

import {
  isValidName,
  isValidEmail,
  isValidPassword,
} from "@my-project/util/validate-utils";
import { ContainerSize } from "@my-project/components/page-container/page-container";
import { NotifyObject } from "@my-project/components/notification/notification";
import ApplicationProvider from "@my-project/providers/application-provider";
import { NotifcationContext } from "@my-project/contexts/application-context";

export default function SignUpPage() {
  return (
    <ApplicationProvider>
      <PageContent />
    </ApplicationProvider>
  );
}

function PageContent() {
  const [validationErrs, setValidationErrs] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmedPassword, setConfirmedPassword] = useState("");
  const router = useRouter();

  const [notifications, pushNotifcation, deleteNotification] =
    useContext(NotifcationContext);

  function navigateToRegister() {
    router.push("/sign-in");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    //  errors
    let validateErrsContainer = {};
    // validations
    if (!isValidName(name)) {
      validateErrsContainer = {
        ...validateErrsContainer,
        name: "Name is required",
      };
    }
    if (!isValidEmail(username)) {
      validateErrsContainer = {
        ...validateErrsContainer,
        username: "Email is invalid",
      };
    }
    if (!isValidPassword(password)) {
      validateErrsContainer = {
        ...validateErrsContainer,
        password: "Password is invalid",
      };
    }
    if (isValidPassword(password) && password !== confirmedPassword) {
      validateErrsContainer = {
        ...validateErrsContainer,
        confirmedPassword: "Confirmed password is not match",
      };
    }

    //update errors to show validation messages
    setValidationErrs(validateErrsContainer);
    if (Object.keys(validateErrsContainer).length !== 0) {
      setIsLoading(false);
      return;
    }
    // submit
    try {
      const url = process.env.NEXT_PUBLIC_REGISTER_API;
      const body = {
        name: name,
        username: username,
        password: password,
      };
      const response = await fetchFromUnauthenticatedUrl(url, "POST", body);
      if (response.ok) {
        pushNotifcation("Register successfully.", NotifyType.SUCCESS);
        resetData();
        return;
      }
      pushNotifcation("Email is already in use.", NotifyType.FAIL);
    } catch (err) {
      console.error(err);
      pushNotifcation("Failed to connect to server.", NotifyType.FAIL);
    } finally {
      setIsLoading(false);
    }
  }

  function resetData() {
    setName("");
    setPassword("");
    setConfirmedPassword("");
    setUsername("");
  }

  return (
    <Layout
      stage={'sign-up'}
      isLoading={isLoading}
      notifications={notifications}
      containerSize={ContainerSize.SMALL}
      onDeleteNotification={deleteNotification}
    >
      <div className="sign-in-and-up-container">
        <SignInAndUpFrom
          onSubmit={handleSubmit}
          title="Sign up your new account"
          nextButtonContent="Sign up"
          backButtonContent="To sign in"
          onClickBack={navigateToRegister}
        >
          <TextInput
            value={name}
            name="name"
            type={TextInputType.ORANGE}
            iconSrc="/images/name-icon.png"
            placeholder="Your name"
            error={validationErrs.name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextInput
            value={username}
            name="username"
            type={TextInputType.ORANGE}
            iconSrc="/images/username-icon.png"
            placeholder="Your email"
            error={validationErrs.username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextInput
            value={password}
            name="password"
            type={TextInputType.ORANGE}
            password
            iconSrc="/images/password-icon.png"
            placeholder="Your password"
            error={validationErrs.password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <TextInput
            value={confirmedPassword}
            name="confirmedPassword"
            type={TextInputType.ORANGE}
            password
            iconSrc="/images/password-icon.png"
            placeholder="Confirm your password"
            error={validationErrs.confirmedPassword}
            onChange={(e) => setConfirmedPassword(e.target.value)}
          />
          <div>
            <small>
              Password must contain:
              <ul>
                <li>at least 8 characters</li>
                <li>at least 1 number</li>
                <li>at least 1 special character (@$!%*#?&) </li>
              </ul>
            </small>
          </div>
        </SignInAndUpFrom>
      </div>
    </Layout>
  );
}
