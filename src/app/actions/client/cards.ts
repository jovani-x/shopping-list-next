"use server";

import { getBaseURL, refreshPagesCache } from "@/app/helpers/utils-common";
import { getAuthCookie } from "@/app/helpers/auth";
import { getCurrentLangCookie } from "@/app/helpers/language";
import { CardSchema } from "@/app/helpers/schemas";
import { ICard } from "@/components/Card/Card";
import { UserRole } from "@/app/helpers/types";

export const getAllCards = async () => {
  const BASE_URL = await getBaseURL();
  const res = await fetch(`${BASE_URL}/api/cards`, {
    method: "GET",
    cache: "no-cache",
    credentials: "include",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
      Cookie: `${await getAuthCookie()}${await getCurrentLangCookie()}`,
      Accept: "*/*",
    },
  });

  if (!res.ok) {
    console.log("getAllCards: Failed to fetch data");
    return null;
  }

  return await res.json();
};

export const getCard = async (cardId: string) => {
  const BASE_URL = await getBaseURL();
  const res = await fetch(`${BASE_URL}/api/cards/${cardId}`, {
    method: "GET",
    cache: "no-cache",
    credentials: "include",
    mode: "cors",
    headers: {
      Cookie: `${await getAuthCookie()}${await getCurrentLangCookie()}`,
    },
  });

  if (!res.ok) {
    console.log(`getCard #${cardId}: Failed to fetch data`);
    return null;
  }

  const data = await res.json();
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
  const BASE_URL = await getBaseURL();
  const res = await fetch(`${BASE_URL}/api/cards/create-card`, {
    method: "POST",
    cache: "no-cache",
    credentials: "include",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
      Cookie: `${await getAuthCookie()}${await getCurrentLangCookie()}`,
    },
    body: JSON.stringify({ card: cardObj }),
  });

  if (!res.ok) {
    console.log("createCard: Failed to fetch data");
    return null;
  }

  const data = await res.json();
  // refreshPagesCache(["/", `/${data.card.id}`]);
  return data;
};

export const updateCard = async (cardValues: ICard) => {
  const validatedFields = CardSchema.safeParse(cardValues);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Failed to updateCard.",
    };
  }

  const { id, ...cardObj } = validatedFields.data;
  const BASE_URL = await getBaseURL();
  const res = await fetch(`${BASE_URL}/api/cards/${id}`, {
    method: "PUT",
    cache: "no-cache",
    credentials: "include",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
      Cookie: `${await getAuthCookie()}${await getCurrentLangCookie()}`,
    },
    body: JSON.stringify({ card: { id, ...cardObj } }),
  });

  if (!res.ok) {
    console.log("updateCard: Failed to fetch data");
    return null;
  }

  const data = await res.json();
  // refreshPagesCache(["/", `/${data.card.id}`]);
  return data;
};

export const removeCard = async (cardId: string) => {
  const BASE_URL = await getBaseURL();
  const res = await fetch(`${BASE_URL}/api/cards/${cardId}`, {
    method: "DELETE",
    cache: "no-cache",
    credentials: "include",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
      Cookie: `${await getAuthCookie()}${await getCurrentLangCookie()}`,
    },
  });

  if (!res.ok) {
    console.log("removeCard: Failed to fetch data");
    return null;
  }

  const data = await res.json();
  refreshPagesCache(["/", `/${data.card.id}`]);
  return data;
};

// sharing card with user
export const addToUser = async ({
  cardId,
  userId,
  role,
}: {
  cardId: string;
  userId: string;
  role: UserRole;
}) => {
  const BASE_URL = await getBaseURL();
  const res = await fetch(`${BASE_URL}/api/cards/${cardId}/share`, {
    method: "POST",
    cache: "no-cache",
    credentials: "include",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
      Cookie: `${await getAuthCookie()}${await getCurrentLangCookie()}`,
    },
    body: JSON.stringify({
      userId,
      role,
    }),
  });

  if (!res.ok) {
    console.log("Add Card To User: Failed to fetch data");
    return null;
  }

  const data = await res.json();
  return data;
};

// stop sharing card with user
export const removeFromUser = async ({
  cardId,
  userId,
  role,
}: {
  cardId: string;
  userId: string;
  role: UserRole;
}) => {
  const BASE_URL = await getBaseURL();
  const res = await fetch(`${BASE_URL}/api/cards/${cardId}/share`, {
    method: "DELETE",
    cache: "no-cache",
    credentials: "include",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
      Cookie: `${await getAuthCookie()}${await getCurrentLangCookie()}`,
    },
    body: JSON.stringify({
      userId,
      role,
    }),
  });

  if (!res.ok) {
    console.log("Remove Card From User: Failed to fetch data");
    return null;
  }

  const data = await res.json();
  return data;
};
