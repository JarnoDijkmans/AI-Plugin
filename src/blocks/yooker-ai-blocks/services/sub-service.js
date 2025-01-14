import StatusCheck from "../error-handling/statushandler";

const baseURL = "https://ai.yookerdesign.nl";

const getAuthenticatedSubs = async (username, apiKey) => {
  try {
    const response = await fetch(
      `${baseURL}/wp-json/yooker-ai-admin/v1/user-subscriptions/`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Basic " + window.btoa(`${username}:${apiKey}`),
        },
      }
    );

    const text = await response.text();

    const data = JSON.parse(text);

    const isSuccess = StatusCheck({
      status: data.status,
      message: data.message,
    });

    if (isSuccess) {
      return data.data;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching authenticated subscriptions:", error);
    return null;
  }
};

const getUnAuthenticatedSubs = async () => {
  try {
    const response = await fetch(
      `${baseURL}/wp-json/yooker-ai-admin/v1/subscriptions`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const text = await response.text();
    const data = JSON.parse(text);

    const isSuccess = StatusCheck({
      status: data.status,
      message: data.message,
    });

    if (isSuccess) {
      return data.data;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching unauthenticated subscriptions:", error);
    return null;
  }
};

const newSubForUser = async (username, apiKey, subid) => {
  try {
    const response = await fetch(
      `${baseURL}/wp-json/yooker-ai-admin/v1/new-subscription/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Basic " + window.btoa(`${username}:${apiKey}`),
        },
        body: JSON.stringify({
          subscription_id: subid,
        }),
      }
    );

    const text = await response.text();
    const data = JSON.parse(text);
    const isSuccess = StatusCheck({
      status: data.status,
      message: data.message,
    });

    return isSuccess ? data : false;
  } catch (error) {
    console.error("Error creating new subscription: ", error);
    return null;
  }
};

const endSub = async (username, apiKey, subId) => {
  try {
    const response = await fetch(
      `${baseURL}/wp-json/yooker-ai-admin/v1/end-subscription/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Basic " + window.btoa(`${username}:${apiKey}`),
        },
        body: JSON.stringify({
          subscription_id: subId,
        }),
      }
    );

    const text = await response.text();

    const data = JSON.parse(text);

    const isSuccess = StatusCheck({
      status: data.status,
      message: data.message,
    });

    return isSuccess ? data : false;
  } catch (error) {
    console.error("Error deleting subscription: ", error);
    return null;
  }
};

const getDetails = async (selectedSubId) => {
  try {
    const response = await fetch(
      `${baseURL}/wp-json/yooker-ai-admin/v1/get-subscription-details/${selectedSubId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const text = await response.text();
    const data = JSON.parse(text);

    const isSuccess = StatusCheck({
      status: data.status,
      message: data.message,
    });

    if (isSuccess) {
      return data.data;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error retrieving subscription details: ", error);
    return null;
  }
};

export default {
  getAuthenticatedSubs,
  getUnAuthenticatedSubs,
  newSubForUser,
  endSub,
  getDetails,
};
