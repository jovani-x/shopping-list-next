"use client";

import cardStyles from "./card.module.scss";
import { CardEditingStatus } from "@/app/helpers/types";
import ProductList from "@/app/components/ProductList/ProductList";
import EditingStatus from "@/app/components/EditingStatus/EditingStatus";
import { useUserContext } from "@/app/components/ProvideUserContext/ProvideUserContext";
import { useCardContext } from "./CardContextProvider";

const CardBodyContent = () => {
  const user = useUserContext();
  const userName = user?.userName ?? "";
  const { card, cardChanges, updateProduct } = useCardContext();
  const inProcess = card.status?.value === CardEditingStatus.IN_PROCESS;
  const isSameUser =
    !!card.status?.userName && card.status.userName === userName;

  return (
    <>
      {card?.status && <EditingStatus status={card.status} />}
      <ProductList
        products={cardChanges?.products}
        updateProduct={updateProduct}
        canBeChecked={inProcess && isSameUser}
      />
      {card.notes && (
        <div className={`${cardStyles.cardMessage} whitespace-pre-line`}>
          {card.notes}
        </div>
      )}
    </>
  );
};

export default CardBodyContent;
