import { useState, useEffect } from "@wordpress/element";
import AIService from "../services/ai-service-text";
import CostService from "../services/payment-service";

const useGenerateText = (
  promptValue,
  generateInput,
  postId,
  postType,
  credentials,
  onGenerated
) => {
  const [inProgress, setInProgress] = useState(false);
  const [outputChatGPT, setOutputChatGPT] = useState("");
  const [cost, setCost] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (cost > 0) {
      CostService.registerCost(
        postId,
        postType,
        "Text Generate",
        cost,
        credentials.username,
        credentials.apiKey
      );
    }
  }, [cost]);

  useEffect(() => {
    if (onGenerated) {
      onGenerated(outputChatGPT);
    }
  }, [outputChatGPT, onGenerated]);

  const handleGenerate = async () => {
    if (!generateInput || !credentials.chatGPTAPIKEY) {
      console.error("Missing prompt or API key");
      return;
    }

    setInProgress(true);
    try {
      await AIService.generateText(
        setOutputChatGPT,
        generateInput,
        promptValue,
        credentials.chatGPTAPIKEY,
        setInProgress,
        setCost,
        setErrorMessage
      );
    } catch (error) {
      console.error("Error generating text:", error);
    } finally {
      setInProgress(false);
    }
  };

  return { handleGenerate, inProgress, outputChatGPT, errorMessage };
};

export default useGenerateText;
