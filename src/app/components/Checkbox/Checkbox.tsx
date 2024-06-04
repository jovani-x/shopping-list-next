import { useEffect, useState } from "react";
import checkboxStyles from "./checkbox.module.scss";

const Checkbox = ({
  text,
  onChange,
  checked,
}: {
  text: string;
  onChange: Function;
  checked: boolean;
}) => {
  const id = text;
  const [isChecked, setIsChecked] = useState(checked);

  useEffect(() => onChange(isChecked), [isChecked]);

  return (
    <div className={checkboxStyles.checkboxItem}>
      <input
        id={id}
        type="checkbox"
        className="rounded text-sky-500"
        onChange={() => setIsChecked(!isChecked)}
        checked={isChecked}
      />
      <label htmlFor={id}>{text}</label>
    </div>
  );
};

export default Checkbox;
