import { useSubscriptions } from "../context/subs-context";
import { TextGenerateSettings } from "../custom-block-settings/text-generate-settings";
import { HeaderGenerateSettings } from "../custom-block-settings/header-generate-settings";
import { TitleGenerateSettings } from "../custom-block-settings/title-generate-settings";
import { ImageGenerateSettings } from "../custom-block-settings/image-generate-settings";
import { LandingsPageProvider } from "../context/landingspage-context";
import { LandingsPageSettings } from "../custom-block-settings/landingspage-generate-settings";
import ProductGenerateSettings from "../custom-block-settings/product-generate-settings";
import LandingsPageImportModal from "../pages/modals/landingsImportModal";

const SubscriptionRenderer = () => {
  const { subscriptions, loading, rootId, productId, credentials } =
    useSubscriptions();

  if (!loading) {
    return (
      <>
        {subscriptions.includes("1") && rootId === "blockEditor" && (
          <>
            <TextGenerateSettings credentials={credentials} />
            <HeaderGenerateSettings credentials={credentials} />
            <TitleGenerateSettings
              credentials={credentials}
              subscribed={true}
            />
          </>
        )}
        {subscriptions.includes("5") && rootId === "blockEditor" && (
          <ImageGenerateSettings credentials={credentials} />
        )}
        {subscriptions.includes("6") && rootId === "landingspages" && (
          <>
            <LandingsPageProvider credentials={credentials}>
              <LandingsPageSettings />
            </LandingsPageProvider>
          </>
        )}
        {subscriptions.includes("6") && rootId === "aiTemplates" && (
          <LandingsPageImportModal />
        )}
        {subscriptions.includes("2") &&
          rootId === "WooCommerceLongDescription" &&
          productId !== 0 && (
            <ProductGenerateSettings
              credentials={credentials}
              productId={productId}
              type={"long"}
            />
          )}
        {subscriptions.includes("2") &&
          rootId === "WooCommerceShortDescription" &&
          productId !== 0 && (
            <ProductGenerateSettings
              credentials={credentials}
              productId={productId}
              type={"short"}
            />
          )}
      </>
    );
  }
};

export default SubscriptionRenderer;
