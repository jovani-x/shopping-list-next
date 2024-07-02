"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import TextControl from "@/app/components/TextControl/TextControl";
import {
  useUserNameProps,
  useEmailProps,
  usePasswordProps,
  useConfirmPasswordProps,
} from "@/app/helpers/forms";
import { ButtonContrast, ButtonTypes } from "@/app/components/Button/Button";
import authFormStyles from "@/app/assets/styles/authForm.module.scss";
import { IRegisterValues } from "@/app/helpers/types";
import { registerUser } from "@/app/helpers/actions";
import ErrorMessage from "@/app/components/ErrorMessage/ErrorMessage";
import { getErrorMessage } from "@/lib/utils";
import Link from "next/link";
import { useTranslation } from "react-i18next";

const RegisterForm = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [error, setError] = useState("");

  const {
    register,
    getFieldState,
    formState: { isValid, isDirty },
  } = useForm<IRegisterValues>({
    defaultValues: {
      userName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const canSave = isDirty && isValid;

  const formAction = async (formData: FormData) => {
    try {
      const res = await registerUser(formData);

      if (res?.errors || res?.message) {
        setError(res?.message);
      } else {
        setError("");
        router.push("/login");
      }
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <>
      <form action={formAction}>
        <TextControl
          controlProps={{
            ...useUserNameProps(),
            fieldState: getFieldState,
          }}
          register={register}
        />
        <TextControl
          controlProps={{ ...useEmailProps(), fieldState: getFieldState }}
          register={register}
        />
        <TextControl
          controlProps={{
            ...usePasswordProps(),
            fieldState: getFieldState,
          }}
          register={register}
        />
        <TextControl
          controlProps={{
            ...useConfirmPasswordProps(),
            fieldState: getFieldState,
          }}
          register={register}
        />
        <div className={authFormStyles.btnHolder}>
          <ButtonContrast type={ButtonTypes.SUBMIT} disabled={!canSave}>
            {t("createAccount")}
          </ButtonContrast>
        </div>
      </form>
      {error && <ErrorMessage text={error} />}
      <p className={authFormStyles.linkHolder}>
        <Link href="/login">{t("login")}</Link>
        {` ${t("or")} `}
        <Link href="/forget-password">{t("forgetPassword")}</Link>
      </p>
    </>
  );
};

export default RegisterForm;
