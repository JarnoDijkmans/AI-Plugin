import StatusCheck from "../error-handling/statushandler";

const baseURL = "https://ai.yookerdesign.nl";

const CreateUser = async (userData) => {
  try {
    const response = await fetch(
      `${baseURL}/wp-json/yooker-ai-admin/v1/new-subscriber/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      }
    );

    const text = await response.text();
    const data = JSON.parse(text);

    const isSuccess = StatusCheck({
      status: data.status,
      message: data.message,
    });

    if (isSuccess) {
      return data;
    }
  } catch (error) {
    console.error("Error creating user:", error);
    return null;
  }
};

const GetUserSubscriptions = async (username, apiKey) => {
  try {
    const response = await fetch(
      `${baseURL}/wp-json/yooker-ai-admin/v1/active-subscriptions/`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Basic " + window.btoa(`${username}:${apiKey}`),
        },
      }
    );

    const data = await response.json();

    const isSuccess = StatusCheck({
      status: data.status,
      message: data.message,
    });

    if (isSuccess && data.data.subscriptions) {
      return data.data.subscriptions;
    }
  } catch (error) {
    console.error("Error fetching subscriptions:", error);
    return [];
  }
};

export default {
  CreateUser,
  GetUserSubscriptions,
};
