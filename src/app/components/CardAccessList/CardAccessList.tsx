"use client";

import { FriendType } from "@/app/helpers/types";
import { useTranslation } from "react-i18next";
import listStyles from "./cardAccessList.module.scss";

const CardAccessList = ({
  users,
  cardId,
}: {
  users: FriendType[] | null;
  cardId: string;
}) => {
  const { t } = useTranslation();
  const renderedList =
    !users || !users.length ? (
      <li className={listStyles.listItem}>
        <strong className={listStyles.listName}>{t("noOne")}</strong>
      </li>
    ) : (
      users?.map((user) => (
        <li key={user.id} className={listStyles.listItem}>
          <strong className={listStyles.listName}>{user.userName}</strong>
          <span className={listStyles.listRole}>
            {user.cards.find((c) => c.cardId === cardId)?.role}
          </span>
        </li>
      ))
    );

  return (
    <section>
      <h4>{`${t("haveAccess")}:`}</h4>
      <ul className={listStyles.list}>{renderedList}</ul>
    </section>
  );
};

export default CardAccessList;
