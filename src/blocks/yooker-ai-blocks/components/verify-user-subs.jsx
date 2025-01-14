import userService from "../services/user-service";

export const verifySubscription = async (username, apiKey) => {
  try {
    const result = await userService.GetUserSubscriptions(username, apiKey);
    return result;
  } catch (error) {
    console.error("Failed to fetch subscription status:", error);
    return null;
  }
};
