"use server";

import { getApiURL } from "@/app/helpers/utils-server";
import { fixFetchHeaders } from "@/app/helpers/utils-common";

export const authenticate = async ({
  userName,
  password,
  headers,
}: {
  userName: string;
  password: string;
  headers: HeadersInit;
}) => {
  const newHeaders = new Headers(headers);
  fixFetchHeaders(newHeaders);
  const API_URL = await getApiURL();
  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    mode: "cors",
    credentials: "include",
    headers: newHeaders,
    body: JSON.stringify({ userName, password }),
  });

  const response = Response.json(await res.json(), {
    status: res.status,
    statusText: res.statusText,
    headers: new Headers(res.headers),
  });

  return response;
};

export const signout = async ({ headers }: { headers: HeadersInit }) => {
  const newHeaders = new Headers(headers);
  fixFetchHeaders(newHeaders);
  const API_URL = await getApiURL();
  const res = await fetch(`${API_URL}/api/auth/logout`, {
    method: "POST",
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

export const createUser = async ({
  user,
  headers,
}: {
  user: {
    userName: string;
    email: string;
    password: string;
    confirmPassword: string;
  };
  headers: HeadersInit;
}) => {
  const newHeaders = new Headers(headers);
  fixFetchHeaders(newHeaders);
  const API_URL = await getApiURL();
  const res = await fetch(`${API_URL}/api/auth/register`, {
    method: "POST",
    cache: "no-cache",
    credentials: "include",
    headers: newHeaders,
    mode: "cors",
    body: JSON.stringify({ user }),
  });

  const response = Response.json(await res.json(), {
    status: res.status,
    statusText: res.statusText,
    headers: new Headers(res.headers),
  });

  return response;
};

export const restoreAccess = async ({
  email,
  headers,
}: {
  email: string;
  headers: HeadersInit;
}) => {
  const newHeaders = new Headers(headers);
  fixFetchHeaders(newHeaders);
  const API_URL = await getApiURL();
  const res = await fetch(`${API_URL}/api/auth/forget`, {
    method: "POST",
    cache: "no-cache",
    credentials: "include",
    headers: newHeaders,
    mode: "cors",
    body: JSON.stringify({ email }),
  });

  const response = Response.json(await res.json(), {
    status: res.status,
    statusText: res.statusText,
    headers: new Headers(res.headers),
  });

  return response;
};
