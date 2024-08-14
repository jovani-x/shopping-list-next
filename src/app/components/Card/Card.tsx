"use client";

import cardStyles from "./card.module.scss";
import { Product } from "@/app/components/ProductItem/ProductItem";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { updateCard, removeCard, addToUser } from "@/app/actions/client/cards";
import { getAllFriends } from "@/app/actions/client/friends";
import { getErrorMessage } from "@/lib/utils";
import Panel from "@/app/components/Panel/Panel";
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
import { useRouter } from "next/navigation";

import CardHeadContent from "./CardHead";
import CardBodyContent from "./CardBody";
import CardFootContent from "./CardFoot";
import CardContextProvider from "./CardContextProvider";

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
  const [cardChanges, setCardChanges] = useState(card);
  const [isChanged, setIsChanged] = useState<boolean>(false);
  const isEveryProductDone = (products: Product[] | undefined) => {
    if (!products || products?.length === 0) return false;

    return products?.find((product) => !product.got) === undefined;
  };
  const [isDone, setIsDone] = useState(
    isEveryProductDone(cardChanges?.products)
  );
  const { t } = useTranslation();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const setValues = (newProductsArr: Product[] | undefined) => {
    const newIsDone = isEveryProductDone(newProductsArr);
    setCardChanges({
      ...cardChanges,
      products: newProductsArr,
      isDone: newIsDone,
    });
    setIsDone(newIsDone);
    setIsChanged(true);
  };

  const updateProduct = (newProduct: Product) => {
    const newProductsArr: Product[] | undefined = !cardChanges?.products
      ? undefined
      : cardChanges.products.map((product) => {
          return product.id !== newProduct.id
            ? { ...product }
            : { ...newProduct };
        });
    setValues(newProductsArr);
  };

  const setAllProductsDone = () => {
    const newProductsArr = cardChanges?.products?.map((product) => ({
      ...product,
      got: true,
    }));
    setValues(newProductsArr);
  };

  const user = useUserContext();
  const userName = user?.userName ?? "";
  const isSameUser =
    !!card.status?.userName && card.status.userName === userName;
  const inProcess = card.status?.value === CardEditingStatus.IN_PROCESS;

  const [friendsWithAccess, setFriendsWithAccess] = useState<
    FriendType[] | null
  >(null);
  const [friendsWithoutAccess, setFriendsWithoutAccess] = useState<
    FriendType[] | null
  >(null);

  const shareAction = async () => {
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
  };

  const editAction = async () => {
    try {
      await updateCard({
        ...card,
        status: { value: CardEditingStatus.EDITING, userName },
      });
      router.push(`${card.id}/edit-card`);
    } catch (err) {
      console.log("Go editing Card failed", getErrorMessage(err));
    }
  };

  const shoppingAction = async () => {
    try {
      const status = !inProcess
        ? { value: CardEditingStatus.IN_PROCESS, userName }
        : { value: CardEditingStatus.FREE, userName: "" };
      await updateCard({ ...card, status });
    } catch (err) {
      console.log("Saving Card failed", getErrorMessage(err));
    }
  };

  const saveAction = async () => {
    try {
      const resp = await updateCard({
        ...cardChanges,
        status: { value: CardEditingStatus.FREE, userName: "" },
      });
      setIsChanged(false);
      console.log(`Card '${cardChanges.name}' is updated`, resp);
    } catch (err) {
      console.log("Saving Card failed", getErrorMessage(err));
    }
  };

  const deleteAction = async () => {
    try {
      const resp = await removeCard(card.id);
      console.log(`Card '${card.name}' is deleted`, resp);
    } catch (err) {
      console.log("Removing failed", getErrorMessage(err));
    }
  };

  const choiceAction = async ({ targetUserId }: { targetUserId: string }) => {
    setIsModalOpen(false);
    return await addToUser({
      cardId: card.id,
      userId: targetUserId,
      role: UserRole.buyer,
    });
  };

  useEffect(() => {
    setCardChanges(card);
    setIsDone(isEveryProductDone(card?.products));
  }, [card]);

  return (
    <>
      <CardContextProvider
        value={{
          card,
          cardChanges,
          setCardChanges,
          isChanged,
          setIsChanged,
          isDone,
          setIsDone,
          shareAction,
          editAction,
          shoppingAction,
          saveAction,
          deleteAction,
          setAllProductsDone,
          updateProduct,
        }}
      >
        <Panel
          headContent={<CardHeadContent />}
          bodyContent={<CardBodyContent />}
          footContent={
            !isDone && inProcess && isSameUser && <CardFootContent />
          }
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
            confirmFun={choiceAction}
            confirmBtnText={t("share")}
            cancelFun={() => setIsModalOpen(false)}
            cancelBtnText={t("cancel")}
            formId={`${card.id}__form`}
            friends={friendsWithoutAccess}
          />
        </Modal>
      </CardContextProvider>
    </>
  );
};

export default Card;
