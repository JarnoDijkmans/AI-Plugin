import calculatePricing from "../components/price-calculator";

const generateSEO = async (content, chatGPTAPIKEY, setCost) => {
  try {
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
            content: `
              You are an assistant specialized in generating SEO metadata. 
              Your task is to generate an SEO-optimized title and meta description for the provided content. 
              Ensure the following constraints:
              - The title must be under 60 characters!
              - The description must be under 160 characters!
              Use concise and engaging language that highlights the content's main focus.
            `,
          },
          {
            role: "user",
            content: content,
          },
          {
            role: "system",
            content: `Respond in the following JSON format:
            {
              "title": "Your SEO Title Here",
              "description": "Your SEO Description Here"
            }`,
          },
        ],
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      const errorMessage = result?.error?.message || "Unknown error occurred";
      console.error("OpenAI API Error:", errorMessage);
      return { title: null, description: null, errorMessage };
    }

    const { usage } = result;

    // Validate response structure
    if (!result.choices || !result.choices[0]?.message?.content) {
      console.error("Invalid response structure from OpenAI:", result);
      return {
        title: null,
        description: null,
        errorMessage: "Invalid response structure from OpenAI.",
      };
    }

    // Preprocess and parse the JSON response
    let rawContent = result.choices[0].message.content.trim();
    rawContent = rawContent.replace(/^```json|```$/g, ""); // Remove backticks if present

    let contentJson;
    try {
      contentJson = JSON.parse(rawContent);
    } catch (parseError) {
      console.error(
        "JSON Parsing Error:",
        parseError,
        "Raw content:",
        rawContent
      );
      return {
        title: null,
        description: null,
        errorMessage: "Failed to parse JSON response.",
      };
    }

    console.log("Parsed contentJson:", contentJson);

    // Calculate costs
    calculateCosts(usage, setCost, 0.005, 0.015);

    return {
      title: contentJson.title,
      description: contentJson.description,
      errorMessage: null,
    };
  } catch (error) {
    console.error("Unexpected Error:", error.message);
    return { title: null, description: null, errorMessage: error.message };
  }
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

export default { generateSEO };
