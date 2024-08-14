"use server";

import { getApiURL } from "@/app/helpers/utils-server";
import { ICard } from "@/app/components/Card/Card";
import { UserRole } from "@/app/helpers/types";
import { fixFetchHeaders } from "@/app/helpers/utils-common";

export const apiGetAllCards = async ({ headers }: { headers: HeadersInit }) => {
  const newHeaders = new Headers(headers);
  fixFetchHeaders(newHeaders);
  const API_URL = await getApiURL();
  const res = await fetch(`${API_URL}/api/cards`, {
    method: "GET",
    cache: "no-cache",
    credentials: "include",
    headers: newHeaders,
    mode: "cors",
  });

  const response = Response.json(await res.json(), {
    status: res.status,
    statusText: res.statusText,
    headers: new Headers(res.headers),
  });

  return response;
};

export const apiGetCard = async ({
  cardId,
  headers,
}: {
  cardId: string;
  headers: HeadersInit;
}) => {
  const newHeaders = new Headers(headers);
  fixFetchHeaders(newHeaders);
  const API_URL = await getApiURL();
  const res = await fetch(`${API_URL}/api/cards/${cardId}`, {
    method: "GET",
    cache: "no-cache",
    credentials: "include",
    headers: newHeaders,
    mode: "cors",
  });

  const response = Response.json(await res.json(), {
    status: res.status,
    statusText: res.statusText,
    headers: new Headers(res.headers),
  });

  return response;
};

export const apiCreateCard = async ({
  card,
  headers,
}: {
  card: ICard;
  headers: HeadersInit;
}) => {
  const newHeaders = new Headers(headers);
  fixFetchHeaders(newHeaders);
  const API_URL = await getApiURL();
  const res = await fetch(`${API_URL}/api/cards/new`, {
    method: "POST",
    cache: "no-cache",
    credentials: "include",
    headers: newHeaders,
    mode: "cors",
    body: JSON.stringify({ card }),
  });

  const response = Response.json(await res.json(), {
    status: res.status,
    statusText: res.statusText,
    headers: new Headers(res.headers),
  });

  return response;
};

export const apiUpdateCard = async ({
  card,
  headers,
}: {
  card: ICard;
  headers: HeadersInit;
}) => {
  const newHeaders = new Headers(headers);
  fixFetchHeaders(newHeaders);
  const API_URL = await getApiURL();
  const res = await fetch(`${API_URL}/api/cards/${card.id}`, {
    method: "PUT",
    cache: "no-cache",
    credentials: "include",
    headers: newHeaders,
    mode: "cors",
    body: JSON.stringify({ card }),
  });

  const response = Response.json(await res.json(), {
    status: res.status,
    statusText: res.statusText,
    headers: new Headers(res.headers),
  });

  return response;
};

export const apiRemoveCard = async ({
  cardId,
  headers,
}: {
  cardId: string;
  headers: HeadersInit;
}) => {
  const newHeaders = new Headers(headers);
  fixFetchHeaders(newHeaders);
  const API_URL = await getApiURL();
  const res = await fetch(`${API_URL}/api/cards/${cardId}`, {
    method: "DELETE",
    cache: "no-cache",
    credentials: "include",
    headers: newHeaders,
    mode: "cors",
  });

  const response = Response.json(await res.json(), {
    status: res.status,
    statusText: res.statusText,
    headers: new Headers(res.headers),
  });

  return response;
};

export const apiShareCard = async ({
  data,
  headers,
}: {
  data: {
    cardId: string;
    userId: string;
    role: UserRole;
  };
  headers: HeadersInit;
}) => {
  const newHeaders = new Headers(headers);
  fixFetchHeaders(newHeaders);
  const { cardId, userId, role } = data;
  const API_URL = await getApiURL();
  const res = await fetch(`${API_URL}/api/cards/${cardId}/share`, {
    method: "POST",
    cache: "no-cache",
    credentials: "include",
    headers: newHeaders,
    mode: "cors",
    body: JSON.stringify({
      targetUserId: userId,
      targetUserRole: role,
    }),
  });

  const response = Response.json(await res.json(), {
    status: res.status,
    statusText: res.statusText,
    headers: new Headers(res.headers),
  });

  return response;
};

export const apiStopSharingCard = async ({
  data,
  headers,
}: {
  data: {
    cardId: string;
    userId: string;
    role: UserRole;
  };
  headers: HeadersInit;
}) => {
  const newHeaders = new Headers(headers);
  fixFetchHeaders(newHeaders);
  const { cardId, userId, role } = data;
  const API_URL = await getApiURL();
  const res = await fetch(`${API_URL}/api/cards/${cardId}/share`, {
    method: "DELETE",
    cache: "no-cache",
    credentials: "include",
    headers: newHeaders,
    mode: "cors",
    body: JSON.stringify({
      targetUserId: userId,
      targetUserRole: role,
    }),
  });

  const response = Response.json(await res.json(), {
    status: res.status,
    statusText: res.statusText,
    headers: new Headers(res.headers),
  });

  return response;
};
