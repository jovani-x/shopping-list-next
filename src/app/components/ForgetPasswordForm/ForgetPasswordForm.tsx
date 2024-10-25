"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { useForm } from "react-hook-form";
import { IForgetValues } from "@/app/helpers/types";
import { forgetPassword } from "@/app/actions/client/auth";
import { getErrorMessage } from "@/lib/utils";
import ErrorMessage from "@/app/components/ErrorMessage/ErrorMessage";
import { ButtonContrast, ButtonTypes } from "@/app/components/Button/Button";
import TextControl from "@/app/components/TextControl/TextControl";
import { useEmailProps } from "@/app/helpers/forms";
import authFormStyles from "@/app/assets/styles/authForm.module.scss";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import Spinner from "@/components/Spinner/Spinner";

const ForgetPasswordForm = () => {
  const { t } = useTranslation();
  const [error, setError] = useState("");

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
      <form
        action={formAction}
        className={authFormStyles.formWithCenteredSpinner}
      >
        <ForgetPasswordFormChildren />
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

const ForgetPasswordFormChildren = () => {
  const { t } = useTranslation();
  const { pending } = useFormStatus();

  const {
    register,
    getFieldState,
    formState: { isValid, isDirty },
  } = useForm<IForgetValues>({
    defaultValues: {
      email: "",
    },
  });

  const canSave = isDirty && isValid && !pending;

  return (
    <>
      <TextControl
        controlProps={{ ...useEmailProps(), fieldState: getFieldState }}
        register={register}
      />
      <div className={authFormStyles.btnHolder}>
        <ButtonContrast type={ButtonTypes.SUBMIT} disabled={!canSave}>
          {t("restoreAccess")}
        </ButtonContrast>
      </div>
      {pending && <Spinner />}
    </>
  );
};

export default ForgetPasswordForm;
