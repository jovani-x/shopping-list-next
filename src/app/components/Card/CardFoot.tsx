"use client";

import cardStyles from "./card.module.scss";
import { useTranslation } from "react-i18next";
import { useCardContext } from "./CardContextProvider";
import Button from "@/app/components/Button/Button";

const CardFootContent = () => {
  const { t } = useTranslation();
  const { setAllProductsDone } = useCardContext();

  return (
    <footer className={cardStyles.cardFoot}>
      <Button onClick={() => setAllProductsDone()}>{`${t("done")}?`}</Button>
    </footer>
  );
};

export default CardFootContent;
