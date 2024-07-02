"use client";

import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { inviteFriendViaEmail } from "@/app/helpers/actions";
import { useEmailProps, useMessageProps } from "@/app/helpers/forms";
import TextControl from "@/app/components/TextControl/TextControl";
import Button, { ButtonTypes } from "@/app/components/Button/Button";
import ErrorMessage from "@/app/components/ErrorMessage/ErrorMessage";
import { getErrorMessage } from "@/lib/utils";
import authFormStyles from "@/app/assets/styles/authForm.module.scss";

const InviteFriendForm = () => {
  const { t } = useTranslation();
  const [error, setError] = useState("");
  const {
    register,
    getFieldState,
    formState: { isValid, isDirty },
  } = useForm<any>({
    defaultValues: {
      email: "",
      message: "",
    },
  });

  const canSave = isDirty && isValid;

  const formAction = async (formData: FormData) => {
    try {
      const res = await inviteFriendViaEmail(formData);
      setError(getErrorMessage(res?.message));
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <form action={formAction}>
      <TextControl
        controlProps={{
          ...useEmailProps(),
          placeholder: t("email"),
          fieldState: getFieldState,
        }}
        register={register}
      />
      <TextControl
        controlProps={{
          ...useMessageProps(),
          placeholder: t("message"),
          fieldState: getFieldState,
        }}
        register={register}
      />
      <div className={authFormStyles.btnHolder}>
        <Button type={ButtonTypes.SUBMIT} disabled={!canSave}>
          {t("invite")}
        </Button>
      </div>
      {error && <ErrorMessage text={error} />}
    </form>
  );
};

export default InviteFriendForm;
