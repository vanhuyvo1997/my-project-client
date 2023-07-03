import { useEffect, useState } from "react";
import styles from "./Subtask.module.css";
import TaskProgressBar, { Status } from "../task-progress-bar/task-progress-bar";
import { convert } from "@my-project/util/datetime-formater";
import EdittableTitle from "@my-project/components/edittable-title/edittable-title";

export default function Subtask({
  title = "this is title, the title is too long",
  status = "NEW",
  createdAt,
  startedAt,
  stoppedAt,
  finishedAt,
  onDragStart,
  onDragEnd,
  onDelete,
  onClickEditTitle,
  lineThrough
}) {

  
  const handleOnDragStart = (e) => {
    setTimeout(() => {
      e.target.style.display = "none";
    }, 100);
    onDragStart();
  };

  const handleOnDragEnd = (e) => {
    setTimeout(() => {
      e.target.style.display = "flex";
    }, 100);
    onDragEnd && onDragEnd();
  };

  return (
    <div
      draggable={true}
      onDragStart={handleOnDragStart}
      onDragEnd={handleOnDragEnd}
      className={styles["subtask-container"]}
    >
      <div className={styles["subtask-content"]}>
        <EdittableTitle lineThrough={lineThrough} title={title} onClickEdit={onClickEditTitle}/>
        <div className={styles.details}>
          <div className={styles["status-bar"]}>
            <TaskProgressBar
              showStatusLabel={false}
              status={status}
              createdAt={convert(new Date(createdAt))}
              startedAt={convert(new Date(startedAt))}
              stoppedAt={convert(new Date(stoppedAt))}
              finishedAt={convert(new Date(finishedAt))}
            />
          </div>
        </div>
      </div>
      <div className={styles["subtask-status"]}>{status}</div>
      <input onClick={onDelete} title="delete" className={styles["delete-button"]} type="button"/>
    </div>
  );
}
