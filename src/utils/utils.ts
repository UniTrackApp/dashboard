// Function to get the first name from a full name, used across the app
export const getFirstName = (fullName: string | null | undefined) => {
  return fullName?.split(" ")[0];
};
