import styles from "./SignInAndUpForm.module.css";
import Image from "next/image";
import Button, { ButtonType } from "../button/button";
export default function SignInAndUpFrom({
    title,
    children,
    backButtonContent ="Register",
    nextButtonContent = "Sign in",
    onClickNext,
    onClickBack,
    onSubmit
}){
    return (<>
        <div className={styles.container}>
            <form method="POST" onSubmit={onSubmit}>
                <div className={styles['form-header']} >
                    <Image className={styles.logo} src="/images/logo.png"
                        width={107}
                        height={32}
                        alt="logo"
                        priority={false}
                    />
                    <p>{title}</p>
                </div>
                <div className={styles['form-body']}>
                    {children}
                </div>
                <div className={styles['form-footer']}>
                    <Button onClick={onClickBack} type={ButtonType.PRIMARY} content={backButtonContent}/>
                    <Button submit onClick={onClickNext} type={ButtonType.ORANGE} content={nextButtonContent}/>
                </div>
            </form>
        </div>
    </>);
}