"use client";

import Card, { ICard } from "@/app/components/Card/Card";
import CardFilter from "@/app/components/CardFilter/CardFilter";
import { useCardsFilterContext } from "@/app/components/ProvideCardsFilterContext/ProvideCardsFilterContext";
import { useTranslation } from "react-i18next";

const Cards = ({ cards }: { cards: ICard[] }) => {
  const { filterState, setFilterState } = useCardsFilterContext();
  const { t } = useTranslation();

  const renderedCards = cards.map((card: ICard) => {
    const isDone =
      card?.products?.find((product) => !product.got) === undefined;
    const isShown =
      (isDone && filterState.done) || (!isDone && filterState.unfinished);
    return isShown && <Card key={card.id} card={card} />;
  });

  return !cards?.length ? (
    <h2 className="mb-2">{t("noCards")}</h2>
  ) : (
    <>
      <CardFilter filterState={filterState} setFilterState={setFilterState} />
      {renderedCards}
    </>
  );
};

export default Cards;
