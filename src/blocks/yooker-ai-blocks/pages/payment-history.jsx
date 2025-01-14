import { useEffect, useState } from '@wordpress/element';
import chatGptLogo from "../../../../assets/images/ChatGPT-Logo.png";
import AdminOptions from '../services/admin-option-service';
import PaymentService from '../services/payment-service';

import { Card, TabPanel, CardHeader, CardBody, CardFooter, __experimentalText as Text, __experimentalHeading as Heading, __experimentalGrid as Grid } from '@wordpress/components';
import DailyPaymentHistory from '../components/payment/daily-payment-history';
import MonthlyPaymentHistory from '../components/payment/monthly-payment-history';

const PaymentHistory = () => {
    const [isAPILoaded, setIsAPILoaded] = useState(false);
    const [credentials, setCredentials] = useState({ username: '', apiKey: '' });
    const [totalcost, setTotalcost] = useState(0);

    const fetchOptions = async () => {
        try {
            const response = await AdminOptions.GetSettings();
            setCredentials({ username: response.yookeraiusername, apiKey: response.yookeraiapikey });
            setIsAPILoaded(true);
        } catch (error) {
            console.error("Failed to load API settings:", error);
        }
    };

    useEffect(() => {
        if (credentials.username && credentials.apiKey) {
            PaymentService.totalPriceSpendByUser(credentials.username, credentials.apiKey)
                .then((response) => 
                    setTotalcost(response))
        }
    }, [credentials]);

    useEffect(() => {
        if (!isAPILoaded){
            fetchOptions();
        }
    }, [isAPILoaded]);

    return (
        <Card style={{width:'90%', marginLeft:'auto', marginRight:'auto'}}>
            <CardHeader style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Heading level={4}>
                    <img src={chatGptLogo} alt="ChatGPT Logo" style={{ width: '3em', height: '3em' }} />
                </Heading>
            </CardHeader>

            <CardBody style={{minHeight:'40em'}}>
                <TabPanel
                    className="payment-tabs"
                    activeClass="active-tab"
                    tabs={[
                        {
                            name: 'daily',
                            title: 'Dagelijks',
                            className: 'tab-daily', 
                        },
                        {
                            name: 'monthly',
                            title: 'Maandelijks',
                            className: 'tab-monthly',
                        },
                    ]}
                    >
                    {(tab) => (
                        <div>
                            {tab.name === 'daily' && (
                                <div>
                                    <DailyPaymentHistory credentials={credentials}/>
                                </div>
                            )}
                            {tab.name === 'monthly' && (
                                <div>
                                    <MonthlyPaymentHistory credentials={credentials} />
                                </div>
                            )}
                        </div>
                    )}
                </TabPanel>
            </CardBody>
            <CardFooter>
                <Text style={{marginLeft: 'auto', marginRight: 'auto'}}>
                Totale kosten: €{totalcost}
                </Text>   
            </CardFooter>
        </Card>
    );
};

export default PaymentHistory;