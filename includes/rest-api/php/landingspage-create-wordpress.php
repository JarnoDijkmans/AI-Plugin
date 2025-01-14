<?php
function create_landingspage($request) {
    
    $new_content = $request->get_param('content');
    $new_title = $request->get_param('title'); 
    
    if (empty($new_content)) {
        return new WP_Error('missing_content', 'Content is required to create a landing page.', array('status' => 400));
    }

    // Set up the new post data
    $post_data = array(
        'post_title'   => $new_title, 
        'post_content' => $new_content,
        'post_status'  => 'publish', 
        'post_type'    => 'landingspagina',
    );

    // Insert the post
    $new_post_id = wp_insert_post($post_data, true);

    if (is_wp_error($new_post_id)) {
        return new WP_Error('create_failed', 'Failed to create a new landing page.', array('status' => 500));
    }

    return rest_ensure_response(array(
        'status'  => 'success',
        'message' => 'Landing page created successfully.',
        'post_id' => $new_post_id,
    ));
}

function register_create_landingpage_route() {
    register_rest_route('custom/v1', '/create-landingspage-unique/', array(
        'methods' => 'POST',
        'callback' => 'create_landingspage',
        'permission_callback' => 'yooker_ai_check_rest_permissions', 
    ));
}

add_action('rest_api_init', 'register_create_landingpage_route');
?>