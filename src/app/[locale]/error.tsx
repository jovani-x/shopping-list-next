"use client"; // Error boundaries must be Client Components

import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import Button from "@/app/components/Button/Button";
import YCenteredBlock from "@/app/components/YCenteredBlock/YCenteredBlock";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { t } = useTranslation();

  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <YCenteredBlock>
      <h1>{t("sorrySomethingWentWrongTryAgain")}</h1>
      <div>
        <Button
          onClick={
            // Attempt to recover by trying to re-render the segment
            () => reset()
          }
        >
          {t("tryAgain")}
        </Button>
      </div>
    </YCenteredBlock>
  );
}
