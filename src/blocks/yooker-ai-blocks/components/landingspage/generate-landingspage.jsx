import { useState } from "@wordpress/element";
import WpService from "../../services/wp-service";
import SEOService from "../../services/seo-service";

const useGenerateLandingspage = () => {
  const [cost, setCost] = useState(0);
  const [error, setError] = useState("");

  const processNonLocationChanges = (entry, blocks) => {
    return blocks.map((block) => {
      let updatedContent = block.content;

      entry.changes.forEach(({ from, to, selectedIndex }) => {
        const { start } = selectedIndex;

        // Use regex to match the exact word with boundaries
        const regex = new RegExp(`\\b${from}\\b`, "g");
        let closestIndex = null;
        let smallestDistance = Infinity;

        // Iterate through matches to find the closest index
        let match;
        while ((match = regex.exec(updatedContent)) !== null) {
          const matchIndex = match.index;
          const distance = Math.abs(matchIndex - start);

          if (distance < smallestDistance) {
            smallestDistance = distance;
            closestIndex = matchIndex;
          }
        }

        // Replace the closest occurrence if found
        if (closestIndex !== null) {
          const matchLength = from.length;

          const precedingChar = updatedContent[closestIndex - 1] || "";
          const followingChar =
            updatedContent[closestIndex + matchLength] || "";

          const preservePrecedingSpace = /^[.,!?;:()\-_]$/.test(precedingChar)
            ? ""
            : " ";
          const preserveFollowingSpace = /^[.,!?;:()\-_]$/.test(followingChar)
            ? ""
            : " ";

          const before = updatedContent.slice(0, closestIndex).trimEnd();
          const after = updatedContent
            .slice(closestIndex + matchLength)
            .trimStart();
          updatedContent =
            before +
            preservePrecedingSpace +
            to +
            preserveFollowingSpace +
            after;
        }
      });

      return { ...block, content: updatedContent, title };
    });
  };

  const processLocationChanges = async (entry, blocks) => {
    const newLandingPages = [];
    entry.changes.forEach(({ from, to, selectedIndex }) => {
      const { start } = selectedIndex;

      const modifiedBlocks = blocks.map((block) => {
        let updatedContent = block.content;

        const regex = new RegExp(`\\b${from}\\b`, "g");
        let closestIndex = null;
        let smallestDistance = Infinity;

        let match;
        while ((match = regex.exec(updatedContent)) !== null) {
          const matchIndex = match.index;
          const distance = Math.abs(matchIndex - start);

          if (distance < smallestDistance) {
            smallestDistance = distance;
            closestIndex = matchIndex;
          }
        }

        if (closestIndex !== null) {
          const matchLength = from.length;

          const precedingChar = updatedContent[closestIndex - 1] || "";
          const followingChar =
            updatedContent[closestIndex + matchLength] || "";

          const preservePrecedingSpace = /^[.,!?;:()\-_]$/.test(precedingChar)
            ? ""
            : " ";
          const preserveFollowingSpace = /^[.,!?;:()\-_]$/.test(followingChar)
            ? ""
            : " ";

          const before = updatedContent.slice(0, closestIndex).trimEnd();
          const after = updatedContent
            .slice(closestIndex + matchLength)
            .trimStart();
          updatedContent =
            before +
            preservePrecedingSpace +
            to +
            preserveFollowingSpace +
            after;
        }

        return { ...block, content: updatedContent };
      });

      newLandingPages.push(modifiedBlocks);
    });

    return newLandingPages;
  };

  const parseBlocks = (content) => {
    const blockRegex = /<!-- wp:([\w-]+)(.*?) -->(.*?)<!-- \/wp:\1 -->/gs;

    const blocks = [...content.matchAll(blockRegex)].map((match) => {
      const [, type, attributes, blockContent] = match;

      return {
        type,
        attributes: attributes ? JSON.parse(attributes.trim() || "{}") : {},
        content: blockContent.trim(),
      };
    });

    return blocks;
  };

  const reconstructContent = (blocks) => {
    return blocks
      .map((block) => {
        let attributes = "";
        if (block.attributes && Object.keys(block.attributes).length > 0) {
          // Ensure valid JSON for attributes
          attributes = ` ${JSON.stringify(block.attributes)}`;
        }

        return `<!-- wp:${block.type}${attributes} -->\n${block.content}\n<!-- /wp:${block.type} -->`;
      })
      .join("\n");
  };

  const handleGenerate = async (dataset, duplicate, credentials) => {
    try {
      setError("");
      const originalContent = duplicate.post_content;
      let blocks = parseBlocks(originalContent);

      const nonLocationChanges = dataset.dataset.filter(
        (entry) => !entry.locationChecked
      );
      const locationChanges = dataset.dataset.filter(
        (entry) => entry.locationChecked
      );

      nonLocationChanges.forEach((entry) => {
        blocks = processNonLocationChanges(entry, blocks);
      });

      let flattenedResults = [];

      if (locationChanges.length > 0) {
        const allLocationChangesResults = await Promise.all(
          locationChanges.map((entry) =>
            processLocationChanges(entry, blocks).then((result) =>
              result.map((block) => ({
                content: block,
              }))
            )
          )
        );

        flattenedResults = allLocationChangesResults.flat();
      } else {
        flattenedResults = [
          {
            content: blocks,
          },
        ];
      }

      await Promise.all(
        flattenedResults.map(async ({ content }) => {
          const reconstructedContent = reconstructContent(content);

          const { title, description, errorMessage } =
            await SEOService.generateSEO(
              reconstructedContent,
              credentials.chatGPTAPIKEY,
              setCost
            );

          if (errorMessage) {
            setError(errorMessage);
          } else {
            await WpService.createLandingspage(
              title,
              reconstructedContent,
              description
            );
          }
        })
      );
    } catch (error) {
      console.error("Error generating landing pages:", error);
    }
  };

  return { handleGenerate, cost, error };
};

export default useGenerateLandingspage;
