"use client";

import { useRouter } from "next/navigation";
import {
  IButton,
  ButtonComponents,
  ButtonComponentsType,
} from "@/app/components/Button/Button";
import React from "react";

export interface IButtonBack extends IButton {
  btnComponentName: ButtonComponentsType;
}

const ButtonBack = ({
  btnComponentName,
  children,
  type,
  disabled,
  extraClassname,
}: IButtonBack) => {
  const router = useRouter();
  const TagName = ButtonComponents[btnComponentName];

  return (
    <TagName
      type={type}
      children={children}
      disabled={disabled}
      extraClassname={extraClassname}
      onClick={() => {
        router.back();
      }}
    />
  );
};

export default ButtonBack;
