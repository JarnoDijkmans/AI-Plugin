import { useState, useEffect } from "@wordpress/element";
import {
  __experimentalGrid as Grid,
  Button,
  TextControl,
  Flex,
  Spinner,
} from "@wordpress/components";
import { useLandingsPage } from "../../context/landingspage-context";
import SliderComponent from "../../components/landingspage/slidercomponent";
import TemplateSelector from "../../components/landingspage/template-selector";
import TextareaPreview from "../../components/landingspage/textarea-preview";
import LocationManager from "../../components/landingspage/location-manager";
import GetPlainTextTemplate from "../../components/landingspage/plaintext-template";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleCheck,
  faCircleXmark,
} from "@fortawesome/free-solid-svg-icons";

const LandingsPageModal = () => {
  const [selectedText, setSelectedText] = useState("");
  const [selectedIndex, setSelectedIndex] = useState("");
  const [modifier, setModifier] = useState("");
  const [text, setText] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [templates, setTemplates] = useState([]);
  const [locationChecked, setLocationChecked] = useState(false);
  const [numberPages, setNumberPages] = useState("");
  const [data, setData] = useState([]);
  const [dataset, setDataset] = useState([]);

  const {
    locations,
    setLocations,
    newLocation,
    setNewLocation,
    addLocation,
    removeLocation,
    setTemplateId,
    generateLocations,
    generateLandingspage,
    errorText,
    loading,
    generationComplete,
    setGenerationComplete,
  } = useLandingsPage();

  // Fetch templates for TemplateSelector
  useEffect(() => {
    fetch(`/wp-json/wp/v2/yooker_ai_templates?_fields=id,title`)
      .then((response) => response.json())
      .then((posts) => setTemplates(posts))
      .catch((error) => console.error("Error loading data:", error));
  }, []);

  // Fetch content for TextareaPreview
  useEffect(() => {
    if (!selectedTemplate) {
      setText("");
      return;
    }
    GetPlainTextTemplate({ selectedTemplate, setText });
  }, [selectedTemplate]);

  const resetInput = () => {
    setSelectedText("");
    setSelectedIndex(null);
    setNumberPages("");
    setModifier("");
    setLocations([]);
    setLocationChecked(false);
  };

  const isDuplicateChange = (changes, from, to, selectedIndex) => {
    return changes.some(
      (change) =>
        change.from === from &&
        change.to === to &&
        change.selectedIndex.start === selectedIndex.start &&
        change.selectedIndex.end === selectedIndex.end
    );
  };

  const storeData = () => {
    if (!selectedText?.trim()) {
      console.log("Please select text to store.");
      return;
    }
    const trimmedText = selectedText.trim();
    const changes = [...data.flatMap((d) => d.changes)];

    if (locationChecked && locations?.length > 0) {
      locations.forEach((location) => {
        const trimmedLocation = location.trim();
        if (
          !isDuplicateChange(
            changes,
            trimmedText,
            trimmedLocation,
            selectedIndex
          )
        ) {
          changes.push({
            from: trimmedText,
            to: trimmedLocation,
            selectedIndex,
          });
        }
      });
    }

    const trimmedModifier = modifier.trim();
    if (
      trimmedModifier &&
      !isDuplicateChange(changes, trimmedText, trimmedModifier, selectedIndex)
    ) {
      changes.push({
        from: trimmedText,
        to: trimmedModifier,
        selectedIndex,
      });
    }

    const newData = {
      locationChecked,
      changes,
      numberPages: locations?.length || 0,
    };

    setData((prevData) => [...prevData, newData]);
    resetInput();
  };

  const createDataset = () => {
    let newData = null;

    if (selectedText && (modifier || locations)) {
      const trimmedText = selectedText.trim();
      const changes = []; // Initialize changes array for this dataset only

      // Process locations
      if (locationChecked && locations?.length > 0) {
        locations.forEach((location) => {
          const trimmedLocation = location.trim();
          if (
            !isDuplicateChange(
              changes,
              trimmedText,
              trimmedLocation,
              selectedIndex
            )
          ) {
            changes.push({
              from: trimmedText,
              to: trimmedLocation,
              selectedIndex,
            });
          }
        });
      }

      // Process modifier
      if (modifier) {
        const trimmedModifier = modifier.trim();
        if (
          !isDuplicateChange(
            changes,
            trimmedText,
            trimmedModifier,
            selectedIndex
          )
        ) {
          changes.push({
            from: trimmedText,
            to: trimmedModifier,
            selectedIndex,
          });
        }
      }

      newData = {
        locationChecked,
        changes,
        numberPages: locationChecked ? locations?.length || 0 : 0,
        status: "In wachrij",
      };
    }

    if (newData) {
      setGenerationComplete(false);
      setData((prevData) => [...prevData, newData]);
    }

    if (data.length > 0 || newData) {
      const consolidatedData = {
        dataset: [...data, ...(newData ? [newData] : [])],
      };

      setDataset((prev) => [...prev, consolidatedData]);
      setData([]);
    }
    resetInput();
  };

  return (
    <div>
      <Grid columns={2}>
        <div>
          <TemplateSelector
            selectedTemplate={selectedTemplate}
            setSelectedTemplate={setSelectedTemplate}
            templates={templates}
            setTemplateId={setTemplateId}
          />

          {selectedTemplate && (
            <>
              <TextControl
                label="Van"
                value={selectedText}
                readOnly
                style={{ width: "100%" }}
              />
              {!data.some((item) => item.locationChecked) && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <label>
                    <input
                      type="checkbox"
                      checked={locationChecked}
                      onChange={() => setLocationChecked(!locationChecked)}
                      style={{ marginRight: "5px" }}
                    />
                    Locatie?
                  </label>
                  {locationChecked && (
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <span style={{ marginRight: "5px" }}>
                        Aantal pagina's:
                      </span>
                      <TextControl
                        type="number"
                        style={{ width: "60px", marginLeft: "5px" }}
                        value={numberPages}
                        onChange={(value) => {
                          const parsedValue = parseInt(value, 10);
                          setNumberPages(
                            parsedValue >= 1 && parsedValue <= 10
                              ? parsedValue
                              : ""
                          );
                        }}
                      />
                    </div>
                  )}
                </div>
              )}
              <label className="components-base-control__label css-2o4jwd ej5x27r2">
                NAAR
              </label>
              <Flex style={{ alignItems: "baseline" }}>
                <TextControl
                  value={modifier}
                  onChange={(value) => setModifier(value)}
                  style={{ width: "100%" }}
                />
                {locationChecked && (
                  <Button
                    onClick={() => {
                      if (modifier && numberPages) {
                        generateLocations(
                          modifier,
                          Math.max(0, numberPages - 1)
                        );
                      }
                    }}
                    className="button button-primary"
                  >
                    Generate
                  </Button>
                )}
              </Flex>
              <Button
                onClick={storeData}
                className="button"
                style={{ width: "100%" }}
              >
                Meer aanpassen?
              </Button>
            </>
          )}
        </div>
        <div>
          <TextareaPreview
            text={text}
            handleSelection={(e) => {
              const textarea = e.target;
              const selectionStart = textarea.selectionStart;
              const selectionEnd = textarea.selectionEnd;
              const selectedText = textarea.value.substring(
                selectionStart,
                selectionEnd
              );
              setSelectedText(selectedText);
              setSelectedIndex({ start: selectionStart, end: selectionEnd });
            }}
          />
        </div>
      </Grid>
      <Grid columns={2} style={{ gridTemplateColumns: "1fr 1fr" }}>
        <div>
          {errorText ? (
            <textarea
              value={errorText}
              readOnly
              style={{
                marginTop: "10px",
                color: "#cc1818",
                borderColor: "#cc1818",
                width: "100%",
                height: "100px",
              }}
            />
          ) : (
            <LocationManager
              locations={locations}
              newLocation={newLocation}
              setNewLocation={setNewLocation}
              addLocation={addLocation}
              removeLocation={removeLocation}
            />
          )}
        </div>
        <div style={{ position: "relative" }}>
          {loading ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "50px",
              }}
            >
              <Spinner
                style={{ color: "#3553c8", width: "20%", height: "20%" }}
              />
            </div>
          ) : generationComplete ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "50px",
              }}
            >
              {errorText ? (
                <FontAwesomeIcon
                  icon={faCircleXmark}
                  style={{ color: "#d32f2f", width: "20%", height: "20%" }}
                />
              ) : (
                <FontAwesomeIcon
                  icon={faCircleCheck}
                  style={{ color: "#3553c8", width: "20%", height: "20%" }}
                />
              )}
            </div>
          ) : (
            dataset.length > 0 && <SliderComponent dataset={dataset} />
          )}
        </div>
      </Grid>
      <Grid columns={2} style={{ gridTemplateColumns: "1fr 1fr" }}>
        <div>
          {data.length > 0 || (modifier && selectedText) ? (
            <Button
              className="button"
              onClick={createDataset}
              style={{ width: "100%", marginTop: "3rem" }}
            >
              Toevoegen aan wachtrij
            </Button>
          ) : null}
        </div>
        <div>
          {dataset.length > 0 && (
            <Button
              className="button button-primary"
              onClick={() => {
                setGenerationComplete(false);
                generateLandingspage(dataset);
                setDataset([]);
                setData([]);
              }}
              style={{ width: "100%", marginTop: "3rem" }}
              disabled={loading}
            >
              Genereren
            </Button>
          )}
        </div>
      </Grid>
    </div>
  );
};

export default LandingsPageModal;
