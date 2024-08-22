"use client";

import Card, { ICard } from "@/app/components/Card/Card";
import CardFilter from "@/app/components/CardFilter/CardFilter";
import { useCardsFilterContext } from "@/app/components/ProvideCardsFilterContext/ProvideCardsFilterContext";
import { useTranslation } from "react-i18next";
import { useStreamListener } from "@/app/helpers/listener";

const Cards = ({ cardsProps }: { cardsProps: ICard[] }) => {
  const { filterState, setFilterState } = useCardsFilterContext();
  const { t } = useTranslation();
  const cards = useStreamListener({
    dataProps: cardsProps,
    dataName: "cards",
    eventName: "cardsupdate",
  }) as ICard[];

  const renderedCards =
    !cards || !cards.length
      ? null
      : cards.map((card: ICard) => {
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
