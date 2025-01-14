<?php
function addCustomImportButton()
{
    global $current_screen;

    if ('edit-yooker_ai_templates' !== $current_screen->id) {
        return;
    }

    if (!hasSubscription(6)) {
        return; 
    }

    wp_enqueue_script('thickbox');
    wp_enqueue_style('thickbox');

    $thickbox_link = "#TB_inline?width=300&height=200&inlineId=yooker-ai-templates";
    ?>
    <div id="yooker-ai-templates" style="display: none;">
        <div id="yooker-thickbox-templates"></div> 
    </div>

    <script type="text/javascript">
        jQuery(document).ready(function($) {
            $('.wrap .page-title-action').first().after(
                "<a href='<?php echo $thickbox_link; ?>' class='thickbox page-title-action'>Import Landingspage</a>"
            );
        });
    </script>
    <?php
}
add_action('admin_head', 'addCustomImportButton');
?>