import { createHigherOrderComponent } from "@wordpress/compose";
import {
  TextareaControl,
  TextControl,
  Button,
  __experimentalGrid as Grid,
} from "@wordpress/components";
import { InspectorControls } from "@wordpress/block-editor";
import { Fragment, useEffect } from "@wordpress/element";
import { addFilter } from "@wordpress/hooks";
import { __ } from "@wordpress/i18n";
import useGenerateText from "../components/generate-text";
import { createBlock } from "@wordpress/blocks";
import { dispatch, select, useSelect } from "@wordpress/data";
import TooltipIcon from "../components/TooltipIcon";

export function TextGenerateSettings({ credentials }) {
  function addCoverAttribute(settings, name) {
    if (typeof settings.attributes !== "undefined") {
      if (name === "core/paragraph") {
        settings.attributes = {
          ...settings.attributes,
          customTextField: { type: "string", default: "" },
          generateInput: { type: "string", default: "" },
        };
      }
    }
    return settings;
  }

  addFilter(
    "blocks.registerBlockType",
    "yai/cover-custom-text-attribute",
    addCoverAttribute
  );

  const coverAdvancedControls = createHigherOrderComponent((BlockEdit) => {
    return (props) => {
      const { attributes, setAttributes, isSelected, name } = props;
      const { customTextField, content, generateInput } = attributes;
      const { postId, postType } = useSelect((select) => {
        const editorSelect = select("core/editor");
        return {
          postId: editorSelect.getCurrentPostId(),
          postType: editorSelect.getCurrentPostType() || "",
        };
      });

      const { handleGenerate, inProgress, outputChatGPT, errorMessage } =
        useGenerateText(
          customTextField || "",
          generateInput,
          postId,
          postType,
          credentials
        );

      useEffect(() => {
        if (isSelected && name === "core/paragraph") {
          setAttributes({ customTextField: content || "" });
        }
      }, [isSelected, content, name]);

      useEffect(() => {
        if (outputChatGPT && outputChatGPT !== customTextField) {
          setAttributes({ customTextField: outputChatGPT });
        }
      }, [outputChatGPT]);

      const handleGenerateAndSet = async () => {
        await handleGenerate();
      };

      const insertNewContent = () => {
        const selectedBlock = select("core/block-editor").getSelectedBlock();
        if (selectedBlock?.name === "core/paragraph") {
          const paragraphs = customTextField
            .split("\n")
            .filter((paragraph) => paragraph.trim() !== "");

          if (paragraphs.length > 0) {
            const updatedBlock = createBlock("core/paragraph", {
              content: paragraphs[0],
            });
            const newParagraphBlocks = paragraphs
              .slice(1)
              .map((paragraphText) =>
                createBlock("core/paragraph", { content: paragraphText })
              );
            dispatch("core/block-editor").replaceBlocks(
              selectedBlock.clientId,
              [updatedBlock, ...newParagraphBlocks]
            );
          }
        }
      };

      return (
        <Fragment>
          <BlockEdit {...props} />
          {isSelected && props.name === "core/paragraph" && (
            <InspectorControls>
              {(customTextField?.trim() || errorMessage) && (
                <TextareaControl
                  label={__("Yooker tekst generator", "yai")}
                  value={errorMessage || customTextField}
                  onChange={(newval) =>
                    setAttributes({ customTextField: newval })
                  }
                  disabled={true}
                  style={{
                    color: errorMessage ? "red" : "inherit",
                    borderColor: errorMessage ? "red" : "lightgray",
                  }}
                />
              )}
              <TextControl
                label={__("Generate Input", "yai")}
                value={generateInput}
                onChange={(newval) => setAttributes({ generateInput: newval })}
              />
              <TooltipIcon type={"text"} />
              <Grid column={2}>
                <Button
                  variant="primary"
                  onClick={insertNewContent}
                  disabled={!(customTextField && customTextField.trim())}
                >
                  {__("Insert content", "yai")}
                </Button>
                <Button
                  variant="primary"
                  disabled={inProgress}
                  onClick={handleGenerateAndSet}
                >
                  {inProgress
                    ? __("Generating...", "yai")
                    : __("Generate Text", "yai")}
                </Button>
              </Grid>
            </InspectorControls>
          )}
        </Fragment>
      );
    };
  }, "coverAdvancedControls");
  addFilter(
    "editor.BlockEdit",
    "yai/text-advanced-control",
    coverAdvancedControls
  );
}
