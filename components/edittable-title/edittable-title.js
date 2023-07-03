import styles from "./EdittableTitle.module.css";

export default function EdittableTitle({title, onClickEdit, lineThrough}) {
  return (
    <h6 style={lineThrough&&{textDecoration: "line-through"}} className={styles.title}>
      {title}&nbsp;&nbsp;
      <input
        onClick={onClickEdit}
        title="edit title"
        className={styles["edit-title-button"]}
        type="button"
      />
    </h6>
  );
}
