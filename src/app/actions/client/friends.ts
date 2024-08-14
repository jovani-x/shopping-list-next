"use server";

import { getBaseURL, refreshPagesCache } from "@/app/helpers/utils-common";
import { getAuthCookie } from "@/app/helpers/auth";
import { FriendType, UserRequest } from "@/app/helpers/types";
import { FormInviteSchema } from "@/app/helpers/schemas";
import { getCurrentLangCookie } from "@/app/helpers/language";
import { transformEnumTypeValue } from "@/lib/utils";

export const getAllFriends = async (): Promise<FriendType[] | null> => {
  const BASE_URL = await getBaseURL();
  const res = await fetch(`${BASE_URL}/api/friends`, {
    method: "GET",
    cache: "no-cache",
    credentials: "include",
    mode: "cors",
    headers: {
      Cookie: `${await getAuthCookie()}${await getCurrentLangCookie()}`,
      Accept: "*/*",
    },
  });

  if (!res.ok) {
    console.log("getAllFriends: Failed to fetch data");
    return null;
  }

  const data = await res.json();
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
  const BASE_URL = await getBaseURL();
  const res = await fetch(`${BASE_URL}/api/friends/invite`, {
    method: "POST",
    cache: "no-cache",
    credentials: "include",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
      Cookie: `${await getAuthCookie()}${await getCurrentLangCookie()}`,
      Accept: "*/*",
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
  const BASE_URL = await getBaseURL();
  const reqType = !type ? "" : transformEnumTypeValue(type);
  const res = await fetch(`${BASE_URL}/api/friends/requests/${reqType}`, {
    method: "GET",
    cache: "no-cache",
    credentials: "include",
    mode: "cors",
    headers: {
      Cookie: `${await getAuthCookie()}${await getCurrentLangCookie()}`,
      Accept: "*/*",
    },
  });

  if (!res.ok) {
    console.log("getUserRequests: Failed to fetch data");
    return null;
  }

  const data = await res.json();
  return data?.requests;
};

export const deleteFriend = async ({ friendId }: { friendId: string }) => {
  const BASE_URL = await getBaseURL();
  const res = await fetch(`${BASE_URL}/api/friends/${friendId}`, {
    method: "DELETE",
    cache: "no-cache",
    credentials: "include",
    mode: "cors",
    headers: {
      Cookie: `${await getAuthCookie()}${await getCurrentLangCookie()}`,
      Accept: "*/*",
    },
  });

  if (!res.ok) {
    console.log("deleteFriend: Failed to fetch data");
    return null;
  }

  const data = await res.json();
  refreshPagesCache(["/friends"]);
  return data;
};

export const deleteFriends = async ({ friendIds }: { friendIds: string[] }) => {
  const BASE_URL = await getBaseURL();
  const res = await fetch(`${BASE_URL}/api/friends`, {
    method: "DELETE",
    cache: "no-cache",
    credentials: "include",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
      Cookie: `${await getAuthCookie()}${await getCurrentLangCookie()}`,
      Accept: "*/*",
    },
    body: JSON.stringify({ friendIds }),
  });

  if (!res.ok) {
    console.log("deleteFriends: Failed to fetch data");
    return null;
  }

  const data = await res.json();
  // refreshPagesCache(["/friends"]);
  return data;
};

export const approveFriendship = async ({ userId }: { userId: string }) => {
  const BASE_URL = await getBaseURL();
  const res = await fetch(`${BASE_URL}/api/friends/${userId}/become-friend`, {
    method: "PUT",
    cache: "no-cache",
    credentials: "include",
    mode: "cors",
    headers: {
      Cookie: `${await getAuthCookie()}${await getCurrentLangCookie()}`,
      Accept: "*/*",
    },
  });

  if (!res.ok) {
    console.log("approveFriendship: Failed to fetch data");
    return null;
  }

  const data = await res.json();
  refreshPagesCache(["/friends"]);
  return data;
};

export const declineFriendship = async ({ userId }: { userId: string }) => {
  const BASE_URL = await getBaseURL();
  const res = await fetch(`${BASE_URL}/api/friends/${userId}/become-friend`, {
    method: "DELETE",
    cache: "no-cache",
    credentials: "include",
    mode: "cors",
    headers: {
      Cookie: `${await getAuthCookie()}${await getCurrentLangCookie()}`,
      Accept: "*/*",
    },
  });

  if (!res.ok) {
    console.log("declineFriendship: Failed to fetch data");
    return null;
  }

  const data = await res.json();
  refreshPagesCache(["/friends"]);
  return data;
};
