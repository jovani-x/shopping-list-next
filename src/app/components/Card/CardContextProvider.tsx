"use client";

import { createContext, useContext } from "react";
import { ICard } from "./Card";
import { Product } from "@/app/components/ProductItem/ProductItem";

interface CardState {
  card: ICard;
  cardChanges: ICard;
  isChanged: boolean;
  isDone: boolean;
}

interface CardActions {
  setCardChanges: (cardChanges: ICard) => void;
  setIsChanged: (isChanged: boolean) => void;
  setIsDone: (isDone: boolean) => void;

  shareAction: () => void;
  editAction: () => void;
  shoppingAction: () => void;
  saveAction: () => void;
  deleteAction: () => void;
  setAllProductsDone: () => void;
  updateProduct: (newProduct: Product) => void;
}

type CardContextType = CardState & CardActions;

const CardContext = createContext<CardContextType | null>(null);

export const cardContextErrorMessage =
  "Wrap components with <CardContextProvider />";

export const useCardContext = () => {
  const cardCtx = useContext(CardContext);
  if (!cardCtx) {
    throw Error(cardContextErrorMessage);
  }

  return cardCtx;
};

const CardContextProvider = ({
  children,
  value,
}: {
  children: React.ReactNode;
  value: CardContextType;
}) => <CardContext.Provider value={value}>{children}</CardContext.Provider>;

export default CardContextProvider;
