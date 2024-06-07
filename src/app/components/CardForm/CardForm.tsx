"use client";

import { useMemo, useState } from "react";
import cardFormStyles from "./cardForm.module.scss";
import Button, {
  ButtonContrast,
  ButtonTypes,
} from "@/app/components/Button/Button";
import TextControl, {
  TextControlTypes,
  TextControlProps,
} from "@/app/components/TextControl/TextControl";
// import FileControl, {
//   FileControlProps,
// } from '../../components/FileControl/FileControl'
import { useForm, useFieldArray } from "react-hook-form";
import { useRouter } from "next/navigation";
import { FormValues } from "@/app/helpers/types";
import { nanoid } from "nanoid";
import { Product } from "@/app/components/ProductItem/ProductItem";
import Confirmation from "@/app/components/Confirmation/Confirmation";
import { useTranslation } from "react-i18next";
import { ICard } from "@/app/components/Card/Card";
import { getErrorMessage } from "@/lib/utils";

const CardForm = ({
  mutationFunc,
  card,
}: {
  mutationFunc: Function;
  card?: ICard;
}) => {
  const isEditForm = !!card;
  const router = useRouter();
  const FORM_ARR_NAME = "productsList";
  const { t } = useTranslation();
  const {
    register,
    control,
    getFieldState,
    formState: { isValid, isDirty },
    setValue,
    getValues,
  } = useForm<FormValues>({
    defaultValues: {
      cardTitle: card?.name ?? "",
      cardNotes: card?.notes ?? "",
      productsList: card?.products ?? [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: FORM_ARR_NAME,
  });

  const cardTitleProps: TextControlProps = {
    label: t("cardTitle"),
    id: "cardTitle",
    type: TextControlTypes.TEXT,
    placeholder: t("grannysBakery"),
    required: true,
    name: "cardTitle",
    fieldState: getFieldState,
  };

  const cardNotesProps: TextControlProps = {
    label: t("cardNotes"),
    id: "cardNotes",
    type: TextControlTypes.TEXTAREA,
    placeholder: `${t("loyaltyCard")}: NNN-NN-NN\n${t("promoCode")}: XXXX-XXXX`,
    required: false,
    name: "cardNotes",
    fieldState: getFieldState,
  };

  const [isTooltipShown, setIsTooltipShown] = useState<boolean[]>([]);

  const renderedProductListForms = fields.map((field, index) => {
    const controlItemTitleProps: TextControlProps = {
      label: `${t("productTitle")}*`,
      id: index + "_name",
      type: TextControlTypes.TEXT,
      placeholder: "",
      required: true,
      name: `${FORM_ARR_NAME}.${index}.name` as const,
      fieldState: getFieldState,
    };
    const controlItemNoteProps: TextControlProps = {
      label: t("note"),
      id: index + "_note",
      type: TextControlTypes.TEXT,
      placeholder: "",
      required: false,
      name: `${FORM_ARR_NAME}.${index}.note` as const,
      fieldState: getFieldState,
    };
    // const controlItemPhotoProps: FileControlProps = {
    //   label: 'Photo',
    //   id: index + '_photo',
    //   placeholder: '',
    //   required: false,
    //   name: `${FORM_ARR_NAME}.${index}.photo` as const,
    //   fieldState: getFieldState,
    // }

    return (
      <div key={field.id} className={cardFormStyles.group}>
        <TextControl controlProps={controlItemTitleProps} register={register} />
        <TextControl controlProps={controlItemNoteProps} register={register} />
        {/* <FileControl controlProps={controlItemPhotoProps} register={register} /> */}
        <button
          className={cardFormStyles.btnClose}
          type="button"
          onClick={() => {
            let newTooltipState = [...isTooltipShown];
            newTooltipState[index] = !isTooltipShown[index];
            setIsTooltipShown(newTooltipState);
          }}
        >
          ❌
        </button>
        {isTooltipShown[index] && (
          <Confirmation
            extraClassname={"-mt-2 me-6 px-1 text-red-600"}
            text={t("deleteTheProduct?")}
            yesText={t("yes")}
            noText={t("no")}
            yesFunc={() => {
              remove(index);
              let newTooltipState = [...isTooltipShown];
              newTooltipState[index] = false;
              setIsTooltipShown(newTooltipState);
            }}
            noFunc={() => {
              let newTooltipState = [...isTooltipShown];
              newTooltipState[index] = false;
              setIsTooltipShown(newTooltipState);
            }}
          />
        )}
      </div>
    );
  });

  const canSave = isDirty && isValid;
  const onSaveCard = async (data: FormValues) => {
    const formData = {
      id: card?.id ?? "",
      name: data.cardTitle,
      notes: data.cardNotes,
      products: data.productsList,
      isDone: data?.isDone || false,
    };

    try {
      const res = await mutationFunc(formData);

      if (!res?.card) {
        console.log("mutationFunc failed");
      } else {
        console.log("mutationFunc success");
        router.back();
      }
    } catch (err) {
      console.log("Saving failed", getErrorMessage(err));
    }
  };

  const emptyProduct: Product = {
    id: nanoid(),
    name: "",
    photo: null,
    note: "",
    got: false,
  };

  const formTitle = (isEditForm: boolean): string => {
    return isEditForm
      ? `${t("editCard")}: ${card?.name ?? ""}`
      : t("createCard");
  };

  useMemo(() => {
    setValue("cardTitle", card?.name ?? "");
    setValue("cardNotes", card?.notes ?? "");
    setValue("productsList", card?.products ?? []);
  }, [card]);

  const formAction = async () => {
    const data = getValues();
    try {
      await onSaveCard(data);
    } catch (err) {
      console.log("err", getErrorMessage(err));
    }
  };

  return (
    <>
      <h1 className={cardFormStyles.title}>{formTitle(isEditForm)}</h1>
      <form action={formAction}>
        <TextControl controlProps={cardTitleProps} register={register} />
        <TextControl controlProps={cardNotesProps} register={register} />
        {renderedProductListForms}
        <div className={cardFormStyles.btnHolder}>
          <Button
            onClick={() => {
              append(emptyProduct);
              setIsTooltipShown([...isTooltipShown, false]);
            }}
            children={t("addProduct")}
          />
          <ButtonContrast
            type={ButtonTypes.SUBMIT}
            children={t("saveCard")}
            disabled={!canSave}
          />
        </div>
      </form>
    </>
  );
};

export default CardForm;
