export enum CardEditingStatus {
  FREE = "free",
  EDITING = "editing",
  IN_PROCESS = "in process",
}

export type EditingStatusType = {
  value: CardEditingStatus;
  userName?: string;
};

export type FormProductValues = {
  id: string;
  name: string;
  note: string | null;
  photo: string | null;
  got: boolean;
};

export type FormValues = {
  cardTitle: string;
  cardNotes: string;
  productsList: FormProductValues[];
  isDone?: boolean;
  status?: {
    value: CardEditingStatus;
    userName?: string;
  };
};

export interface ILoginValues {
  userName: string;
  password: string;
}

export interface IRegisterValues extends ILoginValues {
  confirmPassword: string;
  email: string;
}

export interface IForgetValues {
  email: string;
}

export interface IUser extends ILoginValues {
  email: string;
  accessToken?: string | null;
  // role?: RolesType
  // expiredToken?: Date
}

export interface IMessage {
  message?: string;
  status?: string;
  error?: string;
}

export interface ITryError {
  data?: { message?: string };
}

export enum StateStatusType {
  IDLE = "idle",
  LOADING = "loading",
  SUCCEEDED = "succeeded",
  FAILED = "failed",
}

export interface IFilter {
  filterState: {
    unfinished: boolean;
    done: boolean;
  };
  setFilterState: Function;
}

export type AuthUser = {
  userName: string | null;
  userId: string | null;
  accessToken: string | null;
};

export enum UserRole {
  owner = "OWNER",
  buyer = "BUYER",
}

export type FriendType = {
  id: string;
  userName: string;
  cards: { cardId: string; role: UserRole }[];
};

export enum UserRequest {
  becomeFriend = "BECOME FRIEND",
}

export interface IRequest {
  id: string;
  name: UserRequest;
  text: string;
  from: {
    id: string;
    userName: string;
  };
}
