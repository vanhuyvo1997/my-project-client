import Image from "next/image";
import styles from "./AddNewButton.module.css";

export default function AddNewButton({ label = 'Add your label', onClick }) {
  return (
    <button className={styles["add-new-button"]} onClick={onClick}>
      <Image src="/images/icon-add-new.png" width={30} height={30} alt="add_icon"/>
      <span>{label}</span>
    </button>
  );
}
