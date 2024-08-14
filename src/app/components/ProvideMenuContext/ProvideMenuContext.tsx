"use client";

import { useState, createContext, useContext } from "react";

export interface IMenuContext {
  isMenuVisible: boolean;
  setIsMenuVisible: (isMenuVisible: boolean) => void;
}

const MenuContext = createContext<IMenuContext>({
  isMenuVisible: false,
  setIsMenuVisible: () => null,
});

export const useMenuContext = () => {
  const menuCtx = useContext(MenuContext);
  if (!menuCtx) {
    throw Error("Wrap components with <ProvideMenuContext />");
  }

  return menuCtx;
};

const ProvideMenuContext = ({
  children,
  opts,
}: {
  children: React.ReactNode;
  opts?: Pick<IMenuContext, "isMenuVisible">;
}) => {
  const [isMenuVisible, setIsMenuVisible] = useState(
    opts?.isMenuVisible ?? false
  );

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
