import { useState, useEffect} from '@wordpress/element';
import { __experimentalGrid as Grid } from '@wordpress/components';

const OptionsLandingspage = ({setOptions}) => {
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [dynamicFields, setDynamicFields] = useState({
        service: '',
        translation: '',
        product: '',
        location: '',
    });

    const availableOptions = [
        { index: 1, label: 'Dienst', value: 'service' },
        { index: 2, label: 'Vertaling', value: 'translation' },
        { index: 3, label: 'Product', value: 'product' },
        { index: 4, label: 'Locatie', value: 'location' },
    ];

    const handleOptionChange = (value, isChecked) => {
        setSelectedOptions(prevOptions =>
            isChecked ? [...prevOptions, value] : prevOptions.filter(option => option !== value)
        );
    
        setDynamicFields(prevFields => ({
            ...prevFields,
            [value]: isChecked ? prevFields[value] : ''  
        }));
    };

    useEffect(() => {
        setOptions(dynamicFields);  
    }, [dynamicFields, setOptions]);

    const handleDynamicFieldChange = (key, value) => {
        setDynamicFields(prevFields => ({
            ...prevFields,
            [key]: value
        }));
    };

    const fields = {
        service: 'GEWENSTE DIENST',
        translation: 'GEWENSTE VERTALING',
        product: 'GEWENSTE PRODUCT',
        location: 'GEWENSTE LOCATIE',
    };

    return (
        <div>
            <div className="checkbox-container">
                <Grid columns={4}>
                    {availableOptions.map(option => (
                        <div key={option.index} style={{ textAlign: 'center' }}>
                            <input
                                type="checkbox"
                                id={option.value}
                                checked={selectedOptions.includes(option.value)}
                                onChange={(e) => handleOptionChange(option.value, e.target.checked)}
                            />
                            <label htmlFor={option.value} style={{ display: 'block' }}>
                                {option.label}
                            </label>
                        </div>
                    ))}
                </Grid>
            </div>
            <div>
                {Array.isArray(selectedOptions) && selectedOptions.map(option => {
                const label = fields[option];
                return (
                    <div key={option} style={{ marginBottom: '10px' }}>
                        <label
                            htmlFor={option}
                            style={{
                                fontSize: 'smaller',
                                fontWeight: '500'
                            }}
                        >
                            {label}
                        </label>
                        <input
                            type="text"
                            id={option}
                            value={dynamicFields[option] || ''}
                            onChange={(e) => handleDynamicFieldChange(option, e.target.value)}
                            style={{ width: '100%' }}
                        />
                    </div>
                );
                })}
            </div>
        </div>
    );
};

export default OptionsLandingspage;
