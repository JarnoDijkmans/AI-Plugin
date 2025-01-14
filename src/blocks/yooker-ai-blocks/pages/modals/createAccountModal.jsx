import { useState } from "@wordpress/element";
import {
  Modal,
  Button,
  TextControl,
  __experimentalGrid as Grid,
  Notice,
} from "@wordpress/components";
import UserService from "../../services/user-service";
import { ValidateFields } from "../../error-handling/validateFields";
import "../../../../sass/custom/accountCreateModal.css";

const CreateAccount = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  // Account form fields state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [lastNamePrefix, setLastNamePrefix] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [emailadres, setEmailadres] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [town, setTown] = useState("");
  const [country, setCountry] = useState("");
  const [errors, setErrors] = useState({});

  // Track account creation success
  const [accountCreated, setAccountCreated] = useState(false);

  const save = () => {
    const isValid = ValidateFields({
      firstName,
      lastName,
      emailadres,
      companyName,
      phoneNumber,
      address,
      zipCode,
      town,
      country,
      setErrors,
    });

    if (isValid) {
      const userData = {
        first_name: firstName,
        last_name: lastName,
        surnameprefix: lastNamePrefix,
        email: emailadres,
        company: companyName,
        phonenumber: phoneNumber,
        address: address,
        zipcode: zipCode,
        town: town,
        country: country,
      };

      UserService.CreateUser(userData)
        .then((result) => {
          if (result.success) {
            changeOptions("yookeraiusername", result.data.username);
            changeOptions("yookeraiapikey", result.data.apppass);
            setAccountCreated(true);
          } else {
            console.error("Error creating user: ", result.message);
          }
        })
        .catch((error) => {
          console.error("Error creating user: ", error);
        });
    }
  };

  const changeOptions = (option, value) => {
    const settings = new wp.api.models.Settings({
      [option]: value,
    });

    settings.save().catch((error) => {
      console.error("Error saving settings:", error);
    });
  };

  return (
    <Modal
      title={accountCreated ? "Account Created!" : "Nog geen account?"}
      onRequestClose={onClose}
      shouldCloseOnClickOutside={false}
    >
      {Object.keys(errors).length > 0 && (
        <Notice status="error" onRemove={() => setErrors({})} isDismissible>
          <p>{Object.values(errors)[0]}</p>
        </Notice>
      )}

      {accountCreated ? (
        <div>
          <p>
            Your account has been successfully created! Please check your email
            for login details.
          </p>
          <Button variant="primary" onClick={onClose}>
            Close
          </Button>
        </div>
      ) : (
        <>
          <Grid columns={3} gap={4}>
            <TextControl
              label="Voornaam"
              value={firstName}
              onChange={(value) => setFirstName(value)}
              help={errors.firstName}
            />
            <TextControl
              label="Tussenvoegsel"
              value={lastNamePrefix}
              onChange={(value) => setLastNamePrefix(value)}
            />
            <TextControl
              label="Achternaam"
              value={lastName}
              onChange={(value) => setLastName(value)}
              help={errors.lastName}
            />
          </Grid>

          <Grid columns={1}>
            <TextControl
              label="E-mailadres"
              value={emailadres}
              onChange={(value) => setEmailadres(value)}
              help={errors.emailadres}
            />
            <TextControl
              label="Bedrijfsnaam"
              value={companyName}
              onChange={(value) => setCompanyName(value)}
              help={errors.companyName}
            />
            <TextControl
              label="Telefoonnummer"
              value={phoneNumber}
              onChange={(value) => setPhoneNumber(value)}
              help={errors.phoneNumber}
            />
            <TextControl
              label="Adres"
              value={address}
              onChange={(value) => setAddress(value)}
              help={errors.address}
            />
          </Grid>

          <Grid columns={3} gap={4}>
            <TextControl
              label="Postcode"
              value={zipCode}
              onChange={(value) => setZipCode(value)}
              help={errors.zipCode}
            />
            <TextControl
              label="Stad/dorp"
              value={town}
              onChange={(value) => setTown(value)}
              help={errors.town}
            />
            <TextControl
              label="Land"
              value={country}
              onChange={(value) => setCountry(value)}
              help={errors.country}
            />
          </Grid>

          <Button variant="primary" onClick={save}>
            Create account
          </Button>
        </>
      )}
    </Modal>
  );
};

export default CreateAccount;
