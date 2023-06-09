import { Children, useState } from "react";
import styles from "./SubtaskColumn.module.css";

export default function SubtaskColumn ({
    children,
    onDrop,
}) {


    const  handleDragEnter = event =>{
        event.target.classList.add(styles['drag-over']);
    }
    const  handleDragOver = event =>{
        event.preventDefault();
    }

    const handleDragLeave = event => {
        event.target.classList.remove(styles['drag-over']);
    }
    

    const handleDrop = event =>{
        event.target.classList.remove(styles['drag-over']);
        onDrop();
    }

    return <div onDrop={handleDrop} onDragEnter={handleDragEnter} onDragOver={handleDragOver} onDragLeave={handleDragLeave} className={styles["subtask-column"]}>{children}</div>
};
