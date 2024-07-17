import { UserRole, UserRequest } from "@/app/helpers/types";

export const isFixedDialogInTestLib = false;

export const getTestProduct = () => ({
  id: "test_product_id",
  name: "product name",
  photo: null,
  note: "classic",
  got: false,
  // alternatives: [],
});

export const getTestCard = () => ({
  id: "test_card_id",
  name: "test card #1",
  notes: "code: 123-456",
  products: [getTestProduct()],
  isDone: false,
});

export const getTestFriend = () => {
  const { id } = getTestCard();

  return {
    id: "test_friend_id",
    userName: "Test friend #1",
    cards: [{ cardId: id, role: UserRole.buyer }],
  };
};

export const getTestUser = () => {
  const { id } = getTestCard();

  return {
    id: "test_user_id",
    userName: "Test user #1",
    email: "test.user@test.test",
    users: ["test_friend_id"],
    cards: [
      {
        cardId: id,
        role: UserRole.owner,
      },
    ],
    requests: [],
  };
};

export const getTestRequest = () => {
  const { id, userName } = getTestUser();

  return {
    name: UserRequest.becomeFriend,
    from: { id, userName },
    text: "I'm new here. So let me be your friend",
    id: "666ae3326cc9af7b81de3be4",
  };
};
