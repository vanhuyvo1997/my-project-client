export function onDeleteNotifycation(target, notifications, setNotificationCallback){
    const index = notifications.indexOf(target);
    if(index > -1){
      notifications.splice(index, 1);
    }
    setNotificationCallback([...notifications]);
  }
