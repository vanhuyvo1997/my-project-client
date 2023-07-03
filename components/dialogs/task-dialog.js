import PopUp from "../pop-up/pop-up";
import TextInput from "../text-input/text-input";

export default function TaskDialog({
  onClose,
  titleValue="",
  descriptionValue="",
  dialogDescription,
  confirmButtonContent,
  dialogIconUrl,
  dialogTitle,
  onChangeTitle,
  onChangeDescription,
  onConfirm,
  titleErr,
  descriptionErr,
}) {

  return (
    <PopUp
      description={dialogDescription}
      declineButtonContent="Cancel"
      confirmButtonContent={confirmButtonContent}
      onClose={onClose}
      onDecline={onClose}
      popUpIcon={dialogIconUrl}
      title={dialogTitle}
      onConfirm={e => {onConfirm(e)}}
      
    >
      <TextInput
        maxLength="255"
        autoFocus
        name="title"
        value={titleValue}
        placeholder="Type your title"
        label="Task title"
        onChange={onChangeTitle}
        error={titleErr}
      />
      <br />
      <TextInput
        maxLength="255"
        name="description"
        textarea
        placeholder="Type your description"
        value={descriptionValue}
        onChange={onChangeDescription}
        label="Description"
        error={descriptionErr}
      />
    </PopUp>
  );
}
