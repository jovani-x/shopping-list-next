import { type ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { cookies } from "next/headers";
import { AuthUser } from "@/app/helpers/types";

export const getCookieTemplateObject = async (
  cookieName: string
): Promise<ResponseCookie> => ({
  name: cookieName,
  value: "",
  httpOnly: true,
  secure: true,
  sameSite: "strict",
  maxAge: 0,
});

export const getApiURL = async () =>
  process.env.VITE_API_URL || "http://localhost:3001";

export const getAuthTokenName = async () =>
  process.env.VITE_JWT_NAME || "authToken";

export const getAuthToken = async () => {
  const tokenName = await getAuthTokenName();
  const authCookies = cookies().get(tokenName);
  return authCookies?.value || "";
};

export const getAuthCookie = async () => {
  const tokenName = await getAuthTokenName();
  const authToken = await getAuthToken();
  return `${tokenName}=${authToken}; Secure; HttpOnly; SameSite=Strict;`;
};

export const decodeToken = async (
  encodedToken: string | null
): Promise<AuthUser> => {
  try {
    if (!encodedToken) {
      return {
        userName: null,
        userId: null,
        accessToken: null,
      };
    }

    return {
      ...JSON.parse(atob(atob(encodedToken).split(".")[1])),
      accessToken: encodedToken,
    };
  } catch (err) {
    return {
      userName: null,
      userId: null,
      accessToken: null,
    };
  }
};

export const getCurrentUser = async (
  encodedToken: string | null
): Promise<AuthUser> => await decodeToken(encodedToken);
