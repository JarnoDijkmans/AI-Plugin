import StatusCheck from "../error-handling/statushandler";
const uploadImageToWordPress = async (requestfile, requestfilename) => {
  try {
    const response = await wp.apiFetch({
      path: "/upload/v1/new",
      method: "POST",
      data: {
        file: requestfile,
        filename: requestfilename,
      },
    });

    return response;
  } catch (error) {
    console.error("Error uploading media to WordPress:", error);
    return null;
  }
};

const getPostDetails = async (postId) => {
  try {
    const response = await wp.apiFetch({
      path: `/custom/v1/yooker_ai_templates/${postId}`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-WP-Nonce": wpApiSettings.nonce,
      },
    });

    const isSuccess = StatusCheck({
      status: response.status,
      message: response.message,
    });

    if (isSuccess) {
      return response.data;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error retrieving template details:", error);
    throw error;
  }
};

const importLandingspage = async (modifiedPostData) => {
  try {
    const response = await fetch(`/wp-json/wp/v2/yooker_ai_templates`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-WP-Nonce": wpApiSettings.nonce,
      },
      body: JSON.stringify(modifiedPostData),
    });

    if (!response.ok) {
      const errorMessage = await response.text(); // Get the raw response text
      console.error("Error response:", errorMessage);
      throw new Error("Failed to create a new yooker_ai_templates post");
    }

    const result = await response.json();
  } catch (error) {
    console.error("Error generating text:", error);
  }
};

const getAllLandingspages = async () => {
  try {
    const response = await fetch(`/wp-json/custom/v1/landingspage/all`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-WP-Nonce": wpApiSettings.nonce,
      },
    });
    if (!response.ok) {
      const errorMessage = await response.text(); // Get the raw response text
      console.error("Error response:", errorMessage);
      throw new Error("Failed to create a new yooker_ai_templates post");
    }
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error generating text:", error);
  }
};

const createLandingspage = async (title, content, description) => {
  try {
    // Step 1: Create the landing page
    const createResponse = await wp.apiFetch({
      path: `/custom/v1/create-landingspage-unique`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-WP-Nonce": wpApiSettings.nonce,
      },
      body: JSON.stringify({
        title: title,
        content: content,
      }),
    });

    const newPostId = createResponse.post_id;

    if (!newPostId) {
      throw new Error("Failed to retrieve the new post ID from the response.");
    }

    await updateSEOMetadata(newPostId, title, description);

    return createResponse;
  } catch (error) {
    console.error("Error creating or updating the landing page:", error);
    throw error;
  }
};

const updateSEOMetadata = async (postId, seoTitle, seoDescription) => {
  try {
    const seoResponse = await wp.apiFetch({
      path: `/custom/v1/update-seo-metadata`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-WP-Nonce": wpApiSettings.nonce,
      },
      body: JSON.stringify({
        post_id: postId,
        seo_title: seoTitle,
        seo_description: seoDescription,
      }),
    });

    console.log(`SEO metadata updated for post ID ${postId}:`, seoResponse);
    return seoResponse;
  } catch (error) {
    console.error(`Error updating SEO metadata for post ID ${postId}:`, error);
    throw error;
  }
};

export default {
  uploadImageToWordPress,
  importLandingspage,
  getPostDetails,
  getAllLandingspages,
  createLandingspage,
};
