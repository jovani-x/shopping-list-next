import { cookies } from "next/headers";
import { AuthUser } from "@/app/helpers/types";
import { getCookieTemplateObject } from "@/lib/utils";

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

export const getAuthTokenName = async () =>
  process.env.VITE_JWT_NAME || "authToken";

export const getAuthToken = async () => {
  const tokenName = await getAuthTokenName();
  const authCookies = cookies().get(tokenName);
  return authCookies?.value || "";
};

export const getAuthCookie = async () => {
  const tokenName = await getAuthTokenName();
  const value = cookies().get(tokenName)?.value;

  if (value?.length) {
    return `${tokenName}=${value}; Secure; HttpOnly; SameSite=None;`;
  } else {
    return "";
  }
};

export const getAuthCookieFull = async (
  headers: Headers
): Promise<string[]> => {
  const tokenName = await getAuthTokenName();
  const getResCookies = headers.getSetCookie();

  return getResCookies.filter(
    (c) => c.indexOf(`${tokenName}=`) === 0 && c.indexOf(`${tokenName}=;`) < 0
  );
};

export const setAuthCookie = async ({
  authCookieString,
}: {
  authCookieString: string;
}) => {
  const tokenName = await getAuthTokenName();
  const cookiePartsArray = authCookieString.split(";");
  const cookieOpts = await getCookieTemplateObject(tokenName);
  cookiePartsArray.map((el) => {
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

  if (cookieOpts.value.length) {
    const { name, value, ...cookieProps } = cookieOpts;
    cookies().set(name, value, cookieProps);
  }

  return cookieOpts;
};
