<?php
function get_all_landingpage(WP_REST_Request $request) {

    $query = new WP_Query(array(
        'post_type'      => 'landingspagina',
        'posts_per_page' => -1, 
        'post_status'    => 'publish',
        'orderby'        => 'date',
        'order'          => 'DESC',
        'fields'         => 'ids' 
    ));

    if (!$query->have_posts()) {
        return new WP_Error('no_posts', 'No posts found', array('status' => 404));
    }

    $posts_data = array();
    foreach ($query->posts as $post_id) {
        $post = get_post($post_id);
        
        $posts_data[] = array(
            'ID'    => $post->ID,
            'title' => $post->post_title,
        );
    }

    return rest_ensure_response($posts_data);
}

function register_get_all_landingpage_route() {
    register_rest_route('custom/v1', '/landingspage/all', array(
        'methods' => 'GET',
        'callback' => 'get_all_landingpage',
        'permission_callback' => 'yooker_ai_check_rest_permissions', 
    ));
}
    
add_action('rest_api_init', 'register_get_all_landingpage_route');
?>