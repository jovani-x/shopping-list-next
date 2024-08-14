import textControlStyles from "./textControl.module.scss";
import ErrorMessage from "@/app/components/ErrorMessage/ErrorMessage";

export enum TextControlTypes {
  TEXT = "text",
  EMAIL = "email",
  PHONE = "tel",
  PASSWORD = "password",
  NUMBER = "number",
  TEXTAREA = "textarea",
}

export interface TextControlProps {
  label: string;
  id: string;
  type?: TextControlTypes;
  placeholder: string | null;
  required: Boolean | { value: Boolean; message: string };
  name: string;
  fieldState: Function;
}

interface TextControl {
  controlProps: TextControlProps;
  register: Function;
  registerProps?: Object;
}

const TextControl = ({
  controlProps,
  register,
  registerProps,
}: TextControl) => {
  const { label, id, type, placeholder, required, name, fieldState } =
    controlProps;

  const inputState = fieldState(name);
  const error = inputState.error;
  const props = {
    id,
    placeholder: placeholder || "",
    className: `${textControlStyles.textControl}`,
  };
  const regProps = {
    ...registerProps,
    required:
      required === true ? { value: true, message: "required" } : required,
  };
  const controlItem =
    type === TextControlTypes.TEXTAREA ? (
      <textarea {...register(name, regProps)} {...props} />
    ) : (
      <input
        type={type ?? TextControlTypes.TEXT}
        {...register(name, regProps)}
        {...props}
      />
    );

  return (
    <div className={`${textControlStyles.formGroup}`}>
      <label htmlFor={id}>{label}</label>
      {controlItem}
      {error && <ErrorMessage text={error.message} />}
    </div>
  );
};

export default TextControl;
