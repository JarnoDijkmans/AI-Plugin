import {
  Flex,
  FlexItem,
  TextControl,
  Button,
  Card,
  CardHeader,
  CardBody,
  Spinner,
} from "@wordpress/components";
import { useState, useEffect } from "@wordpress/element";
import AdminOptions from "../services/admin-option-service";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import yookerLogo from "../../../../assets/images/yooker_icon.png";
import CreateAccountModal from "../pages/modals/createAccountModal";

function Login() {
  const [isAPILoaded, setIsAPILoaded] = useState(false);
  const [localYookeraiUsername, setLocalYookeraiUsername] = useState("");
  const [localYookeraiApiKey, setLocalYookeraiApiKey] = useState("");
  const [localAIKEY, setLocalAIKEY] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [createAccountModal, setCreateAccountModal] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prevState) => !prevState);
  };

  // Load settings when the component mounts
  const fetchOptions = () => {
    if (!isAPILoaded) {
      AdminOptions.GetSettings()
        .then((response) => {
          setLocalYookeraiUsername(response.yookeraiusername);
          setLocalYookeraiApiKey(response.yookeraiapikey);
          setLocalAIKEY(response.chatGPTAPIKEY);
          setIsAPILoaded(true);
        })
        .catch((error) => {
          console.error("Failed to load API settings:", error);
        });
    }
  };

  useEffect(() => {
    fetchOptions();
  }, [isAPILoaded]);

  // Function to update settings
  const changeOptions = (option, value) => {
    const settings = new wp.api.models.Settings({
      [option]: value,
    });
    settings
      .save()
      .then(() => {})
      .catch((error) => {
        console.error("Error saving settings:", error);
      });
  };

  const openCreateAccountModal = () => {
    setCreateAccountModal(true);
  };

  const closeCreateAccountModal = () => {
    setCreateAccountModal(false);
  };

  return (
    <>
      <Card
        style={{
          width: "30%",
          marginLeft: "auto",
          marginRight: "auto",
          marginTop: "2rem",
        }}
      >
        <CardHeader
          style={{
            justifyContent: "center",
          }}
        >
          <img
            src={yookerLogo}
            alt="Yooker Logo"
            style={{ width: "3em", height: "3em" }}
          />
        </CardHeader>

        <CardBody>
          {!isAPILoaded ? (
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Spinner style={{ width: "3em", height: "3em" }} />
            </div>
          ) : (
            <Flex>
              <FlexItem style={{ width: "100%" }}>
                <TextControl
                  label="Gebruikersnaam"
                  value={localYookeraiUsername}
                  id="yookeraiusername"
                  type="text"
                  onChange={(nextValue) => {
                    setLocalYookeraiUsername(nextValue);
                    changeOptions("yookeraiusername", nextValue);
                  }}
                />
                <TextControl
                  label="API key"
                  value={localYookeraiApiKey}
                  onChange={(nextValue) => {
                    setLocalYookeraiApiKey(nextValue);
                    changeOptions("yookeraiapikey", nextValue);
                  }}
                />
                <label className="css-2o4jwd"> ChatGPT API Key</label>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    width: "100%",
                  }}
                >
                  <input
                    label="AI key"
                    value={localAIKEY}
                    onChange={(event) => {
                      const nextValue = event.target.value; // Extract the value
                      setLocalAIKEY(nextValue);
                      changeOptions("chatGPTAPIKEY", nextValue);
                    }}
                    className="components-text-control__input"
                    type={isPasswordVisible ? "text" : "password"}
                    style={{ flexGrow: 1 }}
                  />

                  <Button
                    onClick={togglePasswordVisibility}
                    style={{ marginLeft: "8px", flexShrink: 0 }}
                    aria-label={
                      isPasswordVisible ? "Hide AI Key" : "Show AI Key"
                    }
                  >
                    {isPasswordVisible ? (
                      <FontAwesomeIcon icon={faEyeSlash} />
                    ) : (
                      <FontAwesomeIcon icon={faEye} />
                    )}
                  </Button>
                </div>
                <Button
                  style={{ color: "royalblue", textDecoration: "underline" }}
                  onClick={() => {
                    openCreateAccountModal();
                  }}
                >
                  Geen account? Klik hier
                </Button>
              </FlexItem>
            </Flex>
          )}
        </CardBody>
      </Card>
      {createAccountModal && (
        <CreateAccountModal
          isOpen={createAccountModal}
          onClose={closeCreateAccountModal}
        />
      )}
    </>
  );
}

export default Login;
