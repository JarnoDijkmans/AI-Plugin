import { dispatch } from '@wordpress/data';

function dispatch_block(selectedBlock, response) {
    if (selectedBlock && selectedBlock.name === 'core/media-text') {
        dispatch('core/block-editor').updateBlockAttributes(selectedBlock.clientId, {
            mediaUrl: response.url, 
            mediaId: response.id,
            mediaType: 'image',
        });
    } else if (selectedBlock && selectedBlock.name === 'core/image') {
        dispatch('core/block-editor').updateBlockAttributes(selectedBlock.clientId, {
            url: response.url
        });
    } else {
        console.error('Unsupported block type for image insertion');
    }
}


export default {
    dispatch_block,
}