"use client";

import { useState, createContext, useContext } from "react";
import { IFilter } from "@/app/helpers/types";

export const CardsFilterContext = createContext<IFilter>({
  filterState: { unfinished: false, done: false },
  setFilterState: () => null,
});

const ProvideCardsFilterContext = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [filterState, setFilterState] = useState({
    unfinished: true,
    done: true,
  });

  return (
    <CardsFilterContext.Provider value={{ filterState, setFilterState }}>
      {children}
    </CardsFilterContext.Provider>
  );
};

export default ProvideCardsFilterContext;

export function useCardsFilterContext() {
  return useContext(CardsFilterContext);
}
