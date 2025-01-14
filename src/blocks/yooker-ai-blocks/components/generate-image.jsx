import { useState, useEffect } from "@wordpress/element";
import { generateImage } from "../services/ai-service-image";
import CostService from "../services/payment-service";

const useGenerateImage = (
  promptValue,
  postId,
  postType,
  credentials,
  onGenerated
) => {
  const [inProgress, setInProgress] = useState(false);
  const [outputChatGPT, setOutputChatGPT] = useState("");
  const [cost, setCost] = useState("");

  useEffect(() => {
    if (cost > 0) {
      CostService.registerCost(
        postId,
        postType,
        "Image Generate",
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
    if (!promptValue || !credentials.chatGPTAPIKEY) {
      console.error("Missing prompt or API key");
      return;
    }

    setInProgress(true);
    try {
      setInProgress(true);
      await generateImage(
        setOutputChatGPT,
        promptValue,
        credentials.chatGPTAPIKEY,
        setCost
      );
    } catch (error) {
      console.error("Error generating text:", error);
    } finally {
      setInProgress(false);
    }
  };

  return { handleGenerate, inProgress, outputChatGPT };
};

export default useGenerateImage;
