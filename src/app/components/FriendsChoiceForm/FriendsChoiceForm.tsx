"use client";

import { useState } from "react";
import authStyles from "@/app/assets/styles/authForm.module.scss";
import Button, {
  ButtonContrast,
  ButtonTypes,
} from "@/app/components/Button/Button";
import { useTranslation } from "react-i18next";
import { FriendType } from "@/app/helpers/types";
import { useForm } from "react-hook-form";
import { getErrorMessage } from "@/lib/utils";
import SelectControl, {
  SelectControlProps,
} from "@/app/components/SelectControl/SelectControl";
import ErrorMessage from "@/app/components/ErrorMessage/ErrorMessage";

const FriendsChoiceForm = ({
  formId,
  confirmFun,
  cancelFun,
  confirmBtnText,
  cancelBtnText,
  friends,
}: {
  formId: string;
  confirmFun: (args: any) => void;
  cancelFun?: () => void;
  confirmBtnText: string;
  cancelBtnText?: string;
  friends: FriendType[] | null;
}) => {
  const { t } = useTranslation();
  const [error, setError] = useState("");
  const {
    register,
    getFieldState,
    formState: { isValid, isDirty },
    getValues,
  } = useForm<any>({
    defaultValues: {
      userId: "",
    },
  });

  const canSave = isDirty && isValid;
  const optionsList = !friends
    ? []
    : friends.map((fr) => ({ value: fr.id, label: fr.userName }));

  const controlItemUserProps: SelectControlProps = {
    label: `${t("user")}*`,
    id: `${formId}__userId`,
    placeholder: "Select user",
    required: true,
    name: "userId",
    options: optionsList,
    fieldState: getFieldState,
  };

  const formAction = async () => {
    const data = getValues();

    try {
      const res = await confirmFun({ targetUserId: data.userId });
      setError("");
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <form action={formAction}>
      <SelectControl controlProps={controlItemUserProps} register={register} />
      <div className={`${authStyles.btnHolder}`}>
        <Button type={ButtonTypes.SUBMIT} disabled={!canSave}>
          {confirmBtnText}
        </Button>
        {cancelFun && (
          <ButtonContrast onClick={cancelFun}>
            {cancelBtnText ?? t("cancel")}
          </ButtonContrast>
        )}
      </div>
      {error && <ErrorMessage text={error} />}
    </form>
  );
};

export default FriendsChoiceForm;
