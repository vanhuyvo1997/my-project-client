import styles from "./DropdownMenu.module.css";

export default function DropdownMenu({ children }) {
  return (
    <div className={styles["dropdown-container"]}>
      <div className={styles["dropdown-button"]}></div>
      <div className={styles["dropdown-menu-container"]}>
        <div className={styles["dropdown-menu-content"]}>{children}</div>
      </div>
    </div>
  );
}
