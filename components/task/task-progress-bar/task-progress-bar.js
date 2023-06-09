import styles from "./TaskProgressBar.module.css";

export const Status = {
  NEW: "NEW",
  IN_PROGRESS: "IN_PROGRESS",
  DONE: "FINISHED",
  PENDING: "PENDING",
};
export default function TaskProgressBar({
  createdAt = "19:30 19/06/1997",
  startedAt = "24:30 20/06/1997",
  finishedAt = "11:00 21/06/1997",
  stoppedAt = "22:00 30/04/1997",
  status = Status.NEW,
  showStatusLabel = true,
}) {
  if (status === Status.NEW) {
    startedAt = "";
    finishedAt = "";
    stoppedAt = "";
  } else if (status === Status.IN_PROGRESS){
    stoppedAt = "";
    finishedAt = "";
  } else if (status === Status.PENDING) {
    finishedAt = "";
  } else {
    stoppedAt = "";
  }

  return (
    <div className={styles["progress-bar"]}>
      <div className={styles["progress-chart"]}>
        {/* progress point */}
        <div className={`${styles["progress-point"]} ${status === Status.PENDING ? (styles["active-progress-point"] + " " + styles.black) : ""} ${
            status == Status.NEW || status == Status.IN_PROGRESS || status == Status.DONE ? styles["active-progress-point"] + " " + styles["violet"] : ""}`}>
          {/* tooltip */}
          {createdAt && (
            <span className={styles["progress-point-tooltip"]}>
              Created at:
              <br />
              {createdAt}
            </span>)
          }
          {/* end tooltip */}
        </div>
          {/* end progress point */}

        
        {/* progress connect bar */}
        <div className={
            styles["progress-point-connector"] + " " +
            `${status === Status.PENDING ? styles.black : ""}` +
            `${status == Status.IN_PROGRESS || status == Status.DONE ? styles["violet-to-orange-gradients"] : ""}`
          }
        />

        {/* progress point */}
        <div className={ styles["progress-point"] + " " +
            `${status === Status.PENDING ? (styles["active-progress-point"] + " " + styles.black) : ""}` +
            `${ status == Status.IN_PROGRESS || status == Status.DONE ? styles["active-progress-point"] + " " + styles["orange"] : ""}`
          }>

          {/* tooltip */}
          {startedAt && (status === Status.IN_PROGRESS || status === Status.DONE) && (
            <span className={styles["progress-point-tooltip"]}>
              Started at:
              <br />
              {startedAt}
            </span>
          )}

          {stoppedAt && status === Status.PENDING && (
            <span className={styles["progress-point-tooltip"]}>
              Stopped at:
              <br />
              {stoppedAt}
            </span>
          )}
          {/* end tooltip */}
        </div>

        {/* progress connect bar */}
        <div
          className={styles["progress-point-connector"] + " " +
            `${status == Status.DONE ? styles["orange-to-green-gradients"] : ""}`
          }
        />

        <div
          className={
            styles["progress-point"] +" " +`${
              status == Status.DONE
                ? styles["active-progress-point"] + " " + styles["green"]
                : ""}`
        }>
          {/* tooltip         */}
          {finishedAt && (
            <span className={styles["progress-point-tooltip"]}>
              Done at:
              <br /> {finishedAt}
            </span>
          )}
        </div>
      </div>
      {showStatusLabel && (
        <div className={styles["status-label"]}>
          <span className={status === Status.NEW ? styles["active-label"] : ""}>
            {Status.NEW}
          </span>
          <span
            className={
              status === Status.IN_PROGRESS || status === Status.PENDING
                ? styles["active-label"]
                : ""
            }
          >
            {status == Status.IN_PROGRESS ? Status.IN_PROGRESS : Status.PENDING}
          </span>
          <span
            className={status === Status.DONE ? styles["active-label"] : ""}
          >
            {Status.DONE}
          </span>
        </div>
      )}
    </div>
  );
}
