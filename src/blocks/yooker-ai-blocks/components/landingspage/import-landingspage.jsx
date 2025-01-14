import WpService from "../../services/wp-service";
import { useState } from "@wordpress/element";

const useImportLandingspage = () => {
  const [loading, setLoading] = useState(false);

  const getDuplicateLandingspage = async (postId) => {
    const response = await WpService.getPostDetails(postId);
    return response;
  };

  const handleImport = async (selectedPost) => {
    setLoading(true);

    console.log("selectedPost: ", selectedPost);

    try {
      const originalPostData = await getDuplicateLandingspage(selectedPost.ID);

      const modifiedPostData = {
        title: originalPostData.post_title,
        content: originalPostData.post_content,
        status: "publish",
        post_type: "yooker_ai_templates",
        author: originalPostData.post_author,
      };

      WpService.importLandingspage(modifiedPostData);
    } catch (error) {
      console.error("Error generating text:", error);
    } finally {
      setLoading(false);
    }
  };

  return { handleImport, loading };
};

export default useImportLandingspage;
