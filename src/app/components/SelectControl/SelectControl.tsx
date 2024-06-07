import textControlStyles from "@/app/components/TextControl/textControl.module.scss";
import ErrorMessage from "@/app/components/ErrorMessage/ErrorMessage";

export interface SelectControlProps {
  label: string;
  id: string;
  placeholder: string | null;
  required: Boolean | { value: Boolean; message: string };
  name: string;
  options: { value: string; label?: string }[];
  fieldState: Function;
}

interface SelectControl {
  controlProps: SelectControlProps;
  register: Function;
  registerProps?: Object;
}

const SelectControl = ({
  controlProps,
  register,
  registerProps,
}: SelectControl) => {
  const { label, id, placeholder, required, name, fieldState, options } =
    controlProps;

  const inputState = fieldState(name);
  const error = inputState.error;
  const props = {
    id,
    className: `${textControlStyles.textControl}`,
  };
  const regProps = {
    ...registerProps,
    required:
      required === true ? { value: true, message: "required" } : required,
  };
  const renderedPlaceholder = !placeholder ? null : (
    <option key={placeholder} value={""}>
      {placeholder}
    </option>
  );
  const renderedOpts = options.map((optItem) => (
    <option key={optItem.value} value={optItem.value}>
      {optItem?.label ?? optItem.value}
    </option>
  ));
  const controlItem = (
    <select {...register(name, regProps)} {...props} key={name}>
      {renderedPlaceholder}
      {renderedOpts}
    </select>
  );

  return (
    <div key={id} className={`${textControlStyles.formGroup}`}>
      <label htmlFor={id}>{label}</label>
      {controlItem}
      {error && <ErrorMessage text={error.message} />}
    </div>
  );
};

export default SelectControl;
