<?php
function get_template_by_id(WP_REST_Request $request) {

    $post_id = $request['id'];

    $post = get_post($post_id);

    if (!$post) {
        return rest_ensure_response(array(
            'message' => 'Post not found',
            'success' => false,
            'status'  => 404
        ));
    }

    $metadata = get_post_meta($post_id);

    $categories = wp_get_post_terms($post_id, 'category', array('fields' => 'names'));
    $tags = wp_get_post_terms($post_id, 'post_tag', array('fields' => 'names'));

    $post_data = array(
        'ID'            => $post->ID,
        'post_title'    => $post->post_title,
        'post_content'  => $post->post_content, 
        'post_excerpt'  => $post->post_excerpt,
        'post_date'     => $post->post_date,
        'post_status'   => $post->post_status,
        'post_author'   => $post->post_author,
        'post_slug'     => $post->post_name,
        'metadata'      => $metadata,
        'categories'    => $categories,
        'tags'          => $tags,
    );

    return rest_ensure_response(array(
        'message' => 'Successfully retrieved post',
        'success' => true,
        'status'  => 200,
        'data'    => $post_data
    ));
}

function register_get_ai_template_route() {
    register_rest_route('custom/v1', '/yooker_ai_templates/(?P<id>\d+)', array(
        'methods' => 'GET',
        'callback' => 'get_template_by_id',
        'permission_callback' => 'yooker_ai_check_rest_permissions', 
    ));
}

add_action('rest_api_init', 'register_get_ai_template_route');
?>