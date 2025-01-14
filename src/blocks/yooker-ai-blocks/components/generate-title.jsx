import { useState, useEffect } from "@wordpress/element";
import AIService from "../services/ai-service-text";
import CostService from "../services/payment-service";

const useGenerateTitle = (
  promptValue,
  generateInput,
  postId,
  postType,
  credentials,
  onGenerated
) => {
  const [inProgress, setInProgress] = useState(false);
  const [outputChatGPT, setOutputChatGPT] = useState("");
  const [cost, setCost] = useState("");
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
    if (!credentials.chatGPTAPIKEY) {
      console.error("Missing API key");
      return;
    }

    setInProgress(true);
    try {
      await AIService.generateTitle(
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

export default useGenerateTitle;
