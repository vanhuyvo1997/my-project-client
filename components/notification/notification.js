import styles from "./Notification.module.css";
import Image from "next/image";

export const NotifyType = {
    SUCCESS: 'success',
    FAIL: 'fail',
} 

export default function Notification({
    type = NotifyType.SUCCESS,
    message = "abc",
    onDelete}){

    let iconUrl = type === NotifyType.SUCCESS ? "/images/success-icon.png" : "/images/failed-icon.png";

    return (
        <div className={styles.notification }>
            <Image className={styles.icon} src={iconUrl} width={30} height={30} alt="notify_icon"/>
            <div className={`${styles.message} ${styles[type]}`}>
                {message}
            </div>
            <button className={styles['delete-button']} onClick={onDelete}>
                <Image src="/images/delete-notify-icon.png" height={15} width={15} alt="delete_notify_icon"/>
            </button>
        </div>
    );
}