import { useState, useEffect } from "@wordpress/element";
import { SelectControl, Spinner, Button } from "@wordpress/components";
import useImportLandingspage from "../../components/landingspage/import-landingspage";
import WpService from "../../services/wp-service";

const LandingsPageImportModal = () => {
  const [selectedLandingspage, setSelectedLandingspage] = useState(null);
  const [data, setData] = useState([]);
  const { handleImport, loading } = useImportLandingspage();

  useEffect(() => {
    WpService.getAllLandingspages()
      .then((result) => {
        setData(result);
      })
      .catch((error) => console.error("Error loading data:", error));
  }, []);

  const importLandingspage = () => {
    const selectedPost = data.find(
      (post) => post.title === selectedLandingspage
    );

    if (!selectedPost) {
      console.error("Selected post not found.");
      return;
    }

    handleImport(selectedPost);
  };

  return (
    <div>
      <SelectControl
        label="Selecteer landingspagina"
        value={selectedLandingspage}
        options={[
          { label: "Selecteer landingspagina...", value: "" },
          ...data.map((post) => ({ label: post.title, value: post.id })),
        ]}
        onChange={(value) => setSelectedLandingspage(value)}
      />
      {selectedLandingspage && (
        <Button
          variant="primary"
          onClick={importLandingspage}
          style={{ marginTop: "20px" }}
          className="button button-primary"
        >
          Import Landingspage
        </Button>
      )}

      {loading && (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Spinner style={{ width: "3em", height: "3em" }} />
        </div>
      )}
    </div>
  );
};

export default LandingsPageImportModal;
