import { useState, useEffect } from "@wordpress/element";
import {
  SelectControl,
  TextareaControl,
  __experimentalGrid as Grid,
  Button,
  TextControl,
  __experimentalText as Text,
} from "@wordpress/components";
import OptionsLandingspage from "../../components/landingspage/options-landingspage";
import { useLandingsPage } from "../../context/landingspage-context";
import TemplateSelector from "../../components/landingspage/template-selector";

const LandingsPageModal2 = () => {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [selectedContent, setSelectedContent] = useState([]);
  const [modifiedContent, setModifiedContent] = useState("");
  const [templates, setTemplates] = useState([]);
  const [postContent, setPostContent] = useState("");
  const [paragraphOptions, setParagraphOptions] = useState([]);
  const [options, setOptions] = useState({});
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const {
    landingspage,
    addNewLandingPage,
    generateLandingspage2,
    cancelLandingPage,
    setTemplateId,
    errorText,
  } = useLandingsPage();

  useEffect(() => {
    fetch(`/wp-json/wp/v2/yooker_ai_templates?_fields=id,title`)
      .then((response) => response.json())
      .then((posts) => setTemplates(posts))
      .catch((error) => console.error("Error loading data:", error));
  }, []);

  useEffect(() => {
    if (!selectedTemplate) {
      setParagraphOptions([]);
      setSelectedContent([]);
      setModifiedContent("");
      return;
    }

    fetch(`/wp-json/wp/v2/yooker_ai_templates/${selectedTemplate}`)
      .then((response) => response.json())
      .then((post) => {
        const content = post.content.rendered || "";

        const paragraphs = content.match(/<p>(.*?)<\/p>/g) || [];
        const nonEmptyParagraphs = paragraphs
          .map((paragraph) => paragraph.replace(/<\/?p>/g, "").trim())
          .filter((paragraph) => paragraph.length > 0);

        const options = nonEmptyParagraphs.map((paragraph, index) => {
          const shortText =
            paragraph.length > 35
              ? paragraph.substring(0, 35) + "..."
              : paragraph;
          return { label: `Blok ${index + 1}: ${shortText}`, value: index };
        });

        setPostContent(content);
        setParagraphOptions(options);
      })
      .catch((error) => console.error("Error fetching post content:", error));
  }, [selectedTemplate]);

  const handleBlockChange = (selectedValues) => {
    setSelectedContent(selectedValues);

    const paragraphs = postContent.match(/<p>(.*?)<\/p>/g) || [];
    const selectedParagraphs = selectedValues
      .map((index) => paragraphs[index].replace(/<\/?p>/g, ""))
      .join("\n\n");

    setModifiedContent(selectedParagraphs);
  };

  const handleAddNew = () => {
    const title = `Landingspage: ${Object.values(options)
      .filter((value) => value)
      .join(" | ")}`;

    const newLandingPage = {
      template: selectedTemplate,
      title: title,
      modifiedContent: modifiedContent,
      options: options,
      status: "In wachtrij...",
    };

    addNewLandingPage(newLandingPage);
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
          {selectedContent.length > 0 && (
            <OptionsLandingspage setOptions={setOptions} />
          )}
        </div>
        <div>
          <SelectControl
            label="Selecteer blok(ken) om te genereren"
            multiple
            value={selectedContent}
            options={paragraphOptions}
            onChange={handleBlockChange}
          />
          <TextareaControl
            label="Geselecteerde Inhoud"
            value={modifiedContent}
            readOnly
            rows={10}
          />
        </div>
      </Grid>
      <Grid columns={2}>
        <div style={{ padding: "10px" }}>
          {Object.values(options).every((value) => value === "") ? (
            <div />
          ) : (
            <div>
              <Grid columns={2}>
                <Button className="button" onClick={handleAddNew}>
                  Add new
                </Button>
                <Button
                  className="button"
                  onClick={generateLandingspage2}
                  disabled={landingspage.length === 0}
                >
                  Start
                </Button>
              </Grid>
            </div>
          )}
        </div>
        <div>
          {errorText ? (
            <textarea
              value={errorText}
              readOnly
              style={{
                width: "100%",
                height: "150px",
                color: "red",
                border: "1px solid red",
                padding: "10px",
                fontSize: "16px",
              }}
            />
          ) : (
            <table
              className="wp-list-table widefat fixed striped"
              style={{ width: "100%" }}
            >
              <thead>
                <tr>
                  <th style={{ textAlign: "left" }}>Landingspagina</th>
                  <th style={{ textAlign: "center" }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {landingspage.map((page, index) => (
                  <tr
                    key={index}
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                    <td style={{ borderBottom: "1px solid #ccc" }}>
                      {page.title}
                    </td>
                    <td
                      style={{
                        textAlign: "center",
                        borderBottom: "1px solid #ccc",
                        cursor: "pointer",
                      }}
                      onClick={() => cancelLandingPage(index)}
                    >
                      {hoveredIndex === index &&
                      page.status !== "Finished" &&
                      page.status !== "Generating..."
                        ? "Cancel"
                        : page.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </Grid>
    </div>
  );
};

export default LandingsPageModal2;
