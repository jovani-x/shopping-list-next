"use client";

import cardStyles from "./card.module.scss";
import ProductItem, { Product } from "@/app/components/ProductItem/ProductItem";
import Button, { ButtonSimple } from "@/app/components/Button/Button";
import { useEffect, useState } from "react";
import Confirmation from "@/app/components/Confirmation/Confirmation";
import { useTranslation } from "react-i18next";
import {
  updateCard,
  removeCard,
  getAllFriends,
  addToUser,
} from "@/app/helpers/actions";
import { getErrorMessage } from "@/lib/utils";
import Panel from "@/app/components/Panel/Panel";
import Share from "@/app/components/Share/Share";
import Modal from "@/app/components/Modal/Modal";
import FriendsChoiceForm from "@/app/components/FriendsChoiceForm/FriendsChoiceForm";
import CardAccessList from "@/app/components/CardAccessList/CardAccessList";
import {
  FriendType,
  UserRole,
  CardEditingStatus,
  EditingStatusType,
} from "@/app/helpers/types";
import { useUserContext } from "@/app/components/ProvideUserContext/ProvideUserContext";
import EditingStatus from "@/app/components/EditingStatus/EditingStatus";
import { useRouter } from "next/navigation";

/**
 * @property {string} id
 * @property {string} name
 * @property {string} notes (optional)
 * @property {Product[]} products (optional)
 * @property {boolean} isDone
 * @property {UserRole} userRole
 * @property {EditingStatusType} status (optional)
 */
export interface ICard {
  id: string;
  name: string;
  notes?: string;
  products?: Product[];
  isDone: boolean;
  userRole?: UserRole;
  status?: EditingStatusType;
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
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const user = useUserContext();
  const userName = user?.userName ?? "";
  const isFreeForActions =
    card.status?.value === CardEditingStatus.FREE ||
    card.status?.value === undefined;
  const inProcess = card.status?.value === CardEditingStatus.IN_PROCESS;
  const isBeingEdited = card.status?.value === CardEditingStatus.EDITING;
  const isSameUser =
    !!card.status?.userName && card.status.userName === userName;
  const isOwner = card.userRole === UserRole.owner;
  const isShareAllowed = isOwner;
  const isEditAllowed =
    isOwner && (isFreeForActions || (isBeingEdited && isSameUser));
  const isShoppingAllowed =
    !isDone && (isFreeForActions || (inProcess && isSameUser));
  const isSaveAllowed = isChanged && inProcess && isSameUser;
  const isDeleteAllowed = isOwner && isFreeForActions;

  const renderedList =
    cardValues.products && cardValues.products.length > 0 ? (
      cardValues.products.map((product: Product) => {
        return (
          <ProductItem
            key={product.id}
            product={product}
            updateProduct={updateProduct}
            canBeChecked={inProcess && isSameUser}
          />
        );
      })
    ) : (
      <div className={cardStyles.cardMessage}>
        <p>{t("noProducts")}</p>
      </div>
    );

  const [friendsWithAccess, setFriendsWithAccess] = useState<
    FriendType[] | null
  >(null);
  const [friendsWithoutAccess, setFriendsWithoutAccess] = useState<
    FriendType[] | null
  >(null);

  const headContent = () => (
    <>
      <h2>{card.name}</h2>
      {isShareAllowed && (
        <Share
          onClick={async () => {
            const allFriends = await getAllFriends();
            const frWithoutAccess: FriendType[] | null = [];
            const frWithAccess: FriendType[] | null = [];

            allFriends?.map((fr) => {
              if (fr?.cards.find((c) => c.cardId === card.id)) {
                frWithAccess.push({ ...fr });
              } else {
                frWithoutAccess.push({ ...fr });
              }
            });
            setFriendsWithAccess([...frWithAccess]);
            setFriendsWithoutAccess([...frWithoutAccess]);
            setIsModalOpen(true);
          }}
        />
      )}
      {isEditAllowed && (
        <ButtonSimple
          onClick={async () => {
            try {
              await updateCard({
                ...card,
                status: { value: CardEditingStatus.EDITING, userName },
              });
              router.push(`${card.id}/edit-card`);
            } catch (err) {
              console.log("Go editing Card failed", getErrorMessage(err));
            }
          }}
        >
          📝
        </ButtonSimple>
      )}
      {isShoppingAllowed && (
        <ButtonSimple
          onClick={async () => {
            try {
              const status = !inProcess
                ? { value: CardEditingStatus.IN_PROCESS, userName }
                : { value: CardEditingStatus.FREE, userName: "" };
              await updateCard({ ...card, status });
            } catch (err) {
              console.log("Saving Card failed", getErrorMessage(err));
            }
          }}
        >
          {"🛒"}
        </ButtonSimple>
      )}
      {isSaveAllowed && (
        <ButtonSimple
          onClick={async () => {
            try {
              const resp = await updateCard({
                ...cardValues,
                status: { value: CardEditingStatus.FREE, userName: "" },
              });
              setIsChanged(false);
              console.log(`Card '${cardValues.name}' is updated`, resp);
            } catch (err) {
              console.log("Saving Card failed", getErrorMessage(err));
            }
          }}
        >
          {"💾"}
        </ButtonSimple>
      )}
      {isDeleteAllowed && (
        <ButtonSimple onClick={() => setIsTooltipShown(!isTooltipShown)}>
          {"❌"}
        </ButtonSimple>
      )}
      {isDeleteAllowed && isTooltipShown && (
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
    </>
  );

  const bodyContent = () => (
    <>
      {card?.status && <EditingStatus status={card.status} />}
      {renderedList}
      {card.notes && (
        <div className={`${cardStyles.cardMessage} whitespace-pre-line`}>
          {card.notes}
        </div>
      )}
    </>
  );

  const footContent = () =>
    !isDone &&
    inProcess &&
    isSameUser && (
      <>
        <footer className={cardStyles.cardFoot}>
          <Button onClick={() => setAllProductsDone()}>{`${t(
            "done"
          )}?`}</Button>
        </footer>
      </>
    );

  useEffect(() => {
    setCardValues(card);
    setIsDone(isEveryProductDone(card?.products));
  }, [card]);

  return (
    <>
      <Panel
        headContent={headContent()}
        bodyContent={bodyContent()}
        footContent={footContent()}
        bodyWithOffset={false}
        extraClassname={isDone ? cardStyles.isDone : ""}
      />
      <Modal
        isOpen={isModalOpen}
        setOpened={setIsModalOpen}
        title={t("shareCardWith", { name: card.name })}
      >
        <CardAccessList users={friendsWithAccess} cardId={card.id} />
        <h4>{`${t("grantAccess")}:`}</h4>
        <FriendsChoiceForm
          confirmFun={async ({ targetUserId }: { targetUserId: string }) => {
            setIsModalOpen(false);
            return await addToUser({
              cardId: card.id,
              userId: targetUserId,
              role: UserRole.buyer,
            });
          }}
          confirmBtnText={t("share")}
          cancelFun={() => setIsModalOpen(false)}
          cancelBtnText={t("cancel")}
          formId={`${card.id}__form`}
          friends={friendsWithoutAccess}
        />
      </Modal>
    </>
  );
};

export default Card;
