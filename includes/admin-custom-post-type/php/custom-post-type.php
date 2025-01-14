<?php

defined( 'ABSPATH' ) || exit;

function yooker_custom_post_type() {
	register_post_type('yooker_ai_templates',
		array(
			'labels'      => array(
				'name'          => __('AI Template', 'textdomain'),
				'singular_name' => __('AI Template', 'textdomain'),
			),
				'public'      => true,
				'has_archive' => true,
                'rewrite'     => array( 'slug' => 'yooker-ai-templates' ),
                'show_in_rest' => true,
                'supports'    => array( 'title', 'editor', 'thumbnail', 'custom-fields' ),
				'menu_icon'   => yookerai_url . 'assets/images/Yooker-Icon-Wit-Y-transparant.svg',
		)
	);
}
add_action('init', 'yooker_custom_post_type', 2);
?>