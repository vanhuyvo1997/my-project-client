import OneFieldDialog from "./one-field-dialog";

export default function OneFieldEditDialog({
  title,
  description,
  value,
  onClose,
  onDecline,
  onConfirm,
  fieldErr,
  fieldPlaceholder,
  onChangeField
}) {
  return (
    <OneFieldDialog
      title={title}
      description={description}
      value={value}
      onClose={onClose}
      onDecline={onDecline}
      onConfirm={onConfirm}
      fieldErr={fieldErr}
      popUpIcon="/images/edit-icon.png"
      fieldPlaceholder={fieldPlaceholder}
      onChangeField={onChangeField}
    />
  );
}
