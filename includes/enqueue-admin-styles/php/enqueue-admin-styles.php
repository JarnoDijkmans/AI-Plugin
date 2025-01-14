<?php
    defined ( 'ABSPATH' ) || exit;

    if ( ! function_exists('ai_plugin_admin_styles')) : 
        /**
         * Enqueue editor styles.
         * 
         * @since Yooker 1.0
         * 
         * @return void
         */

         function ai_plugin_admin_styles() {
            if(isset($_GET['page']) && $_GET['page'] == 'ai-extension-admin-page'):
                wp_enqueue_style('wp-edit-blocks');
                    wp_register_style(
                        'ai-admin',
                        yookerai_url. 'build/index.css',
                        array(),
                        filemtime(yookerai_path. 'build/index.css')
                    );

                    wp_enqueue_style('ai-admin');
                endif;
         }
        endif;

add_action( 'admin_enqueue_scripts', 'ai_plugin_admin_styles');
?>