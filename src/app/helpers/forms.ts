"use client";

import {
  TextControlTypes,
  TextControlProps,
} from "@/app/components/TextControl/TextControl";
import { useTranslation } from "react-i18next";

export const useUserNameProps = (): TextControlProps => {
  const { t } = useTranslation();

  return {
    label: t("userName"),
    id: "userName",
    type: TextControlTypes.TEXT,
    placeholder: t("yourLogin"),
    required: true,
    name: "userName",
    fieldState: () => {},
  };
};

export const usePasswordProps = (): TextControlProps => {
  const { t } = useTranslation();

  return {
    label: t("password"),
    id: "password",
    type: TextControlTypes.PASSWORD,
    placeholder: t("yourPassword"),
    required: true,
    name: "password",
    fieldState: () => {},
  };
};

export const useConfirmPasswordProps = (): TextControlProps => {
  const { t } = useTranslation();

  return {
    label: t("confirmPassword"),
    id: "confirmPassword",
    type: TextControlTypes.PASSWORD,
    placeholder: t("yourPassword"),
    required: true,
    name: "confirmPassword",
    fieldState: () => {},
  };
};

export const useEmailProps = (): TextControlProps => {
  const { t } = useTranslation();

  return {
    label: t("email"),
    id: "email",
    type: TextControlTypes.EMAIL,
    placeholder: t("yourEmail"),
    required: true,
    name: "email",
    fieldState: () => {},
  };
};

export const useMessageProps = (): TextControlProps => {
  const { t } = useTranslation();

  return {
    label: t("message"),
    id: "message",
    type: TextControlTypes.TEXTAREA,
    placeholder: t("yourMessage"),
    required: false,
    name: "message",
    fieldState: () => {},
  };
};
