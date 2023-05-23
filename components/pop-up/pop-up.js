import Image from "next/image";
import styles from "./PopUp.module.css";
import Button, { ButtonType } from "../button/button";
import TextInput from "../text-input/text-input";
import { Children } from "react";
export default function PopUp({
  title = "Title",
  popUpIcon,
  description,
  declineButtonContent = "Cancel",
  confirmButtonContent = "Confirm",
  onConfirm,
  onDecline,
  confirmPopup,
  children = "stay your form controls here",
  onClose,
  isShow,
}) {
  return (
    <div className={styles["pop-up"]} style={{display: isShow? "flex" : "none"}}>
        <div className={styles["pop-up-container"]}>
          <button className={styles["close-button"]} onClick={onClose}>
            <Image
              title="close"
              src="/images/close-button-icon.png"
              height={15}
              width={15}
              alt="close"
            />
          </button>
          <div className={styles["pop-up-header"]}>
            <h4 className={styles.title}>
              <b>{title}</b>
            </h4>
            {popUpIcon && <Image src={popUpIcon} width={45} height={45} alt="pop-up-icon"/>}
            {description&& <p className={styles.description}>{description}</p>}
          </div>
          {!confirmPopup&&<div className={styles["pop-up-body"]}>
            {children}
          </div>}
          <div className={styles["pop-up-footer"]}>
            <Button
              type={ButtonType.PRIMARY}
              content={declineButtonContent}
              onClick={onDecline}
            ></Button>
            <Button
              type={ButtonType.ORANGE}
              content={confirmButtonContent}
              onClick={onConfirm}
            ></Button>
          </div>
        </div>
    </div>
  );
}
