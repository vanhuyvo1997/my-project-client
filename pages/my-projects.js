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

  const [isShowDeleteDialog, setIsShowDeleteDialog] = useState(false);
  const [deletingProjectId, setDeletingProjectId] = useState(-1);
  const [deletingProjectName, setDeletingProjectName] = useState("");

  const [isShowEditProjectDialog, setIsShowEditProjectDialog] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState(-1);
  const [editingProjectName, setEditingProjectName] = useState('');
  const [oldEditingProjectName, setEditingProjectOldName] = useState('');


  const [newProjectName, setNewProjectName] = useState("");
  const [projectNameErr, setProjectNameErr] = useState("");

  const [notifications, setNotifications] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");

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
    setIsLoading(true);
    const url = `${process.env.NEXT_PUBLIC_PROJECT_BASE_API}?pageNum=0&size=${process.env.NEXT_PUBLIC_LOAD_PROJECT_CHUNK_SIZE}&desc=true&sortBy=startedAt,name&term=${searchTerm}`;
    setProjects(await loadProjectsFormUrl(url));
    setIsLoading(false);
  };

  const loadMoreProject = async (page) => {
    if (hasMore) {
      const url = `${process.env.NEXT_PUBLIC_PROJECT_BASE_API}?pageNum=${currentPage + 1}&size=${process.env.NEXT_PUBLIC_LOAD_PROJECT_CHUNK_SIZE}&desc=true&sortBy=startedAt,name&term=${searchTerm}`;
      setProjects([...projects, ... await loadProjectsFormUrl(url)]);
    }
  };

  const deleteNotification = notification =>onDeleteNotifycation(notification, notifications, setNotifications);

  const showAddNewPopUp = () => {setIsShowAddNewPopUp(true);};
  const hideAddNewPopUp = () => {setIsShowAddNewPopUp(false);setProjectNameErr("")};

  const createNewProject = async () => {
    setIsLoading(true);
    setProjectNameErr("");
    if (!isValidName(newProjectName)){
      setProjectNameErr("Name must not be empty");
      setIsLoading(false);
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

  useEffect(()=>{
    const searchFunc = setTimeout(loadPageFirstTime, 1000);
    return ()=>clearTimeout(searchFunc);
  }, [searchTerm]);

  const hideDeleteDialog = () => {setIsShowDeleteDialog(false)};

  const showDeleteDialog = (id, name) =>{
    setDeletingProjectId(id);
    setDeletingProjectName(name);
    setIsShowDeleteDialog(true);
  }


  const deleteProject = async ()=>{
    setIsLoading(true);
    const url = process.env.NEXT_PUBLIC_PROJECT_BASE_API + `/${deletingProjectId}`
    try{
      const respone = await fetchFromAuthenticatedUrl(url, "DELETE");
      if(respone.ok){
        setIsShowDeleteDialog(false);
        notifications.push(NotifyObject(NotifyType.SUCCESS, `Deleted project named "${deletingProjectName}"`, deleteNotification));
        loadPageFirstTime();
      } else {
        notifications.push(NotifyObject(NotifyType.FAIL, `Fail to delete project named "${deletingProjectName}"`, deleteNotification))
      }
 
    } catch(err){
      console.error(err);
      notifications.push(NotifyObject(NotifyType.FAIL, err.message, deleteNotification))
    }
    setIsLoading(false);
  }


  const hideEditProjectDialog = () => {
    setIsShowEditProjectDialog(false);
    setProjectNameErr("");
  };

  const showEditProjectDialog = (id, name) =>{
    setEditingProjectId(id);
    setEditingProjectName(name);
    setEditingProjectOldName(name);
    setIsShowEditProjectDialog(true)
  };

  const editProject =  async () => {
    setIsLoading(true)

    if(editingProjectName === oldEditingProjectName){
      setProjectNameErr("There is no change on name");
      setIsLoading(false);
      return;
    }

    if (!isValidName(editingProjectName)){
      setProjectNameErr("Name must not be empty");
      setIsLoading(false);
      return;
    }

    try{
      const url = process.env.NEXT_PUBLIC_PROJECT_BASE_API + `/${editingProjectId}/name`;
      const respone = await fetchFromAuthenticatedUrl(url, "PATCH", JSON.stringify({name: editingProjectName}));
      if(respone.ok){
        const index = projects.findIndex(p=>p.id == editingProjectId);
        projects[index].name = editingProjectName;
        setIsShowEditProjectDialog(false);
        notifications.push(NotifyObject(NotifyType.SUCCESS, `"${oldEditingProjectName}" has changed to "${editingProjectName}"`, deleteNotification));
      } else if(respone.status == 409){
        setProjectNameErr("This name is already in use");
      } else {
        notifications.push(NotifyObject(NotifyType.FAIL, "Fail to update: " + respone.status , deleteNotification));
      }
    } catch(err){
      console.error(err);
      notifications.push(NotifyObject(NotifyType.FAIL, err.message, deleteNotification));
    }
    setIsLoading(false);
  }

  
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
        searchValue={searchTerm}
        onChangeSearchValue={e=> setSearchTerm(e.target.value)}
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
              link={"projects/" + e.id}
              key={e.id}
              name={e.name}
              startedAt={new Date(e.createdAt).toLocaleDateString()}
              status={e.status}
              onClickEdit={()=>showEditProjectDialog(e.id, e.name)}
              onClickDelete={()=>showDeleteDialog(e.id, e.name)}
            />
          ))}
      </InfiniteScroll>

      {/* delete project popup */}
      <PopUp
        confirmPopup title="Delete project"
        description={<>Project named "<b>{deletingProjectName}</b>" will be deleted permanantly.<br/><br/><b>Are you sure?</b></>}
        declineButtonContent="No"
        confirmButtonContent="Yes"
        popUpIcon="/images/delete-icon.png"
        isShow = {isShowDeleteDialog}
        onClose={hideDeleteDialog}
        onDecline={hideDeleteDialog}
        onConfirm={deleteProject}
      />

      {/* Add project popup */}
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
          onChange={(e) => {setNewProjectName(e.target.value); setProjectNameErr("");}}
          name="name"
          placeholder="Project's name"
        ></TextInput>
      </PopUp>

      {/* Edit project pop up */}
      <PopUp
        isShow={isShowEditProjectDialog}
        onDecline={hideEditProjectDialog}
        title="Edit project"
        onClose={hideEditProjectDialog}
        onConfirm={editProject}
        confirmPopup={false}
        popUpIcon="/images/edit-icon.png"
        description={<>Type new name for project named "<b>{oldEditingProjectName}</b>"</>}
      >
        <TextInput
          error={projectNameErr}
          value={editingProjectName}
          onChange={(e) => {setEditingProjectName(e.target.value); setProjectNameErr("");}}
          name="name"
          placeholder="Project's name"
        ></TextInput>
      </PopUp>
      
    </Layout>



            
  );
}
