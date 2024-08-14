export const getApiURL = async () =>
  process.env.VITE_API_URL || "https://localhost:3001";
