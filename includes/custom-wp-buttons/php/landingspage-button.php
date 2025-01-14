<?php
function addCustomGenerateButton()
{
    global $current_screen;

    // Check if we're on the desired custom post type page
    if ('edit-landingspagina' !== $current_screen->id) {
        return;
    }

    // Enqueue ThickBox scripts and styles
    wp_enqueue_script('thickbox');
    wp_enqueue_style('thickbox');

    // Check subscription only when on the correct page
    if (!hasSubscription(6)) {
        return; 
    }

    $thickbox_link = "#TB_inline?width=600&height=500&inlineId=yooker-ai-landingspages";
    ?>
    <div id="yooker-ai-landingspages" style="display: none;">
        <div id="yooker-thickbox-landingspage"></div> 
    </div>

    <script type="text/javascript">
        jQuery(document).ready(function($) {
            $('.wrap .page-title-action').first().after(
                "<a href='<?php echo $thickbox_link; ?>' class='thickbox page-title-action'>Generate Landingspage</a>"
            );
        });
    </script>
    <?php
}
add_action('admin_head', 'addCustomGenerateButton');
?>