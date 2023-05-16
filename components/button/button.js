import styles from "./Button.module.css";
import Image from "next/image";
/* 



*/
export const ButtonType = {
    PRIMARY: 'primary-button',
    ORANGE: 'orange-button',
    ICON_DLETE: 'delete-button',
    ICON_EDIT: 'edit-button',
}

export default function Button({
    content,
    onClick,
    type,
    submit,
}){


    return (
            <button className={styles[type]}  onClick={onClick} type={submit?'submit':'button'}>
                {paseIconFromType(type)}
                {content}
            </button>
    );
}

function paseIconFromType(type){
    switch(type){
        case ButtonType.ICON_DLETE: return <>
            <Image className={styles['icon']} src="/images/delete-icon.png" height={24} width={24} alt="delete-icon"/>&nbsp;
        </> 
        case ButtonType.ICON_EDIT: return <>
            <Image className={styles['icon']} src="/images/edit-icon.png" height={24} width={24} alt="edit-icon"/>&nbsp;
        </>
        default: return null;
    }
}
