export const apiResponse = <T>(
  success: boolean,
  message: string,
  data: T | null = null,
) => {
  return {
    success,
    message,
    data,
  };
};
