import calculatePricing from "../components/price-calculator";

const generateAIContent = async (
  duplicate,
  contentToRevamp,
  options,
  chatGPTAPIKEY
) => {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${chatGPTAPIKEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are a professional content creator specializing in enhancing text for maximum engagement. Your tasks:
            1. Follow the user's focus and details (provided below).
            2. If User Options include - Service, - Product or - Location, use the requested service naturally.
            3. If User Options include - Translate, translate the content to Revamp text to requested language.
            4. Ensure the output style matches the tone, voice, and structure of the original content to maintain consistency and flow.
            5. Generate plain text only, without explanations or formatting.`,
        },
        {
          role: "user",
          content: `
            Original Content:
            "${duplicate.post_content}"
      
            Content to Revamp:
            "${contentToRevamp}"
      
            User Options:
            ${options.service ? `- Service: ${options.service}` : ""}
            ${
              options.translation ? `- Translation: ${options.translation}` : ""
            }
            ${options.product ? `- Product: ${options.product}` : ""}
            ${options.location ? `- Location: ${options.location}` : ""}
          `,
        },
      ],
    }),
  });

  return await response.json();
};

const calculateCosts = (
  usage,
  setCost,
  promptCostPer1KTokens,
  completionCostPer1KTokens
) => {
  if (usage) {
    const { prompt_tokens, completion_tokens } = usage;
    const { totalCost } = calculatePricing(
      prompt_tokens,
      completion_tokens,
      promptCostPer1KTokens,
      completionCostPer1KTokens
    );
    setCost(totalCost);
  } else {
    console.warn("No usage data returned for cost calculation.");
  }
};

const updateContent = (duplicateContent, contentToRevamp, newContent) => {
  const selectedParagraphs = contentToRevamp.split("\n\n");
  const newParagraphs = newContent.split("\n\n");

  let updatedContent = duplicateContent;

  selectedParagraphs.forEach((paragraph, index) => {
    const newParagraph = newParagraphs[index] || paragraph;
    const escapedParagraph = paragraph.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
    updatedContent = updatedContent.replace(
      new RegExp(`<p>${escapedParagraph}</p>`, "g"),
      `<p>${newParagraph}</p>`
    );
  });

  return updatedContent;
};

export const generateLandingspage = async (
  page,
  chatGPTAPIKEY,
  setCost,
  setErrorMessage,
  duplicate
) => {
  try {
    const contentToRevamp = page.modifiedContent;
    const options = page.options;

    const promptCostPer1KTokens = 0.0025;
    const completionCostPer1KTokens = 0.01;

    const result = await generateAIContent(
      duplicate,
      contentToRevamp,
      options,
      chatGPTAPIKEY
    );

    if (result.error) {
      setErrorMessage(result.error.message);
      return; // Exit early if there's an error
    }
    // Calculate cost before further processing
    calculateCosts(
      result.usage,
      setCost,
      promptCostPer1KTokens,
      completionCostPer1KTokens
    );

    if (result.choices?.[0]?.message) {
      const newContent = result.choices[0].message.content;
      const updatedContent = updateContent(
        duplicate.post_content,
        contentToRevamp,
        newContent
      );

      return { updatedContent };
    } else {
      console.error("Unexpected response from ChatGPT:", result);
    }
  } catch (error) {
    console.error("Error generating or updating landing page:", error);
  }
};
