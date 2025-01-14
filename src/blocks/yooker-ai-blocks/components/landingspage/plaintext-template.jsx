import WpService from "../../services/wp-service";

const GetPlainTextTemplate = ({ selectedTemplate, setText }) => {
  WpService.getPostDetails(selectedTemplate)
    .then((post) => {
      const content = post.post_content || "";
      const paragraphs = content.match(/<p>(.*?)<\/p>/gs) || [];
      const nonEmptyParagraphs = paragraphs
        .map(
          (paragraph) => paragraph.replace(/<\/?p>/g, "").trim() // Remove <p> tags and trim whitespace
        )
        .filter((paragraph) => paragraph.length > 0); // Exclude empty paragraphs

      setText(nonEmptyParagraphs.join("\n\n"));
    })
    .catch((error) => console.error("Error fetching post content:", error));
};

export default GetPlainTextTemplate;
