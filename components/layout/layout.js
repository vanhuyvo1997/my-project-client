import NavBar from "../navbar/nav-bar";
import Notification from '@my-project/components/notification/notification';
import { NotifyType } from '@my-project/components/notification/notification';
import Loading from "../loading/loading";
export default function Layout({
  children,
  onClickCornerButton,
  cornerButtonContent,
  isLoading,
  notifications,
}) {
  return (
    <>
      <NavBar
        onClickButton={onClickCornerButton}
        buttonContent={cornerButtonContent}
        name="Admin"
      />
      <div className="container">{children}</div>
      <div className="notify-container">
        {
          notifications&&notifications.map((e, index)=> <Notification key={index} type={e.type} message={e.message} onDelete={()=>e.onDelete(e)}/>)
        }
      </div>
      {isLoading&&<Loading/>}
    </>
  );
}
