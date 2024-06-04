"use client";

import Card, { ICard } from "@/app/components/Card/Card";
import CardFilter from "@/app/components/CardFilter/CardFilter";
import { useCardsFilterContext } from "@/app/components/ProvideCardsFilterContext/ProvideCardsFilterContext";

const Cards = ({ cards }: { cards: ICard[] }) => {
  const { filterState, setFilterState } = useCardsFilterContext();

  const renderedCards = !cards?.length ? (
    <></>
  ) : (
    cards.map((card: ICard) => {
      const isDone =
        card?.products?.find((product) => !product.got) === undefined;
      const isShown =
        (isDone && filterState.done) || (!isDone && filterState.unfinished);
      return isShown && <Card key={card.id} card={card} />;
    })
  );

  return (
    <>
      <CardFilter filterState={filterState} setFilterState={setFilterState} />
      {renderedCards}
    </>
  );
};

export default Cards;
