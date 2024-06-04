"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { IForgetValues } from "@/app/helpers/types";
import { forgetPassword } from "@/app/helpers/actions";
import { getErrorMessage } from "@/lib/utils";
import ErrorMessage from "@/app/components/ErrorMessage/ErrorMessage";
import { ButtonContrast, ButtonTypes } from "@/app/components/Button/Button";
import TextControl from "@/app/components/TextControl/TextControl";
import { emailProps } from "@/app/helpers/forms";
import authFormStyles from "@/app/assets/styles/authForm.module.scss";
import Link from "next/link";
import { useTranslation } from "react-i18next";

const ForgetPasswordForm = () => {
  const { t } = useTranslation();
  const [error, setError] = useState("");

  const {
    register,
    getFieldState,
    formState: { isValid, isDirty },
  } = useForm<IForgetValues>({
    defaultValues: {
      email: "",
    },
  });

  const canSave = isDirty && isValid;

  const formAction = async (formData: FormData) => {
    try {
      const res = await forgetPassword(formData);

      if (res?.errors) {
        setError(res?.message);
      } else {
        setError(res?.message);
      }
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <>
      <form action={formAction}>
        <TextControl
          controlProps={{ ...emailProps(), fieldState: getFieldState }}
          register={register}
        />
        <div className={authFormStyles.btnHolder}>
          <ButtonContrast
            type={ButtonTypes.SUBMIT}
            children={t("restoreAccess")}
            disabled={!canSave}
          />
        </div>
      </form>
      {error && <ErrorMessage text={error} />}
      <p className={authFormStyles.linkHolder}>
        <Link href="/login">{t("login")}</Link>
        {` ${t("or")} `}
        <Link href="/register">{t("createAccount")}</Link>
      </p>
    </>
  );
};

export default ForgetPasswordForm;
