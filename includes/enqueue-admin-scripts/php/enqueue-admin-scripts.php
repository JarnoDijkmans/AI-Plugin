<?php
    if(! function_exists('ai_plugin_admin_scripts')) :

        /**
         * Enqueue editor styles.
         * 
         * @since Yooker 1.0
         * 
         * @return void
         */

         function ai_plugin_admin_scripts() {

            global $pagenow;
            global $post;
			global $current_screen;

			if (
				(isset($_GET['page']) && $_GET['page'] == 'ai-extension-admin-page') 
				|| (isset($_GET['post']) && isset($_GET['action']) && $_GET['action'] == 'edit')
				|| (isset($_GET['post_type']) && ($_GET['post_type'] == 'page' || $_GET['post_type'] == 'post'))
				|| (strpos($_SERVER['PHP_SELF'], 'post-new.php') !== false)
				|| (isset($current_screen) && 'edit-landingspagina' === $current_screen->id)
				|| (isset($current_screen) && 'edit-yooker_ai_templates' === $current_screen->id)
				|| (isset($current_screen) && $current_screen->post_type === 'product')
				|| (isset($_GET['page']) && $_GET['page'] === 'wc-admin' && strpos($_GET['path'], '/product/') !== false)
			):
                wp_register_script(
					'yooker-blocks-js', // Handle.
					yookerai_url . 'build/index.js',
					array( 
						'wp-api-fetch', 
        				'wp-block-editor', 
						'wp-block-library', 
						'wp-api', 
						'wp-blocks', 
						'wp-editor', 
						'wp-components', 
						'wp-i18n', 
						'wp-element', 
						'wp-plugins', 
						'wp-edit-post', 
						'wp-edit-site', 
						'wp-data',
					),
					filemtime(yookerai_path . 'build/index.js'), 
					false 
	 			);

				 wp_localize_script( 
					'yooker-blocks-js', 
					'wpApiSettings',
                    array(
                        'root' => esc_url_raw( rest_url() ),
						'nonce' => wp_create_nonce('wp_rest'),
					),
				);
	
				wp_enqueue_script( 'yooker-blocks-js' );
			endif;
		}  

    endif;
    add_action( 'admin_enqueue_scripts', 'ai_plugin_admin_scripts');
?>