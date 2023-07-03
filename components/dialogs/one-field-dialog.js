import PopUp from "../pop-up/pop-up";
import TextInput from "../text-input/text-input";

export default function OneFieldDialog({
  title,
  popUpIcon,
  onDecline,
  onConfirm,
  onClose,
  description,
  fieldErr,
  value,
  fieldName = "",
  fieldPlaceholder = "",
  onChangeField,
}) {



  return (
    <PopUp
      onDecline={onDecline}
      title={title}
      onClose={onClose}
      onConfirm={onConfirm}
      confirmPopup={false}
      popUpIcon={popUpIcon}
      description={description}
    >
      <TextInput
        error={fieldErr}
        value={value}
        onChange={(e) => onChangeField(e.target.value)}
        name={fieldName}
        placeholder={fieldPlaceholder}
      ></TextInput>
    </PopUp>
  );
}
