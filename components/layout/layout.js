import NavBar from "../navbar/nav-bar";
import Notification from "@my-project/components/notification/notification";
import Loading from "../loading/loading";
import PageContainer, { ContainerSize } from "../page-container/page-container";
export default function Layout({
  children,
  isLoading,
  notifications,
  onDeleteNotification,
  stage,
  containerSize,
}) {
  console.log("checking...");
  return (
    <>
      <NavBar stage={stage} />
      <PageContainer size={containerSize}>{children}</PageContainer>
      <div className="notify-container col-s-8 col-5">
        {notifications &&
          notifications.map((e, index) => (
            <Notification
              key={index}
              type={e.type}
              message={e.message}
              onDelete={() => onDeleteNotification(e)}
            />
          ))}
      </div>
      {isLoading && <Loading />}
    </>
  );
}
