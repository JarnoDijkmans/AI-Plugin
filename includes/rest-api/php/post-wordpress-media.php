<?php
    // Exit if accessed directly.
    defined( 'ABSPATH' ) || exit;

    function uploadfile(WP_REST_Request $request) {
        require_once(ABSPATH . "/wp-load.php");
        require_once(ABSPATH . "/wp-admin/includes/image.php");
        require_once(ABSPATH . "/wp-admin/includes/file.php");
        require_once(ABSPATH . "/wp-admin/includes/media.php");
    
        global $wpdb;
    
        $response = ['status' => 201, 'message' => 'Route gevonden die overeenkomt met de URL en aanvraagmethode'];
    

        if (!isset($request['file']) || !isset($request['filename'])) {
            return rest_ensure_response([
                'status' => 404,
                'code' => 'rest_no_route',
                'message' => 'Geen route gevonden die overeenkomt met de URL en aanvraagmethode. test'
            ]);
        }
    
        // Retrieve request data
        $url = $request['file'];
        $title = $request['filename'];
    
        // Download URL to a temporary file
        $tmp = download_url($url);
        if (is_wp_error($tmp)) {
            return rest_ensure_response([
                'status' => 400,
                'success' => false,
                'reason' => 'Failed to download the file'
            ]);
        }
    
        // Extract filename and extension
        $filename = pathinfo($url, PATHINFO_FILENAME);
        $extension = pathinfo($url, PATHINFO_EXTENSION);
    
        // Generate custom GPT filename
        $img_parts = explode('/img-', $url);
        $gptfilename = isset($img_parts[1]) ? 'img-' . strtok($img_parts[1], '.') . '.png' : $filename . '.png';
    
        // Handle case where no extension exists
        if (!$extension) {
            $mime = sanitize_mime_type(mime_content_type($tmp));
            $mime_extensions = [
                'text/plain' => 'txt',
                'text/csv' => 'csv',
                'application/msword' => 'doc',
                'image/jpg' => 'jpg',
                'image/jpeg' => 'jpeg',
                'image/gif' => 'gif',
                'image/png' => 'png',
                'video/mp4' => 'mp4',
            ];
    
            $extension = $mime_extensions[$mime] ?? null;
            if (!$extension) {
                @unlink($tmp);
                return rest_ensure_response([
                    'status' => 400,
                    'success' => false,
                    'reason' => 'Unsupported file type'
                ]);
            }
        }
    
        // Prepare file for sideloading
        $file_args = [
            'name' => $gptfilename,
            'tmp_name' => $tmp,
        ];
    
        // Upload the file
        $attachment_id = media_handle_sideload($file_args, 0, $title);
    
        @unlink($tmp);
    
        if (is_wp_error($attachment_id)) {
            return rest_ensure_response([
                'status' => 400,
                'success' => false,
                'reason' => 'Failed to upload the file'
            ]);
        }
    
        return rest_ensure_response([
            'status' => 201,
            'success' => true,
            'id' => $attachment_id,
            'url' => wp_get_attachment_image_url($attachment_id, 'full'),
            'message' => 'File uploaded successfully',
        ]);
    }
    

    function register_wordpress_rest_api_route(){
        register_rest_route('upload/v1', '/new/', array(
            'methods' => 'POST',
            'callback' => 'uploadfile',
            'args' => array(
                'file' => array(
                    'validate_callback' => function($param, $request, $key) {
                        return  $request['file'];
                    }
                ),
                'filename' => array(
                    'validate_callback' => function($param, $request, $key) {
                        return  $request['filename'];
                    }
                ),
            ),
            'permission_callback' => function () {
                return current_user_can( 'edit_posts' );
            }
        ));
    } 
    
add_action('rest_api_init', 'register_wordpress_rest_api_route');
?>