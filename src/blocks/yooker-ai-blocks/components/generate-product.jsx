import { useState, useEffect } from "@wordpress/element";
import AIService from "../services/ai-service-products";
import CostService from "../services/payment-service";

const useGenerateProduct = (
  promptValue,
  language,
  type,
  credentials,
  productId,
  onGenerated
) => {
  const [inProgress, setInProgress] = useState(false);
  const [outputChatGPT, setOutputChatGPT] = useState("");
  const [outputType, setOutputType] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [cost, setCost] = useState(0);

  useEffect(() => {
    if (onGenerated) {
      onGenerated(outputChatGPT);
    }
  }, [outputChatGPT, onGenerated]);

  useEffect(() => {
    if (cost > 0) {
      CostService.registerCost(
        productId,
        "post",
        "Product generate",
        cost,
        credentials.username,
        credentials.apiKey
      );
    }
  }, [cost]);

  const formatPromptValue = (promptValue) => {
    let description = "";

    Object.entries(promptValue).forEach(([key, value]) => {
      if (value) {
        const label = key.replace(/([A-Z])/g, " $1").toLowerCase();
        const formattedLabel = label.charAt(0).toUpperCase() + label.slice(1);
        description += `${formattedLabel}: ${value}. `;
      }
    });

    return description;
  };

  const handleGenerate = async () => {
    if (!credentials.chatGPTAPIKEY) {
      console.error("Missing prompt or API key");
      return;
    }
    setOutputChatGPT("");
    setInProgress(true);
    const newPromptValue = formatPromptValue(promptValue);

    if (type === "short") {
      try {
        setOutputType(type);
        await AIService.generateShortDescription(
          setOutputChatGPT,
          newPromptValue,
          language,
          credentials.chatGPTAPIKEY,
          setCost,
          setErrorMessage
        );
      } catch (error) {
        console.error("Error generating text:", error);
      } finally {
        setInProgress(false);
      }
    } else if (type === "long") {
      try {
        setOutputType(type);
        await AIService.generateLongDescription(
          setOutputChatGPT,
          newPromptValue,
          language,
          credentials.chatGPTAPIKEY,
          setCost,
          setErrorMessage
        );
      } catch (error) {
        console.error("Error generating text: ", error);
      } finally {
        setInProgress(false);
      }
    }
  };

  return {
    handleGenerate,
    inProgress,
    outputType,
    outputChatGPT,
    errorMessage,
  };
};

export default useGenerateProduct;
