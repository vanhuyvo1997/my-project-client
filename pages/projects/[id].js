import Layout from "@my-project/components/layout/layout";
import PageHeaderControls from "@my-project/components/project-controls/page-header-controls";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import Task from "@my-project/components/task/task";
import PopUp from "@my-project/components/pop-up/pop-up";
import { fetchFromAuthenticatedUrl } from "@my-project/util/fetch-utils";
import { checkValidToken, isValidTitle } from "@my-project/util/validate-utils";
import {
  NotifyObject,
  NotifyType,
} from "@my-project/components/notification/notification";
import TaskDialog from "@my-project/components/dialogs/task-dialog";
import ApplicationProvider from "@my-project/providers/application-provider";
export default function Page() {
  return (
    <ApplicationProvider>
      <PageContent />
    </ApplicationProvider>
  );
}

function PageContent() {
  // load task
  const [isLoading, setIsLoading] = useState(false);
  const [tasks, setTasks] = useState([]);
  const router = useRouter();
  const projectId = router.query.id;

  const [taskTitleErr, setTaskTitleErr] = useState("");
  const [taskDescriptionErr, setTaskDescriptionErr] = useState("");
  const [showAddNewTaskPopUp, setShowAddNewTaskPopUp] = useState(false);

  const [isShowEditTaskDialog, setIsShowEditTaskDialog] = useState(false);
  const [isShowDeleteTaskDialog, setIsShowDeleteTaskDialog] = useState(false);
  const [originTaskTitle, setOriginTaskTitle] = useState("");
  const [originTaskDescription, setOriginTaskDescription] = useState("");
  const [targetTaskId, setTargetTaskId] = useState(-1);

  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");

  function clearFormData() {
    setNewTaskTitle("");
    setNewTaskDescription("");
  }

  const taskUrl =
    process.env.NEXT_PUBLIC_PROJECT_BASE_API + "/" + projectId + `/tasks`;

  useEffect(() => {
    setIsLoading(true);
    if (!checkValidToken()) {
      router.push("/");
    }
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
      router.push("/");
    }
  };

  async function createNewTask(e) {
    setIsLoading(true);
    clearErrors();

    const formData = new FormData(e.target);

    let newTitle = formData.get("title").trim();
    let newDescription = formData.get("description").trim();
    if (!isValidTitle(newTitle)) {
      setTaskTitleErr("This field must be not blank");
      setIsLoading((v) => false);
      return;
    }
    try {
      const body = JSON.stringify({
        title: newTitle,
        description: newDescription,
      });
      const response = await fetchFromAuthenticatedUrl(taskUrl, "POST", body);
      if (response.status === 409) {
        setTaskTitleErr("The title was in use");
        setIsLoading((v) => false);
        return;
      }

      if (response.status === 403) {
        console.log(403);
        setIsLoading((v) => false);
        return;
      }

      if (response.ok) {
        pushNotification(
          NotifyType.SUCCESS,
          `Create successfully task entitled "${newTitle}"`
        );
        loadPageFirstTime();
        clearFormData();
      }
    } catch (err) {
      console.error(err);
      router.push("/");
    } finally {
      setIsLoading((v) => false);
    }
  }

  const hideDeleteDialog = () => {
    setIsShowDeleteTaskDialog(false);
  };

  const handleShowEditTaskDialog = (task) => {
    setTargetTaskId(task.id);
    setOriginTaskTitle(task.title);
    setOriginTaskDescription(task.description);
    setNewTaskTitle(task.title);
    setNewTaskDescription(task.description);
    setIsShowEditTaskDialog(true);
    clearErrors();
  };

  const handleHideEditTaskDialog = () => {
    setIsShowEditTaskDialog(false);
  };

  async function updateTask(e) {
    const formData = new FormData(e.target);

    // validate title
    let newTitle = formData.get("title");
    if (!isValidTitle(newTitle)) {
      setTaskTitleErr("Title must not be empty");
      return;
    }

    // trim data
    newTitle = newTitle.trim();
    const newDescription = formData.get("description").trim();
    if (
      newTitle === originTaskTitle &&
      newDescription === originTaskDescription
    ) {
      setTaskTitleErr("You have to make some changes");
      setTaskDescriptionErr("You have to make some changes");
      return;
    }

    // call api
    const updateUrl = taskUrl + `/${targetTaskId}`;
    try {
      const response = await fetchFromAuthenticatedUrl(
        updateUrl,
        "PUT",
        JSON.stringify({ title: newTitle, description: newDescription })
      );
      if (response.ok) {
        const message =
          originTaskTitle !== newTitle
            ? `The task's title has been changed from "${originTaskTitle} " to "${newTitle}" successfully.`
            : `The task entitled "${newTitle}" has been updated successfully.`;
        updateTaskContent(targetTaskId, newTitle, newDescription);
        pushNotification(NotifyType.SUCCESS, message);
        setIsShowEditTaskDialog(false);
      } else
        pushNotification(
          NotifyType.FAIL,
          "Update failed " + `[${response.status}]`
        );
    } catch (err) {
      console.error(err);
      pushNotification(NotifyType.FAIL, "Failed to update");
      router.push("/");
    }
  }

  function clearErrors() {
    setTaskDescriptionErr("");
    setTaskTitleErr("");
  }

  function updateTaskContent(id, title, description) {
    const newTasks = tasks.map((t) => {
      if (t.id === id) {
        t.title = title;
        t.description = description;
      }
      return t;
    });
    setTasks(newTasks);
  }

  const handleDeleteTask = (id, title) => {
    setTargetTaskId(id);
    setOriginTaskTitle(title);
    setIsShowDeleteTaskDialog(true);
  };

  const deleteSelectedTask = async () => {
    setIsLoading(true);
    try {
      const url = taskUrl + "/" + targetTaskId;
      const response = await fetchFromAuthenticatedUrl(url, "DELETE");
      if (response.ok) {
        pushNotification(
          NotifyType.SUCCESS,
          `Deleted task named "${originTaskTitle}" successfully`
        );
        setIsShowDeleteTaskDialog(false);
        loadPageFirstTime();
      } else {
        pushNotification(
          NotifyType.FAIL,
          `Deleted task named "${originTaskTitle}" failed`
        );
      }
    } catch (err) {
      console.error(err);
    }
    setIsLoading(false);
  };

  return (
    <Layout
      stage="authenticated"
      isLoading={isLoading}
      notifications={notifications}
      onDeleteNotification={(n) =>
        setNotifications(notifications.filter((e) => e.id !== n.id))
      }
    >
      <PageHeaderControls
        onClickAddNew={() => {
          setShowAddNewTaskPopUp(true);
          clearFormData();
          setTaskTitleErr("");
        }}
        addNewButtonLabel="Add new task"
        searchBarPlaceHoder="Search for tasks..."
      />

      <InfiniteScroll dataLength={tasks.length}>
        {tasks.map((e, index) => (
          <Task
            key={e.id}
            id={e.id}
            belongProjectId={projectId}
            title={e.title}
            desciptions={e.description}
            status={e.status}
            createdAt={e.createdAt}
            startedAt={e.startedAt}
            finishedAt={e.finishedAt}
            subtasksNum={e.subtasksNum}
            onDelete={() => handleDeleteTask(e.id, e.title)}
            onEdit={() => handleShowEditTaskDialog(e)}
            pushNotifcation={pushNotification}
          />
        ))}
      </InfiniteScroll>

      {showAddNewTaskPopUp && (
        <TaskDialog
          onChangeTitle={(e) => {
            setNewTaskTitle(e.target.value);
            setTaskTitleErr("");
          }}
          titleValue={newTaskTitle}
          onChangeDescription={(e) => {
            setNewTaskDescription(e.target.value);
            setTaskDescriptionErr("");
          }}
          descriptionValue={newTaskDescription}
          dialogTitle={"Create new task"}
          dialogDescription={
            "Type task name and description to create new task"
          }
          onClose={() => setShowAddNewTaskPopUp(false)}
          dialogIconUrl={"/images/icon-add-new.png"}
          titleErr={taskTitleErr}
          descriptionErr={taskDescriptionErr}
          onConfirm={(e) => createNewTask(e)}
        />
      )}

      {isShowDeleteTaskDialog && (
        <PopUp
          confirmPopup
          title="Delete task"
          description={
            <>
              Project named "<b>{originTaskTitle}</b>" will be deleted
              permanantly.
              <br />
              <br />
              <b>Are you sure?</b>
            </>
          }
          declineButtonContent="No"
          confirmButtonContent="Yes"
          popUpIcon="/images/delete-icon.png"
          onClose={hideDeleteDialog}
          onDecline={hideDeleteDialog}
          onConfirm={deleteSelectedTask}
        />
      )}

      {isShowEditTaskDialog && (
        <TaskDialog
          titleErr={taskTitleErr}
          descriptionErr={taskDescriptionErr}
          titleValue={newTaskTitle}
          descriptionValue={newTaskDescription}
          onChangeTitle={(e) => {
            setNewTaskTitle(e.target.value);
            setTaskTitleErr("");
          }}
          onChangeDescription={(e) => {
            setNewTaskDescription(e.target.value);
            setTaskDescriptionErr("");
          }}
          onClose={handleHideEditTaskDialog}
          dialogTitle="Edit your task"
          dialogDescription={
            <>
              Editting the task entitled...
              <br />
              <br />{" "}
              <i>
                "<b>{originTaskTitle}</b>"
              </i>
            </>
          }
          dialogIconUrl="/images/edit-icon.png"
          onConfirm={(e) => {
            updateTask(e);
          }}
        />
      )}
    </Layout>
  );
}
