"use client";

import { createContext, useContext } from "react";

export interface IUserContext {
  userName: string;
}

export const UserContext = createContext<IUserContext | null>(null);

export const userContextErrorMessage =
  "Wrap components with <ProvideUserContext />";

export const useUserContext = () => {
  const userCtx = useContext(UserContext);
  if (!userCtx) {
    throw Error(userContextErrorMessage);
  }

  return userCtx;
};

const ProvideUserContext = ({
  children,
  value,
}: {
  children: React.ReactNode;
  value: IUserContext;
}) => {
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export default ProvideUserContext;
