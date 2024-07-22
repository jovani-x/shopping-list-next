"use client";

import statusStyles from "./editingStatus.module.scss";
import { EditingStatusType, CardEditingStatus } from "@/app/helpers/types";
import { useTranslation } from "react-i18next";

const EditingStatus = ({ status }: { status: EditingStatusType }) => {
  const { value, userName } = status;
  const isBeingEdited = value === CardEditingStatus.EDITING;
  const inProcess = value === CardEditingStatus.IN_PROCESS;
  const { t } = useTranslation();

  if (!isBeingEdited && !inProcess) {
    return <></>;
  }

  const classStr = `${statusStyles.editingStatus} ${
    isBeingEdited ? statusStyles.editing : ""
  } ${inProcess ? statusStyles.inProcess : ""}`;
  const statusStr = isBeingEdited
    ? `${t("isEditing")} ...`
    : `${t("isShopping")} ...`;

  return <div className={classStr}>{`${userName} ${statusStr}`}</div>;
};

export default EditingStatus;
