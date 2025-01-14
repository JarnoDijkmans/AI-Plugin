import { encodingForModel } from "js-tiktoken";
import calculatePricing from "../components/price-calculator";

const model = "gpt-3.5-turbo-0125";
const enc = encodingForModel(model);

// Pricing configuration
const promptCostPer1KTokens = 0.0005;
const completionCostPer1KTokens = 0.0015;

const fetchFromOpenAI = async ({
  systemMessage,
  userInputs,
  chatGPTAPIKEY,
  temperature = 0.75,
  top_p = 0.95,
  stream = true,
  setErrorMessage,
}) => {
  const combinedString = userInputs.join(" ");
  const promptTokens = enc.encode(combinedString);

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${chatGPTAPIKEY}`,
      },
      method: "POST",
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: systemMessage },
          ...userInputs.map((input) => ({ role: "user", content: input })),
        ],
        temperature,
        top_p,
        stream,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      const errorMessage = `Error ${response.status}: ${errorData.error.message}`;
      setErrorMessage(errorMessage);
      return null;
    }

    return { response, promptTokens };
  } catch (error) {
    const errorMessage = error.message || "An unknown error occurred.";
    setErrorMessage(errorMessage);
    return null;
  }
};

const handleStreamedResponse = async (
  response,
  promptTokens,
  setOutput,
  setCost
) => {
  const reader = response.body.getReader();
  const decoder = new TextDecoder("utf-8");
  let completeContent = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      const completionTokens = enc.encode(completeContent);
      const { totalCost } = calculatePricing(
        promptTokens.length,
        completionTokens.length,
        promptCostPer1KTokens,
        completionCostPer1KTokens
      );
      setCost(totalCost);
      break;
    }

    const chunk = decoder.decode(value);
    const lines = chunk.split("\n");
    const parsedLines = lines
      .map((line) => line.replace(/^data: /, "").trim())
      .filter((line) => line !== "" && line !== "[DONE]")
      .map((line) => JSON.parse(line));

    for (const parsedLine of parsedLines) {
      const { choices } = parsedLine;
      const { delta } = choices[0];
      const { content } = delta;
      if (content) {
        completeContent += content;
        setOutput((current) => current + content);
      }
    }
  }

  return completeContent;
};

const generateContent = async (
  setOutput,
  userInputs,
  chatGPTAPIKEY,
  systemMessage,
  setCost,
  options = {},
  setErrorMessage
) => {
  try {
    const result = await fetchFromOpenAI({
      systemMessage,
      userInputs,
      chatGPTAPIKEY,
      ...options,
      setErrorMessage,
    });

    // If result is null, exit early
    if (!result) {
      console.log("Fetch failed. Exiting early.");
      return;
    }

    const { response, promptTokens } = result;

    if (response) {
      const content = await handleStreamedResponse(
        response,
        promptTokens,
        setOutput,
        setCost
      );
      setOutput(content);
    }
  } catch (error) {
    console.log(error);
  }
};

export const generateShortDescription = (
  setOutput,
  promptValue,
  language,
  chatGPTAPIKEY,
  setCost,
  setErrorMessage
) =>
  generateContent(
    setOutput,
    [
      `Product details: ${promptValue}`,
      `Generate a short description for the product above in ${language}. Focus on describing the product features and appeal.`,
    ],
    chatGPTAPIKEY,
    "You are a product description generator. Your task is to generate a short product description for the given product. Use between 50 and 150 characters. Without any explanations, titles, or additional commentary.",
    setCost,
    {
      temperature: 0.75,
      top_p: 0.95,
    },
    setErrorMessage
  );

export const generateLongDescription = (
  setOutput,
  promptValue,
  language,
  chatGPTAPIKEY,
  setCost,
  setErrorMessage
) =>
  generateContent(
    setOutput,
    [
      `Product details: ${promptValue}`,
      `Generate a long description based on the above details. In ${language}`,
    ],
    chatGPTAPIKEY,
    "You are a product description generator. Your task is to generate a long product description for the given product.",
    setCost,
    {
      temperature: 0.75,
      top_p: 0.95,
    },
    setErrorMessage
  );

export default {
  generateShortDescription,
  generateLongDescription,
};
