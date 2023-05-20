import AddNewButton from "@my-project/components/add-new-button/add-new-button";
import Layout from "@my-project/components/layout/layout";
import { ContainerSize } from "@my-project/components/page-container/page-container";
import Project from "@my-project/components/project/project";
import styles from "styles/MyProject.module.css";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import jwtDecode from "jwt-decode";
import InfiniteScroll from "react-infinite-scroll-component";
import PopUp from "@my-project/components/pop-up/pop-up";
import TextInput from "@my-project/components/text-input/text-input";
import { CREAT_NEW_PROJECT_URL } from "@my-project/api-list";
import { isValidName } from "@my-project/util/validate-utils";
import { NotifyObject, NotifyType } from "@my-project/components/notification/notification";
import { onDeleteNotifycation } from "@my-project/util/notification-utils";
import PageHeaderControls from "@my-project/components/project-controls/page-header-controls";

export default function MyProjects() {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState("Guest");
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [isShowAddnewPopUp, setIsShowAddNewPopUp] = useState(false);
  const router = useRouter();

  const [newProjectName, setNewProjectName] = useState("");
  const [projectNameErr, setProjectNameErr] = useState("");

  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    setIsLoading(true);
    const accessToken = localStorage.getItem("accessToken");
    (!accessToken || jwtDecode(accessToken).role != "USER") &&
      router.push("/sign-in");
    setUsername(jwtDecode(accessToken).sub);
    loadPageFirstTime();
    setIsLoading(false);
  }, []);

  const fetchFromAuthenticatedUrl = (url, method, body) => {
    return fetch(url, {
      method: method,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        "Content-Type": "application/json",
      },
      body: body,
    });
  };

  const loadProjectsFormUrl = async (url) => {
    try {
      const response = await fetchFromAuthenticatedUrl(url, "GET");
      if (response.status == 403) {
        router.push("/sign-in");
        return [];
      } else if (response.ok) {
        const data = await response.json();
        setCurrentPage(data.currentPageNum);
        setHasMore(data.currentPageNum < data.totalPages - 1);
        return data.currentPageContent;
      }
    } catch (err) {
      console.error(err);
      router.push("/sign-in");
    }
  }

  const loadPageFirstTime = async () => {
    const url = `${process.env.NEXT_PUBLIC_PROJECT_BASE_API}?pageNum=0&size=${process.env.NEXT_PUBLIC_LOAD_PROJECT_CHUNK_SIZE}&desc=true&sortBy=startedAt,name`;
    setProjects(await loadProjectsFormUrl(url));
  };

  const loadMoreProject = async (page) => {
    if (hasMore) {
      const url = `${process.env.NEXT_PUBLIC_PROJECT_BASE_API}?pageNum=${currentPage + 1}&size=${process.env.NEXT_PUBLIC_LOAD_PROJECT_CHUNK_SIZE}&desc=true&sortBy=startedAt,name`;
      setProjects([...projects, ... await loadProjectsFormUrl(url)]);
    }
  };

  const deleteNotification = notification =>onDeleteNotifycation(notification, notifications, setNotifications);

  const showAddNewPopUp = () => {setIsShowAddNewPopUp(true);};
  const hideAddNewPopUp = () => {setIsShowAddNewPopUp(false);};

  const createNewProject = async () => {
    setIsLoading(true);
    setProjectNameErr("");
    if (!isValidName(newProjectName)){
      setProjectNameErr("Name must not be empty");
      setIsLoading(true);
      return;
    }
    
    try {
      const body = JSON.stringify({name: newProjectName});
      const response = await fetchFromAuthenticatedUrl(process.env.NEXT_PUBLIC_PROJECT_BASE_API, "POST", body);
      if (response.ok) {
        const data = await response.json();
        notifications.push(NotifyObject(NotifyType.SUCCESS,`Create project named "${data.name}" successfully.`,  deleteNotification));
        loadPageFirstTime();
        setNewProjectName("");
      } else if (response.status == 409) {
        setProjectNameErr("Project name already exist");
      }
    } catch (err) {
      console.log(err);
      notifications.push(NotifyObject(NotifyType.FAIL, err.message, deleteNotification));
    }
    setIsLoading(false);
  };

  
  return (
    <Layout
      showGreeting
      greetingName={username}
      navBarButtonContent="Sign out"
      containerSize={ContainerSize.LARGE}
      isLoading={isLoading}
      notifications={notifications}
      onDeleteNotifycation={deleteNotification}
    >
      <PageHeaderControls 
        addNewButtonLabel="Add new project"
        onClickAddNew={showAddNewPopUp}
        searchBarPlaceHoder="Search..." />

      <InfiniteScroll
        className={styles["project-list"]}
        dataLength={projects && projects.length}
        hasMore={hasMore}
        loader="loading..."
        next={loadMoreProject}
      >
        {projects &&
          projects.map((e) => (
            <Project
              key={e.id}
              name={e.name}
              startedAt={new Date(e.createdAt).toLocaleDateString()}
              status={e.status}
            />
          ))}
      </InfiniteScroll>

      <PopUp
        isShow={isShowAddnewPopUp}
        onDecline={hideAddNewPopUp}
        title="Create new project"
        onClose={hideAddNewPopUp}
        confirmPopup={false}
        popUpIcon="/images/icon-add-new.png"
        description="Type the name of the project you want to create"
        onConfirm={createNewProject}
      >
        <TextInput
          error={projectNameErr}
          value={newProjectName}
          onChange={(e) => setNewProjectName(e.target.value)}
          name="name"
          placeholder="Project's name"
        ></TextInput>
      </PopUp>
    </Layout>
  );
}
