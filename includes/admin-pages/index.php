<?php
    defined( 'ABSPATH' ) || exit;

    $includes = array(
        'extension-admin-page'
    );

    foreach($includes as $include) {
        include_once plugin_dir_path(__FILE__) . 'php/' .$include . '.php';
    }
?>