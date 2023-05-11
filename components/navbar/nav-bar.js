import Button, {ButtonType} from "../button/button";
import Image from "next/image";
import styles from "./NavBar.module.css";


export default function NavBar({
    buttonContent = 'button',
    onClickButton,
    showGreeting,
    avatarUrl = '/images/avatar.png',
    name = 'Vo Van Huy'}){
    return (
        <nav className={`${styles['nav-bar']} clearfix`}>
                <div className={styles.logo}>
                    <Image 
                    src="/images/logo.png"
                    width={150}
                    height={42}
                    alt="logo"
                    priority={false}
                    />
                </div>

                <div className={styles['nav-item']}>
                    <Button onClick={onClickButton} type={ButtonType.ORANGE} content={buttonContent}/>
                </div>

                {showGreeting
                &&<div className={styles['greeting'] + ' ' +  styles['nav-item']}>
                    <Image className={styles.avatar} src={avatarUrl} height={30} width={30} alt="avatar"
                    />
                    {`Hello, ${name}`}
                </div>}
        </nav>
    );
}