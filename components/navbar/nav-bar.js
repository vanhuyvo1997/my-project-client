import Button, { ButtonType } from "../button/button";
import Image from "next/image";
import styles from "./NavBar.module.css";
import Link from "next/link";
import NavbarContent from "./navbar-content/navbar-content";

export default function NavBar({
  stage = "home", // sign-up, sign-in, home, signed-in-user
}) {
  return (
    <nav className={`${styles["nav-bar"]} clearfix`}>
      <Link href="/" className={styles.logo}>
        <Image
          src="/images/logo.png"
          width={150}
          height={42}
          alt="logo"
          priority={false}
        />
      </Link>
      <NavbarContent stage={stage} />
    </nav>
  );
}
