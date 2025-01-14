import { useState, useEffect } from "@wordpress/element";
import {
  __experimentalGrid as Grid,
  __experimentalText as Text,
  __experimentalHeading as Heading,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
  FormToggle,
} from "@wordpress/components";

import yookerLogo from "../../../../assets/images/yooker_icon.png";
import InfoModal from "../pages/modals/infoModal";
import CreateAccountModal from "../pages/modals/createAccountModal";
import SubService from "../services/sub-service";
import AdminOptions from "../services/admin-option-service";

const Subs = () => {
  const [subs, setSubs] = useState([]);
  const [username, setUsername] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [toggleStates, setToggleStates] = useState({});
  const [notifications, setNotifications] = useState({});
  const [isCreateAccountModalOpen, setIsCreateAccountModalOpen] =
    useState(false);
  const [selectedSub, setSelectedSub] = useState(null);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);

  const fetchSubs = () => {
    if (username && apiKey) {
      SubService.getAuthenticatedSubs(username, apiKey)
        .then((response) => {
          if (response) {
            setLoggedIn(true);
            setSubs(response);
            const { toggleStates, notifications } = response.reduce(
              (acc, { id, status, end_date }) => {
                acc.toggleStates[id] = status === "1"; // Toggle on for active subscriptions
                if (status === "2") {
                  const formattedDate = new Date(end_date)
                    .toISOString()
                    .split("T")[0];
                  acc.notifications[
                    id
                  ] = `Contract aflopend, Eind datum: ${formattedDate}.`;
                }
                return acc;
              },
              { toggleStates: {}, notifications: {} }
            );
            setToggleStates(toggleStates);
            setNotifications(notifications);
          } else {
            fetchUnAuthenticatedSubs();
          }
        })
        .catch((error) => {
          console.log("Error fetching authenticated subscriptions:", error);
          fetchUnAuthenticatedSubs();
        });
    } else {
      fetchUnAuthenticatedSubs();
    }
  };

  const fetchUnAuthenticatedSubs = () => {
    SubService.getUnAuthenticatedSubs()
      .then((unauthSubs) => {
        setSubs(unauthSubs);
      })
      .catch((error) => {
        console.error(
          "Something went wrong with fetching UnAuthenticated Subscriptions",
          error
        );
        setSubs([]);
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

  const handleToggleChange = (sub) => {
    if (!loggedIn) {
      setIsCreateAccountModalOpen(true);
    } else {
      setSelectedSub(sub);
      setIsInfoModalOpen(true);
    }
  };

  const openInfoModal = (sub) => {
    setSelectedSub(sub);
    setIsInfoModalOpen(true);
  };

  const closeInfoModal = () => {
    setIsInfoModalOpen(false);
    setSelectedSub(null);
  };

  const closeCreateAccountModal = () => {
    setIsCreateAccountModalOpen(false);
  };

  useEffect(() => {
    fetchOptions();
  }, []);

  useEffect(() => {
    fetchSubs();
  }, [username, apiKey]);

  return (
    <>
      <Grid columns={3}>
        {subs.map((sub) => (
          <Card key={sub.id} style={{ margin: "15px" }}>
            <CardHeader>
              <Heading level={4}>
                <img
                  src={yookerLogo}
                  alt="Yooker Logo"
                  style={{ width: "40px", height: "40px" }}
                />
              </Heading>
            </CardHeader>
            <CardBody>
              <Text>{sub.name}</Text>
            </CardBody>
            <CardBody>
              <Text>{sub.short_description}</Text>
            </CardBody>
            <CardFooter>
              <Grid
                columns={3}
                style={{
                  alignItems: "center",
                  justifyItems: "center",
                  width: "100%",
                }}
              >
                <Button variant="secondary" onClick={() => openInfoModal(sub)}>
                  More info
                </Button>
                <Text style={{ fontSize: "1.2em" }}>€{sub.price}</Text>
                <FormToggle
                  checked={toggleStates[sub.id] || false}
                  onChange={() => handleToggleChange(sub)}
                />
              </Grid>
            </CardFooter>
            <div
              style={{
                marginLeft: "auto",
                marginRight: "auto",
                width: "fit-content",
              }}
            >
              {notifications[sub.id] && <Text>{notifications[sub.id]}</Text>}
            </div>
          </Card>
        ))}
      </Grid>

      {isInfoModalOpen && (
        <InfoModal
          isOpen={isInfoModalOpen}
          onClose={closeInfoModal}
          selectedSubId={selectedSub.id}
          loggedIn={loggedIn}
          status={selectedSub.status || "3"}
          refresh={fetchSubs}
        />
      )}

      {isCreateAccountModalOpen && (
        <CreateAccountModal
          isOpen={isCreateAccountModalOpen}
          onClose={closeCreateAccountModal}
        />
      )}
    </>
  );
};

export default Subs;
