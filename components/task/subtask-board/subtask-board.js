import { useEffect, useState } from "react";
import SubtaskColumn from "../subtask-column/subtask-column";
import Subtask from "../subtask/subtask";
import styles from "./SubtaskBoard.module.css";
import AddNewButton from "@my-project/components/add-new-button/add-new-button";

export default function SubtaskBoard({
  column1Data = [],
  column2Data = [],
  column3Data = [],
  onDropToColumn1,
  onDropToColumn2,
  onDropToColumn3,
  onClickAddNewButton,
}) {
  const [draggingId, setDraggingId] = useState(-1);
  const [draggingStatus, setDraggingStatus] = useState("");
  const updateDraggingId = (id, status) => {setDraggingId(id); setDraggingStatus(status);}
  
  return (
    <div className={styles["subtask-board"]}>
      <SubtaskColumn onDrop={() => onDropToColumn1(draggingId, draggingStatus)}>
        <div className={styles["add-new-button-container"]}>
         <AddNewButton onClick={onClickAddNewButton} label="Add new subtask"/>
        </div>  
        {column1Data.map((e, index) => (
          <Subtask
            onDragStart={()=>updateDraggingId(e.id, e.status)}
            key={e.id}
            title={e.title}
            status={e.status}
            createdAt={e.createdAt}
            startedAt={e.startedAt}
            stoppedAt={e.stoppedAt}
            finishedAt={e.finishedAt}
          />
        ))}
      </SubtaskColumn>
      <SubtaskColumn onDrop={() => onDropToColumn2(draggingId, draggingStatus)}>
        {column2Data.map((e, index) => (
          <Subtask
            onDragStart={()=>updateDraggingId(e.id, e.status)}
            key={e.id}
            title={e.title}
            status={e.status}
            createdAt={e.createdAt}
            startedAt={e.startedAt}
            stoppedAt={e.stoppedAt}
            finishedAt={e.finishedAt}
          />
        ))}
      </SubtaskColumn>
      <SubtaskColumn onDrop={() => onDropToColumn3(draggingId, draggingStatus)}>
        {column3Data.map((e, index) => (
          <Subtask
            onDragStart={()=>updateDraggingId(e.id, e.status)}
            key={e.id}
            title={e.title}
            status={e.status}
            createdAt={e.createdAt}
            startedAt={e.startedAt}
            stoppedAt={e.stoppedAt}
            finishedAt={e.finishedAt}
          />
        ))}
      </SubtaskColumn>
    </div>
  );
}
