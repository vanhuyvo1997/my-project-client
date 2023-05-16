import NavBar from "../navbar/nav-bar";
import Notification from '@my-project/components/notification/notification';
import { NotifyType } from '@my-project/components/notification/notification';
import Loading from "../loading/loading";
import PageContainer, {ContainerSize} from "../page-container/page-container";
export default function Layout({
  children,
  onClickCornerButton,
  navBarButtonContent,
  greetingName,
  isLoading,
  notifications,
  showGreeting,
  containerSize
}) {
  return (
    <>
      <NavBar
        onClickButton={onClickCornerButton}
        buttonContent={navBarButtonContent}
        name={greetingName}
        showGreeting={showGreeting}
        navBarButtonContent = {navBarButtonContent}
      />
      <PageContainer size={containerSize}>
        {children}
      </PageContainer>
      <div className="notify-container">
        {
          notifications&&notifications.map((e, index)=> <Notification key={index} type={e.type} message={e.message} onDelete={()=>e.onDelete(e)}/>)
        }
      </div>
      {isLoading&&<Loading/>}
    </>
  );
}
