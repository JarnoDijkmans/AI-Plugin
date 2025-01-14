<?php
    /**
     * @package yooker_ai
     * @version 1.0.0
     */
    /*
    Plugin Name: Yooker AI
    Description: Yooker's veelzijdige pakket van AI-tools voor geavanceerde WordPress-functionaliteiten
    Author: J. Dijkmans - Yooker
    Author URI: https://www.yooker.nl/
    Version: 1.0.0
    Text Domain: ai
    Plugin URI: https://ai.yookerdesign.nl/updates/?plugin=ai
    Update URI: https://ai.yookerdesign.nl/updates/?plugin=ai
    Requires at least: 5.4
    Requires PHP: 7.4
    License: GPLv2
    License URI: https://www.yooker.nl/
    */

    defined( 'ABSPATH' ) || exit;

    function load_yooker_ai_plugin_data() {
        if ( !function_exists('get_plugin_data')):
            require_once ( ABSPATH . 'wp-admin/includes/plugin.php' );
        endif;
        define( 'yookerai_plugindata', get_plugin_data( __FILE__ ) );
    }
    add_action( 'init', 'load_yooker_ai_plugin_data');
    define('yookerai_path', plugin_dir_path(__FILE__));
    define('yookerai_url', plugin_dir_url(__FILE__));
    define('yookerai_basename', plugin_basename( __FILE__ ) );
    define('yookerai_slug', dirname( plugin_basename( __FILE__ )) );

    require_once plugin_dir_path(__FILE__) . 'includes/utils/index.php';

    $includes = array(
        'plugin-transient-update', 
        'information-tab',
        'admin-menu',
        'admin-pages',
        'enqueue-admin-styles',
        'enqueue-admin-scripts',
        'register-meta-fields',
        'register-plugin-settings',
        'rest-api',
        'custom-wp-buttons',
        'admin-custom-post-type',
    );

    foreach( $includes as $include ) :
        $file = plugin_dir_path(__FILE__) . 'includes/' . $include . '/index.php';
        if (file_exists($file)) {
            include_once $file;
        } else {
            error_log("File not found: $file");
        }
    endforeach;
?>