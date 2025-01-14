import { createHigherOrderComponent } from "@wordpress/compose";
import {
  TextControl,
  Button,
  __experimentalGrid as Grid,
  PanelBody,
  TextareaControl,
} from "@wordpress/components";
import { InspectorControls } from "@wordpress/block-editor";
import { useEffect, useState, Fragment } from "@wordpress/element";
import { addFilter } from "@wordpress/hooks";
import { __ } from "@wordpress/i18n";
import useGenerateHeader from "../components/generate-header";
import { createBlock } from "@wordpress/blocks";
import { dispatch, select, useSelect } from "@wordpress/data";
import TooltipIcon from "../components/TooltipIcon";

export function HeaderGenerateSettings({ credentials }) {
  function addCoverHeaderAttribute(settings, name) {
    if (typeof settings.attributes !== "undefined" && name === "core/heading") {
      settings.attributes = {
        ...settings.attributes,
        generateInput: { type: "string", default: "" },
      };
    }
    return settings;
  }
  addFilter(
    "blocks.registerBlockType",
    "yai/cover-custom-header-attribute",
    addCoverHeaderAttribute
  );

  const coverAdvancedControls = createHigherOrderComponent((BlockEdit) => {
    return (props) => {
      const { attributes, setAttributes, isSelected, name, clientId } = props;
      const { generateInput } = attributes;

      const [aggregatedContent, setAggregatedContent] = useState("");
      const [activateCustomInput, setActivateCustomInput] = useState(false);

      const { postId, postType } = useSelect((select) => {
        const editorSelect = select("core/editor");
        return {
          postId: editorSelect.getCurrentPostId(),
          postType: editorSelect.getCurrentPostType() || "",
        };
      });

      const { handleGenerate, inProgress, outputChatGPT, errorMessage } =
        useGenerateHeader(
          aggregatedContent || "",
          generateInput || "",
          postId,
          postType,
          credentials
        );

      // Aggregate content from blocks below the selected heading
      useEffect(() => {
        if (isSelected && name === "core/heading") {
          const allBlocks = select("core/block-editor").getBlocks();
          const selectedBlockIndex = allBlocks.findIndex(
            (block) => block.clientId === clientId
          );

          if (selectedBlockIndex !== -1) {
            const paragraphs = [];
            for (let i = selectedBlockIndex + 1; i < allBlocks.length; i++) {
              const block = allBlocks[i];
              if (block.name !== "core/paragraph") {
                break;
              }
              paragraphs.push(block.attributes.content);
            }
            setAggregatedContent(paragraphs.join("\n"));
          }
        }
      }, [isSelected, name, clientId]);

      // Insert new content into the heading block
      const insertNewContent = () => {
        const selectedBlock = select("core/block-editor").getSelectedBlock();
        if (selectedBlock && selectedBlock.name === "core/heading") {
          const updatedBlock = createBlock("core/heading", {
            content: generateInput,
          });
          dispatch("core/block-editor").replaceBlocks(selectedBlock.clientId, [
            updatedBlock,
          ]);
        }
      };

      // Update attributes when new data is generated
      useEffect(() => {
        if (outputChatGPT && outputChatGPT !== generateInput) {
          setAttributes({ generateInput: outputChatGPT });
        }
      }, [outputChatGPT]);

      const handleGenerateAndSet = async () => {
        await handleGenerate();
        setActivateCustomInput(true);
      };

      return (
        <Fragment>
          <BlockEdit {...props} />
          {isSelected && name === "core/heading" && (
            <InspectorControls>
              <PanelBody title={__("Yooker header generator", "yai")}>
                {activateCustomInput && (
                  <TextControl
                    label={__("Generate Input", "yai")}
                    value={generateInput}
                    onChange={(newval) =>
                      setAttributes({ generateInput: newval })
                    }
                  />
                )}
                <TooltipIcon type="title" />
                <Grid column={2}>
                  {generateInput && generateInput.trim() !== "" && (
                    <Button variant="primary" onClick={insertNewContent}>
                      {__("Insert Title", "yai")}
                    </Button>
                  )}
                  {!activateCustomInput && (
                    <Button
                      variant="secondary"
                      onClick={() => setActivateCustomInput(true)}
                    >
                      {__("Add Extra Details", "yai")}
                    </Button>
                  )}
                  {activateCustomInput && !generateInput && !inProgress && (
                    <Button
                      variant="secondary"
                      onClick={() => setActivateCustomInput(false)}
                    >
                      {__("No Extra Details", "yai")}
                    </Button>
                  )}
                  <Button
                    variant="primary"
                    disabled={inProgress}
                    onClick={handleGenerateAndSet}
                  >
                    {inProgress
                      ? __("Generating...", "yai")
                      : __("Generate Header", "yai")}
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
              </PanelBody>
            </InspectorControls>
          )}
        </Fragment>
      );
    };
  }, "coverAdvancedControls");

  /**
   * Add the HOC to the heading block
   */
  addFilter(
    "editor.BlockEdit",
    "yai/header-advanced-control",
    coverAdvancedControls
  );
}
