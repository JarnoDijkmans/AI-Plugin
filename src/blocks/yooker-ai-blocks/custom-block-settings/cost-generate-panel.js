import { Fragment } from '@wordpress/element'; 
import { PluginDocumentSettingPanel } from '@wordpress/editor'; 
import { useEffect, useState } from '@wordpress/element';
import { TextControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useSelect } from '@wordpress/data';
import { useAuthSubscriptions } from '../components/auth-subs';

export const CostGeneratePanel = () => {
    const [hasOption, setHasOption] = useState(false);
    const [loading, setLoading] = useState(true);

    const { totalCost, title, postType } = useSelect( ( select ) => {
        const editorSelect = select('core/editor');
        return {
            totalCost: editorSelect.getEditedPostAttribute('meta')?.total_cost || 0,
            title: editorSelect.getEditedPostAttribute('title') || '', 
            postType: editorSelect.getCurrentPostType() || '', 
        };
    });

    const sub1 = useAuthSubscriptions(1); 
    const sub3 = useAuthSubscriptions(3); 

    useEffect(() => {
        setLoading(true);
    
        const hasOptionForEitherSub = (!sub1.loading && sub1.hasOption) || (!sub3.loading && sub3.hasOption);
    
        if (hasOptionForEitherSub) {
            setHasOption(true);
        }
    
        setLoading(false); 
    }, [sub1, sub3]);

    return (
        <Fragment>
            { hasOption && !loading && (
            <PluginDocumentSettingPanel
                name="ai-costs-panel"
                title={__('AI costs', 'yooker-ai')}
                className="custom-panel"
            >
                <TextControl
                    label={__('Post Title', 'yooker-ai')}
                    value={title}
                    disabled    
                />
                <TextControl
                    label={__(`Verbruikte kosten geselecteerde ${postType}`, 'yooker-ai')}
                    value={`€${totalCost}`}
                    disabled
                />
            </PluginDocumentSettingPanel>
            )}
        </Fragment>
    );
};
