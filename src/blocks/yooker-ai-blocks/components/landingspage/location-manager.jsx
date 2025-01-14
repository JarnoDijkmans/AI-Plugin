import {
  TextControl,
  Button,
  __experimentalText as Text,
} from "@wordpress/components";

const LocationManager = ({
  locations,
  newLocation,
  setNewLocation,
  addLocation,
  removeLocation,
}) => {
  return (
    <>
      {locations.length > 0 && (
        <>
          <Text as="h4">Gevonden Locaties Rondom Omgeving</Text>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "10px",
              marginTop: "10px",
              alignItems: "center",
            }}
          >
            {locations.map((location, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  alignItems: "center",
                  backgroundColor: "#f3f3f3",
                  borderRadius: "15px",
                  padding: "5px 10px",
                }}
              >
                <span style={{ marginRight: "10px" }}>{location}</span>
                <Button
                  onClick={() => {
                    removeLocation(index);
                  }}
                  style={{
                    backgroundColor: "transparent",
                    border: "none",
                    padding: "0",
                    cursor: "pointer",
                  }}
                >
                  ✕
                </Button>
              </div>
            ))}

            <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <TextControl
                placeholder="Add..."
                value={newLocation}
                onChange={(value) => setNewLocation(value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    addLocation();
                  }
                }}
                style={{
                  borderRadius: "15px",
                }}
              />
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default LocationManager;
