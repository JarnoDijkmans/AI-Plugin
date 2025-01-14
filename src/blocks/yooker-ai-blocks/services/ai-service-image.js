export const generateImage = async (
  setOutputChatGPT,
  promptValue,
  chatGPTAPIKEY,
  setCost
) => {
  let controller;
  try {
    controller = new AbortController();
    const signal = controller.signal;

    // Make the request to OpenAI's image generation API
    const response = await fetch(
      "https://api.openai.com/v1/images/generations",
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${chatGPTAPIKEY}`,
        },
        method: "POST",
        body: JSON.stringify({
          model: "dall-e-3",
          prompt: promptValue,
          n: 1,
          size: "1024x1024",
        }),
        signal,
      }
    );

    const result = await response.json();
    const imageUrl = result.data[0].url;
    const imageCost = 0.04;
    const totalCost = imageCost * 1;

    setOutputChatGPT(imageUrl);
    setCost(totalCost);
  } catch (error) {
    if (controller.signal.aborted) {
      console.log("Request was aborted.");
    } else {
      console.error("Error:", error);
    }
  } finally {
    controller = null;
  }
};
