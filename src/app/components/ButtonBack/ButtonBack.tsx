"use client";

import { useRouter } from "next/navigation";
import {
  IButton,
  ButtonComponents,
  ButtonComponentsType,
} from "@/app/components/Button/Button";

export interface IButtonBack extends IButton {
  btnComponentName: ButtonComponentsType;
  callback?: () => any;
}

const ButtonBack = ({
  btnComponentName,
  children,
  type,
  disabled,
  extraClassname,
  callback,
  onClick,
}: IButtonBack) => {
  const router = useRouter();
  const TagName = ButtonComponents[btnComponentName];

  return (
    <TagName
      type={type}
      disabled={disabled}
      extraClassname={extraClassname}
      onClick={
        !onClick
          ? () => {
              if (callback) {
                callback();
              }
              router.back();
            }
          : onClick
      }
    >
      {children}
    </TagName>
  );
};

export default ButtonBack;
