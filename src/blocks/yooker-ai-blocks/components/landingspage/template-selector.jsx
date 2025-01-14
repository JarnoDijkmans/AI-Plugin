import { SelectControl } from "@wordpress/components";
import { useEffect } from "@wordpress/element";

const TemplateSelector = ({
  selectedTemplate,
  setSelectedTemplate,
  templates,
  setTemplateId,
}) => {
  useEffect(() => {
    if (selectedTemplate) {
      setTemplateId(selectedTemplate);
    }
  }, [selectedTemplate, setTemplateId]);

  return (
    <SelectControl
      label="Selecteer landingspagina"
      value={selectedTemplate}
      options={[
        { label: "Selecteer landingspagina...", value: "" },
        ...templates.map((post) => ({
          label: post.title.rendered,
          value: post.id,
        })),
      ]}
      onChange={(value) => setSelectedTemplate(value)}
    />
  );
};

export default TemplateSelector;
