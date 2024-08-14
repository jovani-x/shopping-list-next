"use server";

import { getApiURL } from "@/app/helpers/utils-server";
import { UserRequest } from "@/app/helpers/types";
import { fixFetchHeaders } from "@/app/helpers/utils-common";
import { transformEnumTypeValue } from "@/lib/utils";

export const apiGetAllFriends = async ({
  headers,
}: {
  headers: HeadersInit;
}) => {
  const newHeaders = new Headers(headers);
  fixFetchHeaders(newHeaders);
  const API_URL = await getApiURL();
  const res = await fetch(`${API_URL}/api/users`, {
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

export const apiInviteFriendViaEmail = async ({
  data,
  headers,
}: {
  data: { userEmail: string; messageText: string };
  headers: HeadersInit;
}) => {
  const newHeaders = new Headers(headers);
  fixFetchHeaders(newHeaders);
  const API_URL = await getApiURL();
  const res = await fetch(`${API_URL}/api/users/invite`, {
    method: "POST",
    cache: "no-cache",
    credentials: "include",
    headers: newHeaders,
    mode: "cors",
    body: JSON.stringify({ ...data }),
  });

  const response = Response.json(await res.json(), {
    status: res.status,
    statusText: res.statusText,
    headers: new Headers(res.headers),
  });

  return response;
};

export const apiGetUserRequests = async ({
  type,
  headers,
}: {
  type?: UserRequest;
  headers: HeadersInit;
}) => {
  const newHeaders = new Headers(headers);
  fixFetchHeaders(newHeaders);
  const API_URL = await getApiURL();
  const reqType = !type ? "" : transformEnumTypeValue(type);
  const res = await fetch(`${API_URL}/api/users/requests/${reqType}`, {
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

export const apiDeleteFriend = async ({
  friendId,
  headers,
}: {
  friendId: string;
  headers: HeadersInit;
}) => {
  const newHeaders = new Headers(headers);
  fixFetchHeaders(newHeaders);
  const API_URL = await getApiURL();
  const res = await fetch(`${API_URL}/api/users/${friendId}/friendship`, {
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

export const apiDeleteFriends = async ({
  friendIds,
  headers,
}: {
  friendIds: string[];
  headers: HeadersInit;
}) => {
  const newHeaders = new Headers(headers);
  fixFetchHeaders(newHeaders);
  const API_URL = await getApiURL();
  const res = await fetch(`${API_URL}/api/users/few/friendship`, {
    method: "DELETE",
    cache: "no-cache",
    credentials: "include",
    headers: newHeaders,
    mode: "cors",
    body: JSON.stringify({
      friendIds: friendIds,
    }),
  });

  const response = Response.json(await res.json(), {
    status: res.status,
    statusText: res.statusText,
    headers: new Headers(res.headers),
  });

  return response;
};

export const apiApproveFriendship = async ({
  userId,
  headers,
}: {
  userId: string;
  headers: HeadersInit;
}) => {
  const newHeaders = new Headers(headers);
  fixFetchHeaders(newHeaders);
  const API_URL = await getApiURL();
  const res = await fetch(`${API_URL}/api/users/${userId}/friendship/request`, {
    method: "PUT",
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

export const apiDeclineFriendship = async ({
  userId,
  headers,
}: {
  userId: string;
  headers: HeadersInit;
}) => {
  const newHeaders = new Headers(headers);
  fixFetchHeaders(newHeaders);
  const API_URL = await getApiURL();
  const res = await fetch(`${API_URL}/api/users/${userId}/friendship/request`, {
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
