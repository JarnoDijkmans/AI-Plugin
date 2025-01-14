import React, { useState, useEffect } from "react";
import {
  Modal,
  Button,
  __experimentalText as Text,
  TabPanel,
  __experimentalGrid as Grid,
  Notice,
} from "@wordpress/components";
import AdminOptions from "../../services/admin-option-service";
import SubService from "../../services/sub-service";
import { SplitLongDescription } from "../../components/split-description";
import { height } from "@fortawesome/free-solid-svg-icons/fa0";

const InfoModal = ({
  isOpen,
  onClose,
  selectedSubId,
  loggedIn,
  status,
  refresh,
}) => {
  if (!isOpen) return null;

  const [username, setUsername] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [sub, setSub] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);

  const fetchSubdetails = (selectedSubId) => {
    SubService.getDetails(selectedSubId)
      .then((response) => {
        if (response) {
          setSub(response);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handlePurchase = () => {
    SubService.newSubForUser(username, apiKey, selectedSubId)
      .then((data) => {
        if (data === false) {
          setErrorMessage(
            "Your account is not activated yet. Please contact support."
          );
          return;
        }
        if (data) {
          refresh();
          onClose();
        }
      })
      .catch((error) => {
        console.error("Something went wrong with making the purchase", error);
      });
  };

  const handleUnsub = () => {
    SubService.endSub(username, apiKey, selectedSubId)
      .then((data) => {
        if (data === false) {
          setErrorMessage(
            "Your account is not activated yet. Please contact support."
          );
          return;
        }
        if (data) {
          refresh();
          onClose();
        }
      })
      .catch((error) => {
        console.error(
          "Something went wrong with deleting a subscription.",
          error
        );
      });
  };

  const fetchOptions = () => {
    AdminOptions.GetSettings()
      .then((response) => {
        setUsername(response.yookeraiusername);
        setApiKey(response.yookeraiapikey);
      })
      .catch((error) => {
        console.error("Failed to load API settings:", error);
      });
  };

  useEffect(() => {
    fetchOptions();
    fetchSubdetails(selectedSubId);
  }, [selectedSubId]);

  return (
    <Modal
      title={sub.name}
      onRequestClose={onClose}
      style={{ width: "50%", height: "75%" }}
    >
      {errorMessage && (
        <Notice
          status="error"
          onRemove={() => setErrorMessage(null)}
          isDismissible
        >
          {errorMessage}
        </Notice>
      )}
      <Grid columns={2} gap={4}>
        <div style={{ paddingRight: "10px" }}>
          <TabPanel
            className="my-tab-panel"
            activeClass="active-tab"
            tabs={[
              {
                name: "description",
                title: "Beschrijving",
                className: "tab-description",
              },
              {
                name: "faq",
                title: "FAQ",
                className: "tab-faq",
              },
              {
                name: "changelog",
                title: "Changelog",
                className: "tab-changelog",
              },
            ]}
          >
            {(tab) => (
              <div
                style={{ padding: "10px", height: "450px", overflowY: "auto" }}
              >
                {tab.name === "description" && (
                  <div>
                    <div>{SplitLongDescription(sub.long_description)}</div>
                  </div>
                )}
                {tab.name === "faq" && (
                  <div>
                    <Text>Frequently Asked Questions</Text>
                    <ul></ul>
                  </div>
                )}
                {tab.name === "changelog" && (
                  <div>
                    <Text>Changelog</Text>
                    <ul>
                      <li>{sub.version}</li>
                    </ul>
                  </div>
                )}
              </div>
            )}
          </TabPanel>
        </div>

        {/* Sidebar */}
        <div
          style={{
            backgroundColor: "#f0f0f0",
            padding: "10px",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          <Text>
            <strong>Versie</strong>
          </Text>
          <Text>{sub.version}</Text>
          <Text>
            <strong>Auteur</strong>
          </Text>
          <Text>{sub.author}</Text>
        </div>
      </Grid>

      <div
        style={{
          borderTop: "1px solid #ddd",
          display: "flex",
          justifyContent: "flex-end",
          position: "sticky",
          bottom: 0,
        }}
      >
        {loggedIn ? (
          <>
            {status === "1" ? (
              <Button variant="secondary" onClick={handleUnsub}>
                Unsubscribe
              </Button>
            ) : (
              <Button variant="primary" onClick={handlePurchase}>
                Subscribe
              </Button>
            )}
          </>
        ) : (
          <Text>You need to log in to subscribe.</Text>
        )}
      </div>
    </Modal>
  );
};

export default InfoModal;
