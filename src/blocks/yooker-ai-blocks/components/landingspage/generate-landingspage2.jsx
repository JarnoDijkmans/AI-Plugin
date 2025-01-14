import { useState } from "@wordpress/element";
import { generateLandingspage } from "../../services/ai-service-landingspages";
import WpService from "../../services/wp-service";
import SEOService from "../../services/seo-service";

const useGenerateLandingspage2 = () => {
  const [cost2, setCost] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");

  const handleGenerate2 = async (
    landingspages,
    updateLandingspageStatus,
    credentials,
    duplicate
  ) => {
    if (!credentials.chatGPTAPIKEY) {
      console.error("Missing API key");
      return;
    }

    try {
      for (const { page, index } of landingspages) {
        try {
          updateLandingspageStatus(index, "Generating...");

          const { updatedContent } = await generateLandingspage(
            page,
            credentials.chatGPTAPIKEY,
            setCost,
            setErrorMessage,
            duplicate
          );

          const { title, description, errorMessage } =
            await SEOService.generateSEO(
              updatedContent,
              credentials.chatGPTAPIKEY,
              setCost
            );

          if (errorMessage) {
            setErrorMessage(errorMessage);
          } else {
            await WpService.createLandingspage(
              title,
              updatedContent,
              description
            );
          }

          updateLandingspageStatus(index, "Finished");
        } catch (error) {
          console.error("Error generating text for page:", page.title, error);
          updateLandingspageStatus(index, "Error");
        }
      }
    } catch (error) {
      console.error("Error during generation:", error);
    }
  };

  return { handleGenerate2, cost2, errorMessage };
};

export default useGenerateLandingspage2;
