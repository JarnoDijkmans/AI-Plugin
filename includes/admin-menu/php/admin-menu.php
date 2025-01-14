<?php
    defined( 'ABSPATH' ) || exit;

    function ai_plugin_admin_menu() {
        global $admin_menu_settings;

        $admin_menu_settings = 
        add_menu_page(
            __('page', 'yooker-ai'),
            __('Yooker AI', 'yooker-ai'),
            'manage_options',
            'ai-extension-admin-page',
            'ai_extension_admin_page',
            yookerai_url . 'assets/images/Yooker-Icon-Wit-Y-transparant.svg',
            3
        );
    }
    add_action('admin_menu', 'ai_plugin_admin_menu', 1);
?>