<?php
    // Exit if accessed directly.
    defined( 'ABSPATH' ) || exit;

    $includes = array(
        'get-post-wordpress',
        'landingspage-create-wordpress',
        'landingspage-get-all-wordpress',
        'post-wordpress-media',
        'reusable-functions',
        'update-seo-metadata',
    );

    foreach( $includes as $include) :
        $file = plugin_dir_path( __FILE__ ) . 'php/' .$include.'.php';
        include_once $file;
    endforeach;
?>
                    