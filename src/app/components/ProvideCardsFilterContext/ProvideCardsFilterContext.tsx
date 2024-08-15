"use client";

import { useState, createContext, useContext } from "react";
import { IFilter } from "@/app/helpers/types";

export const CardsFilterContext = createContext<IFilter | null>(null);

export const cardsFilterContextErrorMessage =
  "Wrap components with <ProvideCardsFilterContext />";

const ProvideCardsFilterContext = ({
  children,
  value,
}: {
  children: React.ReactNode;
  value: Pick<IFilter, "filterState">;
}) => {
  const [filterState, setFilterState] = useState(value.filterState);

  return (
    <CardsFilterContext.Provider value={{ filterState, setFilterState }}>
      {children}
    </CardsFilterContext.Provider>
  );
};

export default ProvideCardsFilterContext;

export function useCardsFilterContext() {
  const cardsFilterContext = useContext(CardsFilterContext);
  if (!cardsFilterContext) {
    throw Error(cardsFilterContextErrorMessage);
  }
  return cardsFilterContext;
}
