"use client";

import cardFilterStyles from "./cardFilter.module.scss";
import Checkbox from "@/app/components/Checkbox/Checkbox";
import { useEffect, useState } from "react";
import { IFilter } from "@/app/helpers/types";
import { useTranslation } from "react-i18next";

const CardFilter = ({ filterState, setFilterState }: IFilter) => {
  const [unfinished, setUnfinished] = useState(filterState.unfinished);
  const [done, setDone] = useState(filterState.done);
  const { t } = useTranslation();

  useEffect(() => {
    setFilterState({
      unfinished,
      done,
    });
  }, [unfinished, done]);

  return (
    <>
      <form className={cardFilterStyles.cardFilter}>
        <span className={cardFilterStyles.title}>{`${t("filter")}:`}</span>
        <Checkbox
          text={t("unfinished")}
          onChange={setUnfinished}
          checked={unfinished}
        />
        <Checkbox text={t("done")} onChange={setDone} checked={done} />
      </form>
    </>
  );
};

export default CardFilter;
