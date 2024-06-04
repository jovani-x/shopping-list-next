"use client";

import { useState, createContext } from "react";

export interface IMenuContext {
  isMenuVisible: boolean;
  setIsMenuVisible: (isMenuVisible: boolean) => void;
}

export const MenuContext = createContext<IMenuContext>({
  isMenuVisible: false,
  setIsMenuVisible: () => null,
});

const ProvideMenuContext = ({
  children,
  opts,
}: {
  children: React.ReactNode;
  opts?: IMenuContext;
}) => {
  const [isMenuVisible, setIsMenuVisible] = useState(
    opts ? opts.isMenuVisible : false
  );

  const value = opts
    ? opts
    : {
        isMenuVisible,
        setIsMenuVisible,
      };

  return <MenuContext.Provider value={value}>{children}</MenuContext.Provider>;
};

export default ProvideMenuContext;
