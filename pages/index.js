import { Inter } from "next/font/google";
import styles from "@my-project/styles/Home.module.css";
import NavBar from "@my-project/components/navbar/nav-bar";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { checkValidToken } from "@my-project/util/validate-utils";
import Loading from "@my-project/components/loading/loading";
import Head, { defaultHead } from "next/head";
import ApplicationProvider from "@my-project/providers/application-provider";
import { AuthenticationContext } from "@my-project/contexts/application-context";

export default function Page() {
  return (
    <ApplicationProvider>
      <Head>
        <title>Home | My Projects</title>
      </Head>
      <PageContent />
    </ApplicationProvider>
  );
}

function PageContent() {
  const router = useRouter();
  const authenticaton = useContext(AuthenticationContext);

  if (authenticaton && authenticaton.isAuthenticated) {
    router.push("/projects");
    return <Loading />;
  }

  return (
    <>
      <NavBar showSignInButton={true} showSignUpButton={true} />
      <div className={styles["home-container"]}>
        <div className={styles["introduction"]}>
          <h1 className={styles["general-description"]}>
            Manage your tasks easily, visually, exactly, and professionally.
          </h1>
          <p className={styles["detail-description"]}>
            Where you can optimize your tasks in most visual, effective ways.
          </p>
          <div className={styles["buttons"]}>
            <Link className={styles["sign-up-button"]} href="/sign-up">
              Create free account
            </Link>
            <Link className={styles["sign-in-button"]} href="/sign-in">
              or Sign in now.
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
