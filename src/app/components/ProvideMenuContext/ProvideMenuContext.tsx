"use client";

import { useState, createContext, useContext } from "react";

export interface IMenuContext {
  isMenuVisible: boolean;
  setIsMenuVisible: (isMenuVisible: boolean) => void;
}

const MenuContext = createContext<IMenuContext | null>(null);

export const menuContextErrorMessage =
  "Wrap components with <ProvideMenuContext />";

export const useMenuContext = () => {
  const menuCtx = useContext(MenuContext);
  if (!menuCtx) {
    throw Error(menuContextErrorMessage);
  }

  return menuCtx;
};

const ProvideMenuContext = ({
  children,
  opts,
}: {
  children: React.ReactNode;
  opts: Pick<IMenuContext, "isMenuVisible">;
}) => {
  const [isMenuVisible, setIsMenuVisible] = useState(opts.isMenuVisible);

  return (
    <MenuContext.Provider
      value={{
        isMenuVisible,
        setIsMenuVisible,
      }}
    >
      {children}
    </MenuContext.Provider>
  );
};

export default ProvideMenuContext;
