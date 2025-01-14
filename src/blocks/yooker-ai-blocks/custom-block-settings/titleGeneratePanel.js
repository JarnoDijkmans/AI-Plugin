import { Fragment } from "@wordpress/element";
import { PluginDocumentSettingPanel } from "@wordpress/editor";
import { useEffect, useState } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import useGenerateTitle from "../components/generate-title";
import {
  TextControl,
  Button,
  __experimentalGrid as Grid,
  TextareaControl,
} from "@wordpress/components";
import { useSelect, dispatch, select } from "@wordpress/data";
import TooltipIcon from "../components/TooltipIcon";

export const TitleGeneratePanel = ({ credentials }) => {
  const [aggregatedContent, setAggregatedContent] = useState("");
  const [activateCustomInput, setActivateCustomInput] = useState(false);
  const [generateInput, setGenerateInput] = useState("");
  const { postId, postType } = useSelect((select) => {
    const editorSelect = select("core/editor");
    return {
      postId: editorSelect.getCurrentPostId(),
      postType: editorSelect.getCurrentPostType() || "",
    };
  });
  const { handleGenerate, inProgress, outputChatGPT, errorMessage } =
    useGenerateTitle(
      aggregatedContent || "",
      generateInput || "",
      postId,
      postType,
      credentials
    );

  const paragraphBlocks = useSelect((select) => {
    const blocks = select("core/block-editor").getBlocks();
    return blocks.filter((block) => block.name === "core/paragraph");
  }, []);

  useEffect(() => {
    const newAggregatedContent = paragraphBlocks
      .map((block) => block.attributes.content || "")
      .join("\n");

    setAggregatedContent(newAggregatedContent);
  }, [paragraphBlocks]);

  useEffect(() => {
    if (outputChatGPT && outputChatGPT !== generateInput) {
      setGenerateInput(outputChatGPT);
    }
  }, [outputChatGPT]);

  const insertNewContent = () => {
    dispatch("core/editor").editPost({ title: generateInput });
    setGenerateInput("");
  };

  const handleActivateCustomInput = () => {
    setActivateCustomInput(true);
  };

  const handleDeactivateCustomInput = () => {
    setActivateCustomInput(false);
  };

  const handleGenerateAndSet = async () => {
    await handleGenerate();
    setActivateCustomInput(true);
  };

  return (
    <Fragment>
      <PluginDocumentSettingPanel
        name="yooker-generate-title"
        title="Yooker Title Generator"
        className="custom-panel"
      >
        {activateCustomInput && (
          <TextControl
            label={__("Generate Input", "yai")}
            value={generateInput}
            onChange={(newval) => setGenerateInput(newval)}
          />
        )}
        <TooltipIcon type={"title"} />
        <Grid column={2}>
          {generateInput && generateInput.trim() !== "" && (
            <Button variant="primary" onClick={insertNewContent}>
              {__("Insert Title", "yai")}
            </Button>
          )}
          {!activateCustomInput && (
            <Button variant="secondary" onClick={handleActivateCustomInput}>
              {__("Extra details", "yai")}
            </Button>
          )}
          {activateCustomInput && !generateInput && (
            <Button variant="secondary" onClick={handleDeactivateCustomInput}>
              {__("Geen extra details", "yai")}
            </Button>
          )}
          <Button
            variant="primary"
            disabled={inProgress}
            onClick={handleGenerateAndSet}
          >
            {inProgress
              ? __("Generating...", "yai")
              : __("Generate Title", "yai")}
          </Button>
        </Grid>
        {errorMessage && (
          <TextareaControl
            value={errorMessage}
            style={{
              marginTop: "10px",
              color: "#cc1818",
              borderColor: "#cc1818",
            }}
          />
        )}
      </PluginDocumentSettingPanel>
    </Fragment>
  );
};
