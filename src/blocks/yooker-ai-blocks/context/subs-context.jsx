import {
  createContext,
  useContext,
  useState,
  useEffect,
} from "@wordpress/element";
import { verifySubscription } from "../components/verify-user-subs";
import AdminOptions from "../services/admin-option-service";

const SubscriptionContext = createContext();

export const useSubscriptions = () => useContext(SubscriptionContext);

export const SubscriptionProvider = ({ rootId, productId, children }) => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [credentials, setCredentials] = useState({
    username: "",
    apiKey: "",
    chatGPTAPIKEY: "",
  });

  useEffect(() => {
    const initialize = async () => {
      try {
        const response = await AdminOptions.GetSettings();
        const updatedCredentials = {
          username: response.yookeraiusername || "",
          apiKey: response.yookeraiapikey || "",
          chatGPTAPIKEY: response.chatGPTAPIKEY || "",
        };
        setCredentials(updatedCredentials);

        if (
          updatedCredentials.username &&
          updatedCredentials.apiKey &&
          updatedCredentials.chatGPTAPIKEY
        ) {
          // Pass the username and apiKey directly to verifySubscription
          const subscriptions = await verifySubscription(
            updatedCredentials.username,
            updatedCredentials.apiKey
          );
          setSubscriptions(subscriptions || []);
        }
      } catch (error) {
        console.error("Error initializing subscriptions:", error);
      } finally {
        setLoading(false);
      }
    };

    initialize();
  }, []);

  return (
    <SubscriptionContext.Provider
      value={{ subscriptions, loading, rootId, productId, credentials }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
};
