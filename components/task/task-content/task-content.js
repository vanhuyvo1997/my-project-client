import Button, { ButtonType } from "@my-project/components/button/button";
import TaskProgressBar, { Status } from "../task-progress-bar/task-progress-bar";
import styles from "./TaskContent.module.css";
import DropdownMenu from "../dropdown-menu/dropdown-menu";
import EdittableTitle from "@my-project/components/edittable-title/edittable-title";

export default function TaskContent({
  title = "This is title",
  desciptions = "This is descriptions",
  status,
  createdAt,
  startedAt,
  finishedAt,
  subtasksNum,
  onClickExpand,
  onDelete,
  onEdit,
}) {
  const handleExpand = (event) => {
    onClickExpand();
    if (event.target.classList.contains(styles["expanded"])) {
      event.target.classList.remove(styles["expanded"]);
    } else {
      event.target.classList.add(styles["expanded"]);
    }
  };

  return (
    <div className={styles["task"]}>
      <div className={styles["task-content"]}>
        <div className={styles.details}>
          <EdittableTitle title={title} onClickEdit={onEdit}/>
          <pre className={styles.desciptions}>{desciptions}</pre>
          <div className={styles["other-info"]}>
            <span className={styles["progress-bar"]} ><span className={styles["samll-text"]}>Status:</span> <TaskProgressBar status={status} createdAt={createdAt} startedAt={startedAt} finishedAt={finishedAt}/></span>
            <span className={styles["samll-text"]}>
              Subtasks: <i>{subtasksNum}</i>
            </span>
          </div>
        </div>
      </div>
      <div className={styles["task-action"]}>

        <DropdownMenu>
          <Button onClick={onDelete} type={ButtonType.ICON_DLETE} content={"Delete"}/>
          <Button onClick={onEdit} type={ButtonType.ICON_EDIT} content={"Edit"}/>
        </DropdownMenu>
        <input
          type="button"
          className={styles["expand-button"]}
          onClick={handleExpand}
        />
      </div>
    </div>
  );
}
