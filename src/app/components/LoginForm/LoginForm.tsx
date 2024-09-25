"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { useForm } from "react-hook-form";
import TextControl from "@/app/components/TextControl/TextControl";
import { useUserNameProps, usePasswordProps } from "@/app/helpers/forms";
import { ButtonContrast, ButtonTypes } from "@/app/components/Button/Button";
import authFormStyles from "@/app/assets/styles/authForm.module.scss";
import { ILoginValues } from "@/app/helpers/types";
import ErrorMessage from "@/app/components/ErrorMessage/ErrorMessage";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { login } from "@/app/actions/client/auth";
import { useRouter } from "next/navigation";
import { getErrorMessage } from "@/lib/utils";
import Spinner from "@/components/Spinner/Spinner";

const LoginForm = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [error, setError] = useState("");

  const formAction = async (formData: FormData) => {
    try {
      const res = await login(formData);

      if (!res?.userName) {
        setError(res.message);
      } else {
        setError("");
        router.push("/");
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
        <LoginFormChildren />
      </form>
      {error && <ErrorMessage text={error} />}
      <p className={authFormStyles.linkHolder}>
        <Link href="/register">{t("createAccount")}</Link>
        {` ${t("or")} `}
        <Link href="/forget-password">{t("forgetPassword")}</Link>
      </p>
    </>
  );
};

const LoginFormChildren = () => {
  const { t } = useTranslation();
  const { pending } = useFormStatus();

  const {
    register,
    getFieldState,
    formState: { isValid, isDirty },
  } = useForm<ILoginValues>({
    defaultValues: {
      userName: "",
      password: "",
    },
  });

  const canSave = isDirty && isValid && !pending;

  return (
    <>
      <TextControl
        controlProps={{ ...useUserNameProps(), fieldState: getFieldState }}
        register={register}
      />
      <TextControl
        controlProps={{ ...usePasswordProps(), fieldState: getFieldState }}
        register={register}
      />
      <div className={authFormStyles.btnHolder}>
        <ButtonContrast type={ButtonTypes.SUBMIT} disabled={!canSave}>
          {t("login")}
        </ButtonContrast>
      </div>
      {pending && <Spinner />}
    </>
  );
};

export default LoginForm;
