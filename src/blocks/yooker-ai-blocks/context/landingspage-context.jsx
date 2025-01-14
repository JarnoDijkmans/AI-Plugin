import {
  createContext,
  useContext,
  useState,
  useEffect,
} from "@wordpress/element";
import useGenerateLandingspage2 from "../components/landingspage/generate-landingspage2";
import CostService from "../services/payment-service";
import { generate } from "../services/ai-service-locations";
import useGenerateLandingspage from "../components/landingspage/generate-landingspage";
import WpService from "../services/wp-service";

const LandingsPageContext = createContext();

export const LandingsPageProvider = ({ credentials, children }) => {
  const [landingspage, setLandingsPage] = useState([]);
  const { handleGenerate2, cost2, errorMessage } = useGenerateLandingspage2();
  const { handleGenerate, cost, error } = useGenerateLandingspage();
  const [apiCost, setApiCost] = useState(0);
  const [locations, setLocations] = useState([]);
  const [templateId, setTemplateId] = useState(null);
  const [newLocation, setNewLocation] = useState("");
  const [errorText, setErrorText] = useState("");
  const [generationComplete, setGenerationComplete] = useState(false);
  const [loading, setLoading] = useState(false);

  const updateLandingspageStatus = (index, status) => {
    setLandingsPage((prev) =>
      prev.map((page, idx) => (idx === index ? { ...page, status } : page))
    );
  };

  useEffect(() => {
    if (cost) {
      setApiCost(cost);
    }
    if (cost2) {
      setApiCost(cost2);
    }
  }, [cost, cost2]);

  useEffect(() => {
    if (error) {
      setErrorText(error);
    }

    if (errorMessage) {
      setErrorText(errorMessage);
    }
  }, [errorMessage, error]);

  useEffect(() => {
    if (apiCost > 0) {
      console.log(apiCost);
      CostService.registerCost(
        templateId,
        "post",
        "Landingspages",
        apiCost,
        credentials.username,
        credentials.apiKey
      );
    }
  }, [apiCost]);

  const generateLandingspage2 = async () => {
    const duplicate = await WpService.getPostDetails(templateId);

    const pendingLandingspages = landingspage
      .map((page, index) => ({ page, index }))
      .filter(({ page }) => page.status !== "Finished" && "Generating...");

    handleGenerate2(
      pendingLandingspages,
      updateLandingspageStatus,
      credentials,
      duplicate
    ).catch((error) =>
      console.error(`Error generating page at index ${index}:`, error)
    );
  };

  const generateLandingspage = async (dataset) => {
    try {
      setLoading(true);
      setGenerationComplete(false);
      setErrorText("");

      const duplicate = await WpService.getPostDetails(templateId);

      const pendingDatasets = dataset
        .map((data, index) => ({ data, index }))
        .filter(
          ({ data }) =>
            data.status !== "Finished" && data.status !== "Generating..."
        );

      const generateTasks = pendingDatasets.map(({ data }) =>
        handleGenerate(data, duplicate, credentials)
      );

      // Wait for all generate tasks to complete
      await Promise.all(generateTasks);
    } catch (error) {
      setErrorText("Error generating landing pages:", error);
    } finally {
      setLoading(false);
      setGenerationComplete(true);
    }
  };

  const cancelLandingPage = (index) => {
    if (index < 0 || index >= landingspage.length) return;

    if (landingspage[index].status === "Finished" && "Generating...") {
      return;
    } else {
      setLandingsPage((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const removeLocation = (index) => {
    setLocations((prev) => prev.filter((_, i) => i !== index));
  };

  const addLocation = () => {
    if (newLocation.trim() === "") return;
    setLocations((prev) => [...prev, newLocation.trim()]);
    setNewLocation("");
  };

  const generateLocations = async (location, amount) => {
    try {
      if (amount > 0) {
        const { locations, totalCost, errorMessage } = await generate(
          location,
          amount,
          credentials.chatGPTAPIKEY
        );

        if (errorMessage) {
          setErrorText(errorMessage);
        }

        setApiCost(totalCost);
        setLocations(locations);
      } else {
        setLocations([location]);
      }
    } catch (error) {
      console.error("Error generating locations:", error.message);
    }
  };

  return (
    <LandingsPageContext.Provider
      value={{
        landingspage,
        locations,
        generationComplete,
        setGenerationComplete,
        setLocations,
        loading,
        setNewLocation,
        newLocation,
        setTemplateId,
        removeLocation,
        addLocation,
        addNewLandingPage: (newPage) => {
          setLandingsPage((prev) => [...prev, newPage]);
        },
        generateLandingspage,
        generateLandingspage2,
        generateLocations,
        updateLandingspageStatus,
        cancelLandingPage,
        errorText,
      }}
    >
      {children}
    </LandingsPageContext.Provider>
  );
};

export const useLandingsPage = () => useContext(LandingsPageContext);
