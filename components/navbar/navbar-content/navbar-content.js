import Button, { ButtonType } from "@my-project/components/button/button";
import styles from "./NavbarContent.module.css";
import Image from "next/image";
import { useRouter } from "next/router";
import { useContext } from "react";
import { AuthenticationContext } from "@my-project/contexts/application-context";

export default function NavbarContent({
  stage,
  avatarUrl = "/images/avatar.png",
}) {
  const authentication = useContext(AuthenticationContext);
  let name = 'Guest';
  if(authentication && authentication.isAuthenticated){
    console.log(authentication);
    name = authentication.principal.name;
  }
  const router = useRouter();

  const handleSignIn = () => {
    router.push("/sign-in");
  };

  const handleSignUp = () => {
    router.push("sign-up");
  };

  const handleSignOut = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    router.push("/sign-in");
  };

  let showSignInButton, showSignUpButton, showSignOutButton, showGreeting;
  switch (stage) {
    case "home": {
      showSignInButton = true;
      showSignUpButton = true;
      showSignOutButton = false;
      showGreeting = false;
      break;
    }
    case "sign-up": {
      showSignInButton = true;
      showSignUpButton = false;
      showSignOutButton = false;
      showGreeting = false;
      break;
    }
    case "sign-in": {
      showSignInButton = false;
      showSignUpButton = true;
      showSignOutButton = false;
      showGreeting = false;
      break;
    }
    case "authenticated": {
      showSignInButton = false;
      showSignUpButton = false;
      showSignOutButton = true;
      showGreeting = true;
      break;
    }
    default:
      throw new Error("Invalid stage");
  }
  return (
    <div className={styles["container"]}>
      {showGreeting && (
        <div className={styles.greeting}>
          <Image
            className={styles.avatar}
            src={avatarUrl}
            height={30}
            width={30}
            alt="avatar"
          />
          {`Hello, ${name}`}
        </div>
      )}
      {showSignUpButton && (
        <Button
          onClick={handleSignUp}
          type={ButtonType.PRIMARY}
          content="Sign up"
        />
      )}
      {showSignInButton && (
        <Button
          onClick={handleSignIn}
          type={ButtonType.ORANGE}
          content="Sign in"
        />
      )}
      {showSignOutButton && (
        <Button
          onClick={handleSignOut}
          type={ButtonType.ORANGE}
          content="Sign out"
        />
      )}
    </div>
  );
}
