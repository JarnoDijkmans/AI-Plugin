const calculatePricing = (
  promptTokens,
  completionTokens,
  promptCostPer1KTokens,
  completionCostPer1KTokens
) => {
  const promptCost = (promptTokens / 1000) * promptCostPer1KTokens;
  const completionCost = (completionTokens / 1000) * completionCostPer1KTokens;
  const totalCost = promptCost + completionCost;

  return {
    totalCost: totalCost.toFixed(6),
  };
};

export default calculatePricing;
