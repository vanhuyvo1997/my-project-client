import AddNewButton from "../add-new-button/add-new-button";
import TextInput from "../text-input/text-input";
import styles from "./PageHeaderControls.module.css";

export default function PageHeaderControls({
    addNewButtonLabel,
    searchBarPlaceHoder,
    onClickAddNew,
    onChangeSearchValue,
    searchValue
}) {
  return (
    <div className={styles["page-header-controls-container"]}>
        <div className={styles["add-button-container"]}>
            <AddNewButton label={addNewButtonLabel} onClick={onClickAddNew}/>
        </div>
        <div className={styles["search-input-container"]}>
            <TextInput value={searchValue} placeholder={searchBarPlaceHoder} iconSrc="/images/search-icon.png" onChange={onChangeSearchValue} />
        </div>
    </div>
  );
}
