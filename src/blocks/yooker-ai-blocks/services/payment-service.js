import StatusCheck from "../error-handling/statushandler";
import WpService from "./wp-service";

const baseURL = "https://ai.yookerdesign.nl";

const registerCost = async (
  postId,
  postType,
  subType,
  cost,
  username,
  apiKey
) => {
  try {
    const template = await WpService.getPostDetails(postId);
    const templateName = template?.post_title || "Unknown Template";

    const response = await fetch(
      `${baseURL}/wp-json/yooker-ai-admin/v1/register-cost/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Basic " + window.btoa(`${username}:${apiKey}`),
        },
        body: JSON.stringify({
          post_title: templateName,
          post_type: postType,
          sub_type: subType,
          value: cost,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to update post meta");
    }
  } catch (error) {
    console.error("Error updating post meta:", error);
  }
};

const paymentHistoryDaily = async (username, apiKey) => {
  try {
    const response = await fetch(
      `${baseURL}/wp-json/yooker-ai-admin/v1/get-payment-history/`,
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

    if (isSuccess) {
      return data.data;
    }
  } catch (error) {
    console.error("Error fething payment history");
  }
};

const paymentHistoryMonthly = async (username, apiKey) => {
  try {
    const response = await fetch(
      `${baseURL}/wp-json/yooker-ai-admin/v1/get-payment-history-monthly/`,
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

    if (isSuccess) {
      return data.data;
    }
  } catch (error) {
    console.error("Error fething payment history");
  }
};

const totalPriceSpendByUser = async (username, apiKey) => {
  try {
    const response = await fetch(
      `${baseURL}/wp-json/yooker-ai-admin/v1/get-total-price-spend`,
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

    if (isSuccess) {
      return data.data;
    }
  } catch (error) {
    console.error("Error fething payment history");
  }
};

export default {
  registerCost,
  paymentHistoryDaily,
  paymentHistoryMonthly,
  totalPriceSpendByUser,
};
