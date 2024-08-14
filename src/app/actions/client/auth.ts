"use server";

import { cookies } from "next/headers";
import {
  FormAuthSchema,
  FormRegisterSchema,
  FormForgetSchema,
} from "@/app/helpers/schemas";
import { getBaseURL } from "@/app/helpers/utils-common";
import {
  getAuthCookieFull,
  getAuthTokenName,
  getAuthCookie,
  setAuthCookie,
} from "@/app/helpers/auth";
import { getCurrentLangCookie } from "@/app/helpers/language";
import { getErrorMessage } from "@/lib/utils";

export const login = async (formData: FormData) => {
  const rawFormData = Object.fromEntries(formData.entries());
  const validatedFields = FormAuthSchema.safeParse(rawFormData);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing fields. Failed to authenticate.",
    };
  }

  const { userName, password } = validatedFields.data;
  const BASE_URL = await getBaseURL();
  const res = await fetch(`${BASE_URL}/api/login`, {
    method: "POST",
    cache: "no-cache",
    credentials: "include",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
      Cookie: await getCurrentLangCookie(),
      Accept: "*/*",
    },
    body: JSON.stringify({ userName, password }),
  });

  const authCookie = await getAuthCookieFull(res.headers);

  if (authCookie.length) {
    setAuthCookie({ authCookieString: authCookie[0] });
  }

  return await res.json();
};

export const logout = async () => {
  const BASE_URL = await getBaseURL();
  let resObj;
  try {
    const res = await fetch(`${BASE_URL}/api/logout`, {
      method: "POST",
      cache: "no-cache",
      credentials: "include",
      mode: "cors",
      headers: {
        Cookie: `${await getAuthCookie()}${await getCurrentLangCookie()}`,
      },
    });

    resObj = await res.json();
  } catch (err) {
    resObj.message = getErrorMessage(err);
  } finally {
    const tokenName = await getAuthTokenName();
    cookies().delete(tokenName);
    return resObj;
  }
};

export const registerUser = async (formData: FormData) => {
  const rawFormData = Object.fromEntries(formData.entries());
  const validatedFields = FormRegisterSchema.safeParse(rawFormData);

  if (!validatedFields.success) {
    const errors = validatedFields.error.flatten().fieldErrors;
    const str = Array.from(
      Object.entries(errors).map(
        ([key, val]) => `${key.toUpperCase()}: ${val?.join(", ")}`
      )
    ).join("\n");
    return {
      errors: errors,
      message: `Failed to register.\n${str}`,
    };
  }

  const { userName, email, password, confirmPassword } = validatedFields.data;
  const BASE_URL = await getBaseURL();
  const res = await fetch(`${BASE_URL}/api/register`, {
    method: "POST",
    cache: "no-cache",
    credentials: "include",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
      Cookie: await getCurrentLangCookie(),
      Accept: "*/*",
    },
    body: JSON.stringify({
      user: { userName, email, password, confirmPassword },
    }),
  });

  return await res.json();
};

export const forgetPassword = async (formData: FormData) => {
  const rawFormData = Object.fromEntries(formData.entries());
  const validatedFields = FormForgetSchema.safeParse(rawFormData);

  if (!validatedFields.success) {
    const errors = validatedFields.error.flatten().fieldErrors;
    return {
      errors: errors,
      message: `Failed to renew access.`,
    };
  }

  const { email } = validatedFields.data;
  const BASE_URL = await getBaseURL();
  const res = await fetch(`${BASE_URL}/api/forget-password`, {
    method: "POST",
    cache: "no-cache",
    credentials: "include",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
      Cookie: await getCurrentLangCookie(),
      Accept: "*/*",
    },
    body: JSON.stringify({ email }),
  });

  return await res.json();
};
