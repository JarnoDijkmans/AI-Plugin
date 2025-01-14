<?php
    // Exit if accessed directly.
    defined( 'ABSPATH' ) || exit;

	function register_yookerai_settings() {
    	register_setting(
        	'general',
        	'yookeraiusername',
        	array(
            	'type'              => 'string',
            	'show_in_rest'      => true,
            	'sanitize_callback' => 'sanitize_text_field',
        	)
    	);
    	register_setting(
        	'general',
        	'yookeraiapikey',
        	array(
            	'type'              => 'string',
            	'show_in_rest'      => true,
            	'sanitize_callback' => 'sanitize_text_field',
        	)
    	);
		register_setting(
			'general',
			'chatGPTAPIKEY',
			array(
            	'type'              => 'string',
            	'show_in_rest'      => true,
            	'sanitize_callback' => 'sanitize_text_field',
        	)
		);
	}

	add_action( 'admin_init',    'register_yookerai_settings' );
	add_action( 'rest_api_init', 'register_yookerai_settings' );
?>