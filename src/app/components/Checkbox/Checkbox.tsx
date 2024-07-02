"use client";

import { useEffect, useState } from "react";
import { Controller } from "react-hook-form";
import checkboxStyles from "./checkbox.module.scss";

const Checkbox = ({
  text,
  onChange,
  checked,
  checkId,
  control,
  shouldUnregister,
  extraClassname,
}: {
  text: string;
  onChange: Function;
  checked: boolean;
  checkId?: string;
  control?: any;
  shouldUnregister?: boolean;
  extraClassname?: string;
}) => {
  const id = checkId ?? text;
  const [isChecked, setIsChecked] = useState(checked);

  useEffect(() => onChange(isChecked), [isChecked, onChange]);

  const renderedCheckbox = !control ? (
    <input
      id={id}
      type="checkbox"
      className="rounded text-sky-500"
      onChange={() => setIsChecked(!isChecked)}
      checked={isChecked}
    />
  ) : (
    <Controller
      shouldUnregister={shouldUnregister}
      control={control}
      name={id}
      render={({ field }) => (
        <input
          id={id}
          type="checkbox"
          className="rounded text-sky-500"
          onChange={(e) => {
            field.onChange(e.target.checked);
            setIsChecked(!isChecked);
          }}
        />
      )}
    />
  );

  return (
    <div className={`${checkboxStyles.checkboxItem} ${extraClassname}`}>
      {renderedCheckbox}
      <label htmlFor={id}>{text}</label>
    </div>
  );
};

export default Checkbox;
