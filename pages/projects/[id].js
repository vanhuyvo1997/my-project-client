import Layout from "@my-project/components/layout/layout";
import PageHeaderControls from "@my-project/components/project-controls/page-header-controls";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import Task from "@my-project/components/task/task";
import PopUp from "@my-project/components/pop-up/pop-up";
import TextInput from "@my-project/components/text-input/text-input";
import jwtDecode from "jwt-decode";
import { fetchFromAuthenticatedUrl } from "@my-project/util/fetch-utils";
import { isValidName } from "@my-project/util/validate-utils";
import { onDeleteNotifycation } from "@my-project/util/notification-utils";
import {
  NotifyObject,
  NotifyType,
} from "@my-project/components/notification/notification";
export default function Page({}) {

  // load task
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [tasks, setTasks] = useState([]);
  const router = useRouter();
  const [projectId, setProjectId] = useState(router.query.id);

  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [taskTitleErr, setTaskTitleErr] = useState("");
  const [showAddNewTaskPopUp, setShowAddNewTaskPopUp] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const [isShowDeleteDialog, setIsShowDeleteDialog] = useState(false);
  const [deletingTaskTitle, setDeletingTaskTitle] = useState("");
  const [deletingTaskId, setDeletingTaskId] = useState(-1);

  const taskUrl =
    process.env.NEXT_PUBLIC_PROJECT_BASE_API + "/" + projectId + `/tasks`;

  useEffect(() => {
    setIsLoading(true);
    const accessToken = localStorage.getItem("accessToken");
    (!accessToken || jwtDecode(accessToken).role != "USER") &&
      router.push("/sign-in");
    setUsername(jwtDecode(accessToken).sub);
    loadPageFirstTime();
    setIsLoading(false);
  }, []);


  

  const loadPageFirstTime = async () => {
    const url =
      taskUrl +
      `?pageNum=0&size=${process.env.NEXT_PUBLIC_LOAD_TASK_CHUNK_SIZE}&desc=true&sortBy=createdAt,title&term=`;
    try {
      const response = await fetchFromAuthenticatedUrl(url, "GET");
      if (response.status === 403) {
        router.push("/sign-in");
        return;
      }
      if (response.ok) {
        const data = await response.json();
        setTasks(data.currentPageContent);
      }
    } catch (error) {
      console.error(error);
    }
  };

  
  const deleteNotification = (notification) =>
    onDeleteNotifycation(notification, notifications, setNotifications);

  const createNewTask = async () => {
    setTaskTitleErr("");
    setIsLoading(true);
    if (!isValidName(newTaskTitle)) {
      setTaskTitleErr("This field must be not null");
      setIsLoading(false);
      return;
    }
    try {
      const body = JSON.stringify({
        title: newTaskTitle,
        description: newTaskDescription,
      });
      const response = await fetchFromAuthenticatedUrl(taskUrl, "POST", body);
      if (response.status === 409) {
        setTaskTitleErr("The title was in use");
        setIsLoading(false);
        return;
      }

      if (response.status === 403) {
        console.log(403);
        setIsLoading(false);
        return;
      }

      if (response.ok) {
        notifications.push(
          NotifyObject(
            NotifyType.SUCCESS,
            `Create successfully task entitled "${newTaskTitle}"`,
            deleteNotification
          )
        );
        setNewTaskTitle("");
        setNewTaskDescription("");
        loadPageFirstTime();
      }
    } catch (err) {
      console.error(err);
    }

    setIsLoading(false);
  };

  

  const hideDeleteDialog = () => {
    setIsShowDeleteDialog(false);
  };

  const handleDeleteTask = (id, title) => {
    setDeletingTaskId(id);
    setDeletingTaskTitle(title);
    setIsShowDeleteDialog(true);
  };

  const deleteSelectedTask = async () => {
    setIsLoading(true);
    try {
      const url = taskUrl + "/" + deletingTaskId
      const response = await fetchFromAuthenticatedUrl(url , "DELETE");
      if(response.ok){
        notifications.push(NotifyObject(NotifyType.SUCCESS, `Deleted task named "${deletingTaskTitle}" successfully`, deleteNotification));
        setIsShowDeleteDialog(false);
        loadPageFirstTime();
      } else {
        notifications.push(NotifyObject(NotifyType.FAIL, `Deleted task named "${deletingTaskTitle}" failed`, deleteNotification));
      }
    } catch (err) {
      console.error(err);
    }
    setIsLoading(false);
  };

  return (
    <Layout
      navBarButtonContent="Sign out"
      showGreeting
      greetingName={username}
      isLoading={isLoading}
      notifications={notifications}
    >
      <PageHeaderControls
        onClickAddNew={() => {
          setShowAddNewTaskPopUp(true);
          setTaskTitleErr("");
        }}
        addNewButtonLabel="Add new task"
        searchBarPlaceHoder="Search for tasks..."
      />

      <InfiniteScroll dataLength={tasks.length}>
        {tasks.map((e, index) => (
          <Task
            key={e.id}
            id = {e.id}
            belongProjectId = {projectId}
            title={e.title}
            desciptions={e.description}
            status={e.status}
            createdAt={e.createdAt}
            subtasksNum={e.subtasksNum}
            onDelete={() => handleDeleteTask(e.id, e.title)}
            notifications={notifications}
            deleteNotification={deleteNotification}S
          />
        ))}
      </InfiniteScroll>
      <PopUp
        isShow={showAddNewTaskPopUp}
        onClose={() => setShowAddNewTaskPopUp(false)}
        onDecline={() => setShowAddNewTaskPopUp(false)}
        onConfirm={createNewTask}
        popUpIcon="/images/icon-add-new.png"
        title="Create new task"
        description="Type task name and description to create new task"
      >
        <TextInput
          value={newTaskTitle}
          label="Task title"
          placeholder="Type task title..."
          error={taskTitleErr}
          onChange={(e) => {
            setNewTaskTitle(e.target.value);
            setTaskTitleErr("");
          }}
        />
        <br />
        <TextInput
          value={newTaskDescription}
          label="Task description"
          placeholder="Type Task description..."
          onChange={(e) => setNewTaskDescription(e.target.value)}
        />
        <br />
      </PopUp>

      <PopUp
        confirmPopup
        title="Delete task"
        description={
          <>
            Project named "<b>{deletingTaskTitle}</b>" will be deleted
            permanantly.
            <br />
            <br />
            <b>Are you sure?</b>
          </>
        }
        declineButtonContent="No"
        confirmButtonContent="Yes"
        popUpIcon="/images/delete-icon.png"
        isShow={isShowDeleteDialog}
        onClose={hideDeleteDialog}
        onDecline={hideDeleteDialog}
        onConfirm={deleteSelectedTask}
      />
    </Layout>
  );
}
