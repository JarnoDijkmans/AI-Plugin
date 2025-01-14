<?php
    // Exit if accessed directly.
    defined( 'ABSPATH' ) || exit;

    $includes = array(
        'admin-custom-post-type',
        'admin-menu',
        'admin-pages',
        'custom-wp-buttons',
        'enqueue-admin-scripts',
        'énqueue-admin-styles',
        'register-meta-fields',
        'register-plugin-settings',
        'rest-api',
    );

    foreach( $includes as $include) :
        $file = plugin_dir_path( __FILE__ ) . 'php/' .$include.'.php';
        include_once $file;
    endforeach;
?>