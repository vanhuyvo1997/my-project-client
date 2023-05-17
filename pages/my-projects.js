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

export default function MyProjects() {
  const [projects, setProjects] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState("Guest");
  const [currentPage, setCurrentPage] = useState(0);
  const [size, setSize] = useState(15);
  const [totalPages, setTotalPages] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [isShowAddnewPopUp, setIsShowAddNewPopUp] = useState(false);
  const router = useRouter();

  const [newProjectName, setNewProjectName] = useState("");

  const url = `http://localhost:8080/api/projects?pageNum=${currentPage}&size=${size}&desc=true&sortBy=startedAt,name`;

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    (!accessToken || jwtDecode(accessToken).role != "USER") &&
      router.push("/sign-in");
    setUsername(jwtDecode(accessToken).sub);
    setIsLoading(true);
    loadFirstPage();
    setIsLoading(false);
  }, []);

  const fetchFromUrl = (url) => {
    return fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });
  };

  const loadFirstPage = async () => {
    try {
      const response = await fetchFromUrl(url);
      if (response.status == 403) {
        router.push("/sign-in");
      }
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setTotalPages(data.totalPages);
        setCurrentPage(data.currentPageNum);
        setProjects(data.currentPageContent);
        data.currentPageNum < data.totalPages - 1 && setHasMore(true);
      }
    } catch (err) {
      console.log(err);
      router.push("/sign-in");
    }
  };

  const loadMoreProject = async (page) => {
    if (currentPage < totalPages - 1) {
      const url = `http://localhost:8080/api/projects?pageNum=${
        currentPage + 1
      }&size=${size}&desc=true&sortBy=startedAt,name`;
      const response = await fetchFromUrl(url);
      const data = await response.json();
      setProjects([...projects, ...data.currentPageContent]);
      setCurrentPage(data.currentPageNum);
    } else setHasMore(false);
  };

  const showAddNewPopUp = () => {setIsShowAddNewPopUp(true)};
  const hideAddNewPopUp = () => {setIsShowAddNewPopUp(false)};

  const createNewProject = () => {alert("createdProject");  setNewProjectName("");};

  return (
    <Layout
      showGreeting
      greetingName={username}
      navBarButtonContent="Sign out"
      containerSize={ContainerSize.LARGE}
      isLoading={isLoading}
      onClickCornerButton={loadFirstPage}
    >
      <div className={styles["sticky-top"]}>
        <AddNewButton onClick={showAddNewPopUp} />
      </div>

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

      <PopUp isShow={isShowAddnewPopUp} onDecline={hideAddNewPopUp}
        title="Create new project"
        onClose={hideAddNewPopUp}
        confirmPopup={false}
        popUpIcon="/images/icon-add-new.png"
        description="Type the name of the project you want to create"
        onConfirm={createNewProject}
      >
        <TextInput value={newProjectName} onChange={(e)=>setNewProjectName(e.target.value)} name="name" placeholder="Project's name"></TextInput>
      </PopUp>
    </Layout>
  );
}
