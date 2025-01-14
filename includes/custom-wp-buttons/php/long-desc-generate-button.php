<?php
add_action('media_buttons', 'add_custom_button_to_editor');

function add_custom_button_to_editor() {
    global $post, $current_screen;

    if ($current_screen->post_type !== 'product') {
        return;
    }

    if (!hasSubscription(2)) {
        return; 
    }

    if ($post->post_type === 'product') {
        echo '<div id="custom-woocommerce-button" data-product-id="' . esc_attr($post->ID) . '"></div>';
    }
}
?>