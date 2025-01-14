<?php
defined( 'ABSPATH' ) || exit;

function register_total_cost_meta() {
    $post_types = array( 'post', 'page' ); 

    foreach ( $post_types as $post_type ) {
        register_post_meta( $post_type, 'total_cost', array(
            'show_in_rest' => true, 
            'single' => true,       
            'type' => 'number',     
            'default' => 0,         
        ));
    }
}
add_action( 'init', 'register_total_cost_meta' );
?>