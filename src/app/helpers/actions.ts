"use server";

import { cookies } from "next/headers";
import {
  FormAuthSchema,
  FormRegisterSchema,
  FormForgetSchema,
  CardSchema,
  FormInviteSchema,
} from "./schemas";
import {
  getApiURL,
  getAuthTokenName,
  getAuthCookie,
  getCookieTemplateObject,
} from "./utils";
import { ICard } from "@/app/components/Card/Card";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { defaultLocale } from "@/app/i18n";
import { FriendType, UserRole, UserRequest } from "@/app/helpers/types";

export const refreshPagesCache = (pathNames: string[]) => {
  const origin = headers().get("origin");
  pathNames.map((pathname) => revalidatePath(`${origin}${pathname}`));
};

export const authenticate = async (formData: FormData) => {
  const rawFormData = Object.fromEntries(formData.entries());
  const validatedFields = FormAuthSchema.safeParse(rawFormData);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing fields. Failed to authenticate.",
    };
  }

  const { userName, password } = validatedFields.data;
  const API_URL = await getApiURL();
  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: await setRequestCurrentLang(),
    },
    body: JSON.stringify({ userName, password }),
  });
  const tokenName = await getAuthTokenName();
  const getResCookies = res.headers.getSetCookie();
  const authCookie = getResCookies.filter(
    (c) => c.indexOf(`${tokenName}=`) === 0
  );

  if (authCookie.length) {
    const cookiesArray = authCookie[0].split(";");
    const cookieOpts = await getCookieTemplateObject(tokenName);
    cookiesArray.map((el) => {
      const [name, value] = el
        .trim()
        .split("=")
        .map((str) => str?.replace(/%3D/g, "="));

      switch (name) {
        case tokenName:
          Object.assign(cookieOpts, { name, value });
          break;
        case "Max-Age":
          Object.assign(cookieOpts, { maxAge: Number(value) });
          break;
        case "HttpOnly":
          Object.assign(cookieOpts, { httpOnly: value !== "false" });
          break;
        case "Secure":
          Object.assign(cookieOpts, { secure: value !== "false" });
          break;
        default:
          const nameStr = `${name[0].toLowerCase()}${name.substring(1)}`;
          Object.assign(cookieOpts, { [nameStr]: value });
      }
    });

    const getRestCookieProps = (cookieOpts: any) => {
      const { name, value, ...cookieProps } = cookieOpts;
      return cookieProps;
    };
    cookies().set(
      cookieOpts.name,
      cookieOpts.value,
      getRestCookieProps(cookieOpts)
    );
  }

  return await res.json();
};

export const logout = async () => {
  const API_URL = await getApiURL();
  const res = await fetch(`${API_URL}/api/auth/logout`, {
    method: "POST",
    cache: "no-cache",
    headers: {
      Cookie: `${await getAuthCookie()}${await setRequestCurrentLang()}`,
    },
  });

  const tokenName = await getAuthTokenName();
  const getResCookies = res.headers.getSetCookie();
  const authCookie = getResCookies.filter(
    (c) => c.indexOf(`${tokenName}=`) === 0
  );

  if (authCookie.length) {
    cookies().set(await getCookieTemplateObject(tokenName));
  }

  return await res.json();
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
  const API_URL = await getApiURL();
  const res = await fetch(`${API_URL}/api/auth/register`, {
    method: "POST",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json",
      Cookie: await setRequestCurrentLang(),
    },
    body: JSON.stringify({
      user: { userName, email, password, confirmPassword },
    }),
  });

  // if (!res.ok) {}

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
  const API_URL = await getApiURL();
  const res = await fetch(`${API_URL}/api/auth/forget`, {
    method: "POST",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json",
      Cookie: await setRequestCurrentLang(),
    },
    body: JSON.stringify({
      email,
    }),
  });

  // if (!res.ok) {}

  return await res.json();
};

export const getAllCards = async () => {
  const API_URL = await getApiURL();
  const res = await fetch(`${API_URL}/api/cards`, {
    method: "GET",
    cache: "no-cache",
    headers: {
      Cookie: `${await getAuthCookie()}${await setRequestCurrentLang()}`,
    },
  });

  if (!res.ok) {
    console.log("getAllCards: Failed to fetch data");
    return null;
  }

  const data = JSON.parse(await res.text());
  return data;
};

export const getCard = async (cardId: string) => {
  const API_URL = await getApiURL();
  const res = await fetch(`${API_URL}/api/cards/${cardId}`, {
    method: "GET",
    cache: "no-cache",
    headers: {
      Cookie: `${await getAuthCookie()}${await setRequestCurrentLang()}`,
    },
  });

  if (!res.ok) {
    console.log(`getCard #${cardId}: Failed to fetch data`);
    return null;
  }

  const data = JSON.parse(await res.text());
  return data.card;
};

export const createCard = async (cardValues: ICard) => {
  const validatedFields = CardSchema.safeParse(cardValues);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Failed to createCard.",
    };
  }

  const { id, ...cardObj } = validatedFields.data;
  const reqData = {
    card: cardObj,
  };

  const API_URL = await getApiURL();
  const res = await fetch(`${API_URL}/api/cards/new`, {
    method: "POST",
    body: JSON.stringify(reqData),
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json",
      Cookie: `${await getAuthCookie()}${await setRequestCurrentLang()}`,
    },
  });

  if (!res.ok) {
    console.log("createCard: Failed to fetch data");
    return null;
  }

  const data = JSON.parse(await res.text());
  // refreshPagesCache(["/", `/${data.card.id}`]);
  return data;
};

export const updateCard = async (cardValues: ICard) => {
  const validatedFields = CardSchema.safeParse(cardValues);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Failed to createCard.",
    };
  }

  const { id, ...cardObj } = validatedFields.data;
  const reqData = {
    card: cardObj,
  };
  const API_URL = await getApiURL();
  const res = await fetch(`${API_URL}/api/cards/${cardValues.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Cookie: `${await getAuthCookie()}${await setRequestCurrentLang()}`,
    },
    body: JSON.stringify(reqData),
    cache: "no-cache",
  });

  if (!res.ok) {
    console.log("updateCard: Failed to fetch data");
    return null;
  }

  const data = JSON.parse(await res.text());
  // refreshPagesCache(["/", `/${data.card.id}`]);
  return data;
};

export const removeCard = async (cardId: string) => {
  const API_URL = await getApiURL();
  const res = await fetch(`${API_URL}/api/cards/${cardId}`, {
    method: "DELETE",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json",
      Cookie: `${await getAuthCookie()}${await setRequestCurrentLang()}`,
    },
  });

  if (!res.ok) {
    console.log("removeCard: Failed to fetch data");
    return null;
  }

  const data = JSON.parse(await res.text());
  refreshPagesCache(["/", `/${data.card.id}`]);
  return data;
};

export const addToUser = async ({
  cardId,
  userId,
  role,
}: {
  cardId: string;
  userId: string;
  role: UserRole;
}) => {
  const API_URL = await getApiURL();
  const res = await fetch(`${API_URL}/api/cards/${cardId}/share`, {
    method: "POST",
    body: JSON.stringify({
      targetUserId: userId,
      targetUserRole: role,
    }),
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json",
      Cookie: `${await getAuthCookie()}${await setRequestCurrentLang()}`,
    },
  });

  if (!res.ok) {
    console.log("Add Card To User: Failed to fetch data");
    return null;
  }

  const data = JSON.parse(await res.text());
  return data;
};

export const removeFromUser = async ({
  cardId,
  userId,
  role,
}: {
  cardId: string;
  userId: string;
  role: UserRole;
}) => {
  const API_URL = await getApiURL();
  const res = await fetch(`${API_URL}/api/cards/${cardId}/share`, {
    method: "DELETE",
    body: JSON.stringify({
      targetUserId: userId,
      targetUserRole: role,
    }),
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json",
      Cookie: `${await getAuthCookie()}${await setRequestCurrentLang()}`,
    },
  });

  if (!res.ok) {
    console.log("Remove Card From User: Failed to fetch data");
    return null;
  }

  const data = JSON.parse(await res.text());
  return data;
};

export const changeLanguage = async (curLocale: string) => {
  cookies().set("NEXT_LOCALE", curLocale);
};

export const setRequestCurrentLang = async (): Promise<string> => {
  const lang = cookies().get("NEXT_LOCALE")?.value || defaultLocale;
  return `NEXT_LOCALE=${lang}; Secure; HttpOnly; SameSite=Strict;`;
};

export const getAllFriends = async (): Promise<FriendType[] | null> => {
  const API_URL = await getApiURL();
  const res = await fetch(`${API_URL}/api/users`, {
    method: "GET",
    cache: "no-cache",
    headers: {
      Cookie: `${await getAuthCookie()}${await setRequestCurrentLang()}`,
    },
  });

  if (!res.ok) {
    console.log("getAllFriends: Failed to fetch data");
    return null;
  }

  const data = JSON.parse(await res.text());
  return data;
};

export const inviteFriendViaEmail = async (formData: FormData) => {
  const rawFormData = Object.fromEntries(formData.entries());
  const validatedFields = FormInviteSchema.safeParse(rawFormData);

  if (!validatedFields.success) {
    const errors = validatedFields.error.flatten().fieldErrors;
    return {
      errors: errors,
      message: `Failed to invite friend.`,
    };
  }

  const { email, message } = validatedFields.data;
  const API_URL = await getApiURL();
  const res = await fetch(`${API_URL}/api/users/invite`, {
    method: "POST",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json",
      Cookie: `${await getAuthCookie()}${await setRequestCurrentLang()}`,
    },
    body: JSON.stringify({
      userEmail: email,
      messageText: message,
    }),
  });

  // if (!res.ok) {}

  return await res.json();
};

export const getUserRequests = async ({ type }: { type?: UserRequest }) => {
  const API_URL = await getApiURL();
  const reqType = type ?? "";
  const res = await fetch(
    `${API_URL}/api/users/requests/${reqType
      .toLocaleLowerCase()
      .replace(/ /g, "-")}`,
    {
      method: "GET",
      cache: "no-cache",
      headers: {
        Cookie: `${await getAuthCookie()}${await setRequestCurrentLang()}`,
      },
    }
  );

  if (!res.ok) {
    console.log("getUserRequests: Failed to fetch data");
    return null;
  }

  const data = JSON.parse(await res.text());
  return data?.requests;
};

export const deleteFriend = async ({ friendId }: { friendId: string }) => {
  const API_URL = await getApiURL();
  const res = await fetch(`${API_URL}/api/users/${friendId}/friendship`, {
    method: "DELETE",
    cache: "no-cache",
    headers: {
      Cookie: `${await getAuthCookie()}${await setRequestCurrentLang()}`,
    },
  });

  if (!res.ok) {
    console.log("deleteFriend: Failed to fetch data");
    return null;
  }

  const data = JSON.parse(await res.text());
  refreshPagesCache(["/friends"]);
  return data /*.user*/;
};

export const deleteFriends = async ({ friendIds }: { friendIds: string[] }) => {
  const API_URL = await getApiURL();
  console.log(`friendIds: ${friendIds}`);
  const res = await fetch(`${API_URL}/api/users/few/friendship`, {
    method: "DELETE",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json",
      Cookie: `${await getAuthCookie()}${await setRequestCurrentLang()}`,
    },
    body: JSON.stringify({
      friendIds: friendIds,
    }),
  });

  if (!res.ok) {
    console.log("deleteFriends: Failed to fetch data");
    return null;
  }

  const data = JSON.parse(await res.text());
  // refreshPagesCache(["/friends"]);
  return data /*.users*/;
};

export const approveFriendship = async ({ userId }: { userId: string }) => {
  const API_URL = await getApiURL();
  const res = await fetch(`${API_URL}/api/users/${userId}/friendship/request`, {
    method: "PUT",
    cache: "no-cache",
    headers: {
      Cookie: `${await getAuthCookie()}${await setRequestCurrentLang()}`,
    },
  });

  if (!res.ok) {
    console.log("approveFriendship: Failed to fetch data");
    return null;
  }

  const data = JSON.parse(await res.text());
  refreshPagesCache(["/friends"]);
  return data;
};

export const declineFriendship = async ({ userId }: { userId: string }) => {
  const API_URL = await getApiURL();
  const res = await fetch(`${API_URL}/api/users/${userId}/friendship/request`, {
    method: "DELETE",
    cache: "no-cache",
    headers: {
      Cookie: `${await getAuthCookie()}${await setRequestCurrentLang()}`,
    },
  });

  if (!res.ok) {
    console.log("declineFriendship: Failed to fetch data");
    return null;
  }

  const data = JSON.parse(await res.text());
  refreshPagesCache(["/friends"]);
  return data;
};
