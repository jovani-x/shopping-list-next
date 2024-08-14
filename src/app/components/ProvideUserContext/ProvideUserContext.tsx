"use client";

import { createContext, useContext } from "react";

export interface IUserContext {
  userName: string;
}

export const UserContext = createContext<IUserContext>({
  userName: "",
});

export const useUserContext = () => {
  const userCtx = useContext(UserContext);
  if (!userCtx) {
    throw Error("Wrap components with <ProvideUserContext />");
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
