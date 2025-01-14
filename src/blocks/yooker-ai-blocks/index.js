import domReady from "@wordpress/dom-ready";
import { createRoot } from "react-dom/client";
import "../../sass/ai-plugin.scss";
import AdminPage from "./pages/admin-page";
import { SubscriptionProvider } from "./context/subs-context";
import SubscriptionRenderer from "./components/subscription-renderer";

domReady(() => {
  const container = document.getElementById("ai-extension-admin-page");
  const landingspages = document.getElementById("yooker-thickbox-landingspage");
  const aiTemplates = document.getElementById("yooker-thickbox-templates");
  const wooCommerceLongDescription = document.getElementById(
    "custom-woocommerce-button"
  );
  const blockEditor = document.getElementById("editor");
  //Because Woo Commerce short description does not have a direct hook, I used getElementById directly here.
  const wooCommerceShortDescription = document.getElementById(
    "wp-excerpt-editor-tools"
  );

  if (container) {
    const root = createRoot(container);
    root.render(<AdminPage />);
  }

  if (
    blockEditor ||
    landingspages ||
    wooCommerceLongDescription ||
    wooCommerceShortDescription ||
    aiTemplates
  ) {
    // Determine which root elements exist
    const elements = {
      blockEditor,
      landingspages,
      wooCommerceLongDescription,
      wooCommerceShortDescription,
      aiTemplates,
    };

    // Iterate through elements to handle each individually
    Object.entries(elements).forEach(([key, element]) => {
      if (element) {
        let rootId = "";
        let productId = 0;
        let reactContainer = null;

        // Assign rootId and productId based on the element
        switch (key) {
          case "blockEditor":
            rootId = "blockEditor";

            reactContainer = document.createElement("yooker-block-editor");
            reactContainer.id = "custom-block-editor-container";
            element.appendChild(reactContainer);
            break;

          case "wooCommerceLongDescription":
            rootId = "WooCommerceLongDescription";
            productId = element.getAttribute("data-product-id");
            break;

          case "wooCommerceShortDescription":
            rootId = "WooCommerceShortDescription";
            productId =
              wooCommerceLongDescription.getAttribute("data-product-id");

            reactContainer = document.createElement(
              "yooker-custom-product-container"
            );
            reactContainer.id = "custom-product-settings-container-short";
            element.appendChild(reactContainer);
            break;

          case "landingspages":
            rootId = "landingspages";
            break;

          case "aiTemplates":
            rootId = "aiTemplates";
            break;

          default:
            console.warn("Unknown root element.");
            break;
        }
        // Use the React container for short description if applicable
        const renderTarget = reactContainer || element;

        if (renderTarget) {
          const root = createRoot(renderTarget);
          root.render(
            <SubscriptionProvider rootId={rootId} productId={productId}>
              <SubscriptionRenderer />
            </SubscriptionProvider>
          );
        }
      }
    });
  }
});
