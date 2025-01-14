import { __ } from "@wordpress/i18n";

export const ValidateFields = ({
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
}) => {
  const newErrors = {};
  if (!firstName) newErrors.firstName = __("Voornaam is verplicht", "ai");
  if (!lastName) newErrors.lastName = __("Achternaam is verplicht", "ai");
  if (!emailadres) newErrors.emailadres = __("E-mailadres is verplicht", "ai");
  if (!companyName)
    newErrors.companyName = __("Bedrijfsnaam is verplicht", "ai");
  if (!phoneNumber)
    newErrors.phoneNumber = __("Telefoonnummer is verplicht", "ai");
  if (!address) newErrors.address = __("Adres is verplicht", "ai");
  if (!zipCode) newErrors.zipCode = __("Postcode is verplicht", "ai");
  if (!town) newErrors.town = __("Stad/dorp is verplicht", "ai");
  if (!country) newErrors.country = __("Land is verplicht", "ai");
  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};
