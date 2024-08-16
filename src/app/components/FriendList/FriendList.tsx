"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import Checkbox from "@/app/components/Checkbox/Checkbox";
import { ButtonContrast, ButtonTypes } from "@/app/components/Button/Button";
import { deleteFriends, deleteFriend } from "@/app/actions/client/friends";
import { FriendType, SelectedType } from "@/app/helpers/types";
import { getErrorMessage, getKeysByTrueValue } from "@/lib/utils";
import ErrorMessage from "@/app/components/ErrorMessage/ErrorMessage";
import { initStreamListener } from "@/app/helpers/listener";

const FriendList = ({
  friendsProps,
}: {
  friendsProps: FriendType[] | null;
}) => {
  const { t } = useTranslation();
  const defaultChecked = false;
  const defaultValues = useMemo(() => {
    const values = {} as SelectedType;
    friendsProps?.map((fr) => (values[String(fr.id)] = defaultChecked));
    return values;
  }, [friendsProps, defaultChecked]);
  const [error, setError] = useState("");
  const [friends, setFriends] = useState(friendsProps);
  const refEvSource = useRef<EventSource | null>(null);

  useEffect(
    () =>
      initStreamListener({
        refEvSource,
        setData: setFriends,
        dataName: "friends",
        eventName: "usersupdate",
      }),
    []
  );

  const {
    reset,
    control,
    getValues,
    formState: { isDirty, isValid },
  } = useForm({
    defaultValues,
  });

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  const canSave = isDirty && isValid;

  const formAction = async (_formData: FormData) => {
    const users = getKeysByTrueValue(getValues());

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
            key={fr.id}
            text={fr.userName}
            checked={defaultChecked}
            onChange={(_isChecked: boolean) => {}}
            checkId={fr.id}
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
