import Button, { ButtonType } from '../button/button';
import styles from './Project.module.css';
import Link from 'next/link';
export default function Project({
    name,
    startedAt,
    status,
    link = '#',
    onClickEdit,
    onClickDelete,
}){
    return <div className={styles.container}>
        <div className={styles.content}>
            <Link href={link} className={styles.name}>{name}</Link>
            <div className={styles.details}>
                <span>started at: <i>{startedAt}</i></span>
                <span>status: <i>{status}</i></span>
            </div>
        </div>
        <div className={styles.actions}>
            <Button onClick={onClickEdit} content='Edit' type={ButtonType.ICON_EDIT}/>
            <Button onClick={onClickDelete} content='Delete' type={ButtonType.ICON_DLETE}/>
        </div>
    </div>
}