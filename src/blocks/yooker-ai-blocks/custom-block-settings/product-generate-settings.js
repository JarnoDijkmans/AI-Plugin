import { useEffect, useState } from "@wordpress/element";
import {
  SelectControl,
  Button,
  __experimentalGrid as Grid,
} from "@wordpress/components";
import useGenerateProduct from "../components/generate-product";
import ProductInformation from "../components/product-information";
import TooltipIcon from "../components/TooltipIcon";

const ProductGenerateSettings = ({ credentials, productId, type }) => {
  const [aggregatedContent, setAggregatedContent] = useState({});
  const [language, setLanguage] = useState("Dutch");
  const {
    handleGenerate,
    inProgress,
    outputType,
    outputChatGPT,
    errorMessage,
  } = useGenerateProduct(
    aggregatedContent,
    language,
    type,
    credentials,
    productId
  );

  const handleGenerateAndSet = async (event) => {
    event.preventDefault();
    await handleGenerate();
  };

  useEffect(() => {
    if (outputChatGPT) {
      if (outputType === "short") {
        document.querySelector("#excerpt").value = outputChatGPT;
      } else if (outputType === "long") {
        document.querySelector("#content").value = outputChatGPT;
      } else {
        console.log("Something went wrong");
      }
    }
  }, [outputChatGPT]);

  useEffect(() => {
    if (errorMessage) {
      if (outputType === "short") {
        document.querySelector("#excerpt").value = errorMessage;
      } else if (outputType === "long") {
        document.querySelector("#content").value = errorMessage;
      } else {
        console.log("Something went wrong");
      }
    }
  }, [errorMessage]);

  return (
    <div>
      <ProductInformation
        productId={productId}
        setAggregatedContent={setAggregatedContent}
      />
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          maxHeight: "30px",
        }}
      >
        <Grid columns={2}>
          <Button
            variant="primary"
            onClick={handleGenerateAndSet}
            disabled={inProgress}
          >
            Generate
          </Button>
          <SelectControl
            value={language}
            placeholder="Select language"
            options={[
              { label: "Nederlands", value: "Dutch" },
              { label: "Engels", value: "English" },
              { label: "Duits", value: "Deutsch" },
            ]}
            onChange={(value) => setLanguage(value)}
          />
        </Grid>
        <TooltipIcon type={"product"} />
      </div>
    </div>
  );
};

export default ProductGenerateSettings;
