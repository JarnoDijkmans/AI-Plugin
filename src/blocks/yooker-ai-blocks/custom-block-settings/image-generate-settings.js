import { createHigherOrderComponent } from "@wordpress/compose";
import {
  TextareaControl,
  Button,
  __experimentalGrid as Grid,
} from "@wordpress/components";
import { InspectorControls } from "@wordpress/block-editor";
import { addFilter } from "@wordpress/hooks";
import { Fragment, useEffect, useState } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import useGenerateImage from "../components/generate-image";
import { select, useSelect } from "@wordpress/data";
import WpService from "../services/wp-service";
import DispatchBlock from "../components/dispatch-block";
import TooltipTool from "../components/TooltipIcon";

export function ImageGenerateSettings({ credentials }) {
  const media = ["core/media-text", "core/image", "core/gallery", "core/cover"];

  function addCoverAttribute(settings, name) {
    if (typeof settings.attributes !== "undefined") {
      if (media.includes(name)) {
        settings.attributes = {
          ...settings.attributes,
          imageUrl: { type: "string", default: "" },
          customTextField: { type: "string", default: "" },
        };
      }
    }
    return settings;
  }

  addFilter(
    "blocks.registerBlockType",
    "yai/cover-custom-media-attribute",
    addCoverAttribute
  );

  const coverAdvancedControls = createHigherOrderComponent((BlockEdit) => {
    return (props) => {
      const { attributes, setAttributes, isSelected, name } = props;
      const { customTextField, imageUrl } = attributes;
      const { postId, postType } = useSelect((select) => {
        const editorSelect = select("core/editor");
        return {
          postId: editorSelect.getCurrentPostId(),
          postType: editorSelect.getCurrentPostType() || "",
        };
      });
      const [imageGenerated, setImageGenerated] = useState("");
      const { handleGenerate, inProgress, outputChatGPT } = useGenerateImage(
        customTextField,
        postId,
        postType,
        credentials
      );

      useEffect(() => {
        if (isSelected && media.includes(name)) {
          setAttributes({ customTextField: customTextField });
        }
      }, [isSelected, customTextField]);

      const handleGenerateImage = async () => {
        await handleGenerate();
      };

      useEffect(() => {
        if (outputChatGPT) {
          setImageGenerated(outputChatGPT);
        }
      }, [outputChatGPT]);

      const handleInsertImage = async () => {
        if (imageGenerated) {
          const filename = "Chat_gpt_image_" + Date.now();

          const response = await WpService.uploadImageToWordPress(
            imageGenerated,
            filename
          );

          // Ensure response is valid
          if (response && response.url) {
            setAttributes({ imageUrl: response.url });

            const selectedBlock =
              select("core/block-editor").getSelectedBlock();
            DispatchBlock.dispatch_block(selectedBlock, response);
          } else {
            console.error(
              "Failed to upload image or invalid response structure:",
              response
            );
          }
        }
      };

      const removeImage = () => {
        setImageGenerated("");
      };

      return (
        <Fragment>
          <BlockEdit {...props} />
          {isSelected && media.includes(props.name) && (
            <InspectorControls>
              <TextareaControl
                label={__("Custom Text Field", "yai")}
                value={customTextField}
                onChange={(newval) =>
                  setAttributes({ customTextField: newval })
                }
              />
              <TooltipTool type="image" />
              {imageGenerated && (
                <div>
                  <div>
                    <img
                      src={imageGenerated}
                      alt={__("Generated image preview", "yai")}
                      style={{
                        width: "150px",
                        height: "150px",
                        objectFit: "cover",
                      }}
                    />
                  </div>
                  <div>
                    <Button
                      variant="secondary"
                      onClick={removeImage}
                      style={{ marginLeft: "10px" }}
                    >
                      {__("Remove Image", "yai")}
                    </Button>
                  </div>
                </div>
              )}
              <Grid column={2}>
                <Button
                  variant="primary"
                  onClick={handleGenerateImage}
                  disabled={
                    inProgress || !(customTextField && customTextField.trim())
                  }
                >
                  {inProgress
                    ? __("Generating...", "yai")
                    : __("Generate Image", "yai")}
                </Button>
                {imageGenerated && (
                  <Button
                    variant="primary"
                    onClick={handleInsertImage}
                    disabled={!(customTextField && customTextField.trim())}
                  >
                    {__("Insert Image", "yai")}
                  </Button>
                )}
              </Grid>
            </InspectorControls>
          )}
        </Fragment>
      );
    };
  }, "coverAdvancedControls");

  addFilter(
    "editor.BlockEdit",
    "yai/image-advanced-control",
    coverAdvancedControls
  );
}
