"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import Checkbox from "@/app/components/Checkbox/Checkbox";
import { ButtonContrast, ButtonTypes } from "@/app/components/Button/Button";
import { deleteFriends, deleteFriend } from "@/app/helpers/actions";
import { FriendType } from "@/app/helpers/types";
import { getErrorMessage } from "@/lib/utils";
import ErrorMessage from "@/app/components/ErrorMessage/ErrorMessage";

type SelectedType = {
  [key: string]: boolean;
};

const FriendList = ({ friends }: { friends: FriendType[] | null }) => {
  const { t } = useTranslation();
  const defaultChecked = false;
  const defaultValues = {} as SelectedType;
  const [error, setError] = useState("");

  useEffect(() => {
    friends?.map((fr) => (defaultValues[String(fr._id)] = defaultChecked));
    reset(defaultValues);
  }, [friends]);

  const {
    reset,
    control,
    getValues,
    formState: { isDirty, isValid },
  } = useForm({
    defaultValues,
  });

  const canSave = isDirty && isValid;

  const getUsersForDeleting = (users: SelectedType) =>
    Object.entries(users)
      .filter(([_key, value]: [_key: string, value: boolean]) => value)
      .map(([key, _value]: [key: string, _value: boolean]) => key);

  const formAction = async (_formData: FormData) => {
    const users = getUsersForDeleting(getValues());

    try {
      if (users.length === 0) {
        setError(getErrorMessage(t("wrongData")));
      } else if (users.length === 1) {
        const result =
          users.length === 1
            ? await deleteFriend({ friendId: users[0] })
            : await deleteFriends({ friendIds: users });
        setError(getErrorMessage(result?.message));
      }
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const renderedList =
    !friends || !friends.length ? (
      <p>{t("noOne")}</p>
    ) : (
      friends.map((fr) => {
        return (
          <Checkbox
            key={fr._id}
            text={fr.userName}
            checked={defaultChecked}
            onChange={(_isChecked: boolean) => {}}
            checkId={fr._id}
            control={control}
            extraClassname={"mb-1"}
          />
        );
      })
    );

  return (
    <form action={formAction}>
      {renderedList}
      {!!friends?.length && (
        <div className={"mt-3 mb-2"}>
          <ButtonContrast type={ButtonTypes.SUBMIT} disabled={!canSave}>
            {`${t("deleteSelected")} ❌`}
          </ButtonContrast>
        </div>
      )}
      {error && <ErrorMessage text={error} />}
    </form>
  );
};

export default FriendList;
