import { useState } from "@wordpress/element";
import LandingsPageModal from "../pages/modals/landingsPageModal";
import LandingsPageModal2 from "../pages/modals/landingsPageModal2";
import TooltipIcon from "../components/TooltipIcon";

export const LandingsPageSettings = () => {
  const [selectedGenerator, setSelectedGenerator] = useState(1);

  const handleGeneratorChange = (version) => {
    setSelectedGenerator(version);
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "10px",
        }}
      >
        <div style={{ display: "flex", gap: "20px", margin: "0 auto" }}>
          <button
            onClick={() => handleGeneratorChange(1)}
            style={{
              backgroundColor: "transparent",
              color: selectedGenerator === 1 ? "blue" : "#000",
              border: "none",
              cursor: "pointer",
            }}
          >
            Version 1
          </button>
          <button
            onClick={() => handleGeneratorChange(2)}
            style={{
              backgroundColor: "transparent",
              color: selectedGenerator === 2 ? "blue" : "#000",
              border: "none",
              cursor: "pointer",
            }}
          >
            Version 2
          </button>
        </div>

        <TooltipIcon
          type={selectedGenerator === 1 ? "landingspage" : "landingspage2"}
        />
      </div>

      <div style={{ marginTop: "10px" }}>
        {selectedGenerator === 1 && <LandingsPageModal />}
        {selectedGenerator === 2 && <LandingsPageModal2 />}
      </div>
    </div>
  );
};
