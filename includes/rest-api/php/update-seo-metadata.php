<?php
function update_seo_metadata(WP_REST_Request $request) {
    $post_id = intval($request->get_param('post_id'));
    $seo_title = sanitize_text_field($request->get_param('seo_title'));
    $seo_description = sanitize_text_field($request->get_param('seo_description'));

    if (empty($post_id) || empty($seo_title) || empty($seo_description)) {
        return new WP_Error(
            'missing_params',
            'Post ID, SEO title, and SEO description are required',
            ['status' => 400]
        );
    }

    // Check if the post exists
    if (!get_post($post_id)) {
        return new WP_Error(
            'invalid_post',
            'Invalid post ID',
            ['status' => 404]
        );
    }

    // Update SEOpress metadata
    update_post_meta($post_id, '_seopress_titles_title', $seo_title);
    update_post_meta($post_id, '_seopress_titles_desc', $seo_description);

    return [
        'message' => 'SEO metadata updated successfully.',
        'post_id' => $post_id,
    ];
}

add_action('rest_api_init', function () {
    register_rest_route('custom/v1', '/update-seo-metadata', [
        'methods' => 'POST',
        'callback' => 'update_seo_metadata',
        'permission_callback' => function () {
            return current_user_can('edit_posts');
        },
    ]);
});
?>