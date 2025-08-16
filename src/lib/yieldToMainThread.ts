export const yieldToMainThread = async () => {
  await new Promise((resolve) => setTimeout(resolve, 0));
};
