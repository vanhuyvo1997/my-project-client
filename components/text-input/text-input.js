import { useState } from "react";
import styles from "./TextInput.module.css";

export const TextInputType = {
  PRIMARY: "primary",
  ORANGE: "orange",
};
export default function TextInput({
  name,
  iconSrc,
  placeholder = "placeholder",
  type = TextInputType.PRIMARY,
  onChange,
  password,
  error,
  value,
  label,
  textarea,
  maxLength,
}) {
  const [isPassword, setIsPassword] = useState(password);
  return (
    <>
      <div>
        <div className={styles["input-text-container"]}>
          {label && <label htmlFor={name} className={styles.label}>{label + ":"}</label>}
          {!textarea&&<input maxLength={maxLength}
            className={`${styles["text-input"]} ${styles[type]} ${
              error && styles["error"]
            }`}
            value={value}
            name={name}
            type={isPassword ? "password" : "text"}
            placeholder={placeholder}
            onChange={onChange}
            style={
              (iconSrc && {
                backgroundImage: `url('${iconSrc}')`,
                paddingLeft: "36px",
                ...(password && { paddingRight: "30px" }),
                backgroundRepeat: "no-repeat",
                backgroundPosition: `6px 40%`,
                backgroundSize: `24px`,
              }) ||
              //if provid no icon src
              (password && { paddingRight: "30px" })
            }
          />}
          {password && (
            <button
              style={{
                ...{
                  backgroundImage: isPassword
                    ? "url('/images/hide-icon.png')"
                    : "url('/images/view-icon.png')",
                },
              }}
              onClick={(e) => {
                setIsPassword(!isPassword);
              }}
              className={styles["eye-button"]}
              type="button"
            />
          )}

          {textarea&&<textarea maxLength={maxLength} name={name} onChange={onChange} value={value} placeholder={placeholder} className={styles["textarea"]} />}
        </div>

        {error && <small className={styles["error-message"]}>{error}</small>}
      </div>
    </>
  );
}
