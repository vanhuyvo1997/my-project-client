import styles from "./PageContainer.module.css"

export const ContainerSize = {
    SMALL : 'small', 
    LARGE : 'large',
    EXTRA_LARGE: 'extra-large',
}
export default function PageContainer({children, size = ContainerSize.LARGE}){
    return (<div className={`${size === ContainerSize.LARGE?  styles['page-container-large'] :  styles['page-container-small'] }`}>
        {children}
    </div>);
}