import initTranslations from "@/app/i18n";
import FriendRequestList from "@/app/components/FriendRequestList/FriendRequestList";
import InviteFriend from "@/app/components/InviteFriend/InviteFriend";
import FriendList from "@/app/components/FriendList/FriendList";
import Panel from "@/app/components/Panel/Panel";
import { getAllFriends, getUserRequests } from "@/app/helpers/actions";
import { UserRequest } from "@/app/helpers/types";

export default async function FriendsPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const { t } = await initTranslations(locale);
  const friends = await getAllFriends();
  const requests = await getUserRequests({ type: UserRequest.becomeFriend });

  return (
    <>
      <h1>{t("friendship")}</h1>
      <div className={`baseContainer`}>
        <Panel
          headContent={<h2>{t("newFriendshipRequests")}</h2>}
          bodyContent={<FriendRequestList requests={requests} />}
        />
        <Panel
          headContent={<h2>{t("yourFriends")}</h2>}
          bodyContent={<FriendList friends={friends} />}
        />
        <InviteFriend />
      </div>
    </>
  );
}
