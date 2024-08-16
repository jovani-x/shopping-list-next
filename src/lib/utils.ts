import { type ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { SelectedType } from "@/app/helpers/types";

type ErrorWithMessage = {
  message: string;
};

const isErrorWithMessage = (error: unknown): error is ErrorWithMessage => {
  return (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as Record<string, unknown>).message === "string"
  );
};

const toErrorWithMessage = (maybeError: unknown): ErrorWithMessage => {
  if (isErrorWithMessage(maybeError)) return maybeError;

  if (typeof maybeError === "string") return { message: maybeError };

  try {
    return new Error(JSON.stringify(maybeError));
  } catch {
    // fallback in case there's an error stringifying the maybeError
    // like with circular references for example.
    return new Error(String(maybeError));
  }
};

export const getErrorMessage = (error: unknown) => {
  return toErrorWithMessage(error).message;
};

export const getCookieTemplateObject = async (
  cookieName: string
): Promise<ResponseCookie> => ({
  name: cookieName,
  value: "",
  httpOnly: true,
  secure: true,
  sameSite: "none",
  maxAge: 0,
});

export const getEnumTypeEntityByValue = ({
  EnumType,
  targetValue,
  withTransform = false,
}: {
  EnumType: any;
  targetValue: any;
  withTransform?: boolean;
}) => {
  if (targetValue === undefined || targetValue === null) return undefined;

  const tmpKeyStr = Object.entries(EnumType).filter(([_key, value]) =>
    withTransform && typeof value === "string"
      ? transformEnumTypeValue(value) === targetValue
      : value === targetValue
  );
  const keyStr = tmpKeyStr.length === 0 ? undefined : tmpKeyStr[0][0];

  if (!keyStr) return undefined;

  const valueStr = EnumType[keyStr as keyof typeof EnumType];

  return {
    key: keyStr,
    value: valueStr,
  };
};

export const transformEnumTypeValue = (value: string) =>
  value.toLocaleLowerCase().replace(/ /g, "-");

export const getKeysByTrueValue = (entities: SelectedType) =>
  Object.keys(entities).filter((key) => entities[key]);
