import { useState } from "react";
import styles from "./Task.module.css";
import SubtaskBoard from "./subtask-board/subtask-board";
import TaskContent from "./task-content/task-content";
import { fetchFromAuthenticatedUrl } from "@my-project/util/fetch-utils";
import { Status } from "./task-progress-bar/task-progress-bar";
import PopUp from "../pop-up/pop-up";
import TextInput from "../text-input/text-input";
import { isValidName } from "@my-project/util/validate-utils";
export default function Task({
  id,
  belongProjectId,
  title = "title",
  desciptions = "descriptions ",
  subtasksNum,
  status,
  createdAt,
  startedAt, 
  finishedAt,
  onDelete,
}) {

  const [numOfSubtask, setNumOfSubtask] = useState(subtasksNum);
  const [taskStatus, setTaskStatus] = useState(status);
  const [createdTime, setCreatedTime] = useState(createdAt);
  const [startedTime, setStartedTime] = useState(startedAt);
  const [finishedTime, setFinishedTime] = useState(finishedAt);


  const [showBoard, setShowBoard] = new useState(false);
  const [subtasks, setSubtasks] = useState([]);
  const [isShowAddSubtaskPopup, setIsShowAddSubtaskPopup] = useState(false);
  const [addingSubtaskName, setAddingSubtaskName] = useState("");
  const [subtaskNameError, setSubtaskNameError] = useState("");

  const taskApiUrl = process.env.NEXT_PUBLIC_PROJECT_BASE_API + "/" + belongProjectId + "/tasks/" + id;
  const subtaskApiUrl = taskApiUrl + "/subtasks";

  const updateTaskContent = async () =>{
    try{
      const respone = await fetchFromAuthenticatedUrl(taskApiUrl);
      if(respone.ok){
        const data = await respone.json();
        setNumOfSubtask(data.subtasksNum);
        setTaskStatus(data.status);
        setCreatedTime(data.createdAt);
        setStartedTime(data.startedAt);
        setFinishedTime(data.finishedAt);
      }

    } catch(err){console.error(err)}
  }
  

  const deleteSubtask = async (subtaskId) => {
    const deleteUrl = subtaskApiUrl + `/${subtaskId}`;
    try{
      const respone = await fetchFromAuthenticatedUrl(deleteUrl, "DELETE");
      if(respone.ok){
        loadSubtasks();
      } else console.error(respone.status);
    } catch(err){
      console.error(err);
    }
  }
  
  const handleDropOnColumn1 = (draggingId, draggingStatus)=>{
    if(draggingStatus === Status.NEW) return;
    changeStatus(draggingId, draggingStatus, Status.PENDING);
  }

  const handleDropOnColumn2 = (draggingId, draggingStatus)=>{
    changeStatus(draggingId, draggingStatus, Status.IN_PROGRESS);
  }

  const handleDropOnColumn3 = (draggingId, draggingStatus)=>{
    changeStatus(draggingId, draggingStatus, Status.DONE);
  }

  const changeStatus = async (id, currStatus, targetStatus) => {
    if(targetStatus === currStatus){
      return;
    }
    const changeStatusUrl = subtaskApiUrl + `/${id}/status`;
    try{
      const response = await fetchFromAuthenticatedUrl(changeStatusUrl, "PATCH", JSON.stringify({status: targetStatus}));
      if(response.ok){
        loadSubtasks();
      } else console.error(response.status);

    } catch(err){
      console.error(err);
    }
  }


  const loadSubtasks = async ()=>{
    updateTaskContent();
    try{
      const respone = await fetchFromAuthenticatedUrl(subtaskApiUrl, "GET");
      if(respone.ok){
        const data = await respone.json();
        setSubtasks(data);
      } else console.error(respone.status);
    } catch(err){
      console.error(err);
    }
  }

  const handleClickExpand = () => {
    !showBoard&&loadSubtasks();
    setShowBoard(!showBoard);
  };

  const handleCloseAddSubtaskPopup = ()=>{
    setIsShowAddSubtaskPopup(false);
    setSubtaskNameError("");
    setAddingSubtaskName("");
  }

  const showAddSubtaskPopup = ()=>{
    setIsShowAddSubtaskPopup(true);
  }
  const addSubtask = async () => {
    if(!isValidName(addingSubtaskName)){
      setSubtaskNameError("Ths field must not be empty");
      return;
    }
    try{
      const respone = await fetchFromAuthenticatedUrl(subtaskApiUrl,"POST", JSON.stringify({title: addingSubtaskName}));
      if(respone.status == 409){
        setSubtaskNameError("Subtask name already exists");
        return;
      } else if(respone.ok){
        loadSubtasks();
        setAddingSubtaskName("");
      }else {
        console.error(respone.status)
      }

    } catch(err){
      console.error(err);
    }
  }


  return (
    <>
    <PopUp
        title="Add new subtask"
        popUpIcon="/images/icon-add-new.png"
        description="type subtasks' name you would like to create"
        isShow={isShowAddSubtaskPopup}
        onClose={handleCloseAddSubtaskPopup}
        onDecline={handleCloseAddSubtaskPopup}
        onConfirm={addSubtask}
      >
        <TextInput value={addingSubtaskName} error={subtaskNameError} onChange={e=> {setAddingSubtaskName(e.target.value); setSubtaskNameError("")}} placeholder="Subtasks name..."/>
    </PopUp>
    <div className={styles["task-container"]}>
      <TaskContent
        title={title}
        desciptions={desciptions}
        status={taskStatus}
        createdAt={createdTime}
        startedAt={startedTime}
        finishedAt={finishedTime}
        subtasksNum={numOfSubtask}
        onClickExpand={handleClickExpand}
        onDelete={onDelete}
      />
      <div
        className={`${styles["subtask-board-container"]} 
        ${showBoard ? styles["show"] : styles["hide"]}`}
      >
        <SubtaskBoard onClickAddNewButton={showAddSubtaskPopup} column1Data={subtasks.filter(e=> e.status === Status.NEW || e.status == Status.PENDING)}
          column2Data={subtasks.filter(e=> e.status == Status.IN_PROGRESS)}
          column3Data={subtasks.filter(e=> e.status == Status.DONE)}
          onDropToColumn1={handleDropOnColumn1}
          onDropToColumn2={handleDropOnColumn2}
          onDropToColumn3={handleDropOnColumn3}
          onDeleteSubtask={deleteSubtask}
         />
      </div>
    </div>
    </>
  );
}
