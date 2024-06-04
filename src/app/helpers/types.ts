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

export const hasUserType = (user: any): user is IUser => {
  return (
    typeof user === "object" &&
    !!user.userName &&
    typeof user.userName === "string"
  );
};

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
