import { registerPlugin } from "@wordpress/plugins";
import { TitleGeneratePanel } from "./titleGeneratePanel";

const registerPluginForUser = (credentials, subscribed) => {
  if (subscribed) {
    registerPlugin("plugin-document-setting-panel-demo", {
      render: () => <TitleGeneratePanel credentials={credentials} />,
      icon: "palmtree",
    });
  }
};

export const TitleGenerateSettings = ({ credentials, subscribed }) => {
  // Register the plugin if subscribed
  registerPluginForUser(credentials, subscribed);

  return null;
};
