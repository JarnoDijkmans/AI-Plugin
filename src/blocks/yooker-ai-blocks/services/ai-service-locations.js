import calculatePricing from "../components/price-calculator";

export const generate = async (locationName, amount, chatGPTAPIKEY) => {
  const locationResponse = await fetch(
    "https://api.openai.com/v1/chat/completions",
    {
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
            content: `Using geographical data, find the ${amount} closest towns or villages around ${locationName}. Only list the names of the locations, one per line. Do not! include distances, introductions, numbering, explanations, or any other context.`,
          },
        ],
      }),
    }
  );

  if (!locationResponse.ok) {
    const errorData = await locationResponse.json();
    const errorMessage = `Error ${locationResponse.status}: ${errorData.error.message}`;
    return { locations: null, totalCost: null, errorMessage }; // Return structured error
  }

  const locationResult = await locationResponse.json();

  const locationContent = locationResult.choices[0].message.content;
  const locations = [
    locationName,
    ...locationContent
      .split("\n")
      .map((location) => location.replace(/^- /, "").trim())
      .filter(Boolean),
  ];

  console.log(locations);

  const promptCostPer1KTokens = 0.0025;
  const completionCostPer1KTokens = 0.01;

  const {
    prompt_tokens: locPromptTokens,
    completion_tokens: locCompletionTokens,
  } = locationResult.usage;

  const { totalCost } = calculatePricing(
    locPromptTokens,
    locCompletionTokens,
    promptCostPer1KTokens,
    completionCostPer1KTokens
  );
  // Return the results
  return { locations, totalCost, errorMessage: null };
};
