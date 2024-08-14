"use server";

import initTranslations from "@/app/i18n";
import { getCurrentLocale } from "@/app/helpers/language";
import { IRequest } from "@/app/helpers/types";
import RequestItem from "@/app/components/RequestItem/RequestItem";

const RequestList = async ({
  requests,
  approveFun,
  declineFun,
}: {
  requests: IRequest[];
  approveFun: (...args: any) => Promise<any>;
  declineFun: (...args: any) => Promise<any>;
}) => {
  const locale = await getCurrentLocale();
  const { t } = await initTranslations(locale);
  const renderedList =
    !requests || !requests?.length ? (
      <p>{t("noOne")}</p>
    ) : (
      requests.map((req) => (
        <RequestItem
          key={req.id}
          request={req}
          approveFun={approveFun}
          declineFun={declineFun}
        />
      ))
    );

  return <>{renderedList}</>;
};

export default RequestList;
