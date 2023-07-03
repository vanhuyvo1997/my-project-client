import Image from "next/image";
import styles from "./PopUp.module.css";
import Button, { ButtonType } from "../button/button";
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
}) {

  document.removeEventListener("keydown", null);
  document.addEventListener("keydown", (event) => {
    if(event.keyCode == 27){
      onClose();
    }
  
  })


  return (
    <div className={styles["pop-up"]}>
        <form onSubmit={(e)=>{e.preventDefault(); onConfirm(e)}}>
        <div className={styles["pop-up-container"]}>        
          <button className={styles["close-button"]} type="button" onClick={onClose}>
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
              submit
              type={ButtonType.ORANGE}
              content={confirmButtonContent}
            ></Button>
          </div>
        </div>
        </form>
    </div>
  );
}
