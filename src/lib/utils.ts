export const getErrorMessage = (error: unknown) => {
  if (error instanceof Error) return error.message;
  if (error?.message && error.message instanceof String) return error.message;
  return String(error);
};
