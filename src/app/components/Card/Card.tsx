"use client";

import cardStyles from "./card.module.scss";
import ProductItem, { Product } from "@/app/components/ProductItem/ProductItem";
import Link from "next/link";
import Button, { ButtonSimple } from "@/app/components/Button/Button";
import { useState } from "react";
import Confirmation from "@/app/components/Confirmation/Confirmation";
import { useTranslation } from "react-i18next";
import { updateCard, removeCard } from "@/app/helpers/actions";
import { getErrorMessage } from "@/lib/utils";

/**
 * @property {string} id
 * @property {string} name
 * @property {string} notes (optional)
 * @property {Product[]} products (optional)
 * @property {boolean} isDone
 */
export interface ICard {
  id: string;
  name: string;
  notes?: string;
  products?: Product[];
  isDone: boolean;
}

export const hasCardType = (card: any): card is ICard => {
  return (
    typeof card === "object" &&
    card.id &&
    typeof card.id === "string" &&
    card.name &&
    typeof card.name === "string"
  );
};

const Card = ({ card }: { card: ICard }) => {
  const [cardValues, setCardValues] = useState(card);
  const [isChanged, setIsChanged] = useState<boolean | undefined>(undefined);
  const [isTooltipShown, setIsTooltipShown] = useState(false);
  const isEveryProductDone = (products: Product[] | undefined) => {
    if (!products || products?.length === 0) return false;

    return products?.find((product) => !product.got) === undefined;
  };
  const [isDone, setIsDone] = useState(
    isEveryProductDone(cardValues?.products)
  );
  const { t } = useTranslation();

  const updateProduct = (newProduct: Product) => {
    const newProductsArr: Product[] | undefined = !cardValues?.products
      ? undefined
      : cardValues.products.map((product) => {
          return product.id !== newProduct.id
            ? { ...product }
            : { ...newProduct };
        });
    const newIsDone = isEveryProductDone(newProductsArr);
    setCardValues({
      ...cardValues,
      products: newProductsArr,
      isDone: newIsDone,
    });
    setIsDone(newIsDone);
    setIsChanged(true);
  };

  const setAllProductsDone = () => {
    const newProductsArr = cardValues?.products?.map((product) => ({
      ...product,
      got: true,
    }));
    const newIsDone = isEveryProductDone(newProductsArr);
    setCardValues({
      ...cardValues,
      products: newProductsArr,
      isDone: newIsDone,
    });
    setIsDone(newIsDone);
    setIsChanged(true);
  };

  const renderedList =
    cardValues.products && cardValues.products.length > 0 ? (
      cardValues.products.map((product: Product, index) => {
        return (
          <ProductItem
            key={index}
            product={product}
            updateProduct={updateProduct}
          />
        );
      })
    ) : (
      <div className={cardStyles.cardMessage}>
        <p>{t("noProducts")}</p>
      </div>
    );

  return (
    <div className={`${cardStyles.card} ${isDone ? cardStyles.isDone : ""}`}>
      <header className={cardStyles.cardHead}>
        <h2>{card.name}</h2>
        <Link href={`${card.id}/edit-card`}>📝</Link>
        {isChanged && (
          <ButtonSimple
            children={"💾"}
            onClick={async () => {
              try {
                const resp = await updateCard(cardValues);
                setIsChanged(false);
                console.log(`Card '${cardValues.name}' is updated`, resp);
              } catch (err) {
                console.log("Saving Card failed", getErrorMessage(err));
              }
            }}
          />
        )}
        <ButtonSimple
          children={"❌"}
          onClick={() => setIsTooltipShown(!isTooltipShown)}
        />
        {isTooltipShown && (
          <Confirmation
            extraClassname={"mt-1 me-11 py-2 px-3 rounded-md text-red-600"}
            text={t("deleteTheCard?")}
            yesText={t("yes")}
            noText={t("no")}
            yesFunc={async () => {
              try {
                const resp = await removeCard(card.id);
                console.log(`Card '${card.name}' is deleted`, resp);
              } catch (err) {
                console.log("Removing failed", getErrorMessage(err));
              } finally {
                setIsTooltipShown(false);
              }
            }}
            noFunc={() => setIsTooltipShown(false)}
          />
        )}
      </header>
      {renderedList}
      {card.notes && (
        <div className={`${cardStyles.cardMessage} whitespace-pre-line`}>
          {card.notes}
        </div>
      )}
      {!isDone && (
        <footer className={cardStyles.cardFoot}>
          <Button
            children={`${t("done")}?`}
            onClick={() => setAllProductsDone()}
          />
        </footer>
      )}
    </div>
  );
};

export default Card;
