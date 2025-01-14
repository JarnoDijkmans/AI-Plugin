import LineChart from './line-chart';
import { useEffect, useState } from '@wordpress/element';
import { Spinner, __experimentalText as Text, __experimentalGrid as Grid, CardDivider } from '@wordpress/components';
import PaymentService from '../../services/payment-service';

// Helper function to format the month-year
const formatMonthYear = (month, year) => {
    const date = new Date(year, month - 1);  // JavaScript months are 0-based, so subtract 1
    return date.toLocaleString('default', { month: 'long', year: 'numeric' });
};

const MonthlyPaymentHistory = ({ credentials }) => {
    const [loading, setLoading] = useState(true);
    const [payments, setPayments] = useState([]);

    useEffect(() => {
        if (credentials.username && credentials.apiKey) {
            PaymentService.paymentHistoryMonthly(credentials.username, credentials.apiKey)
                .then((response) => 
                    setPayments(response || []))
                .finally(() => setLoading(false));
        }
    }, [credentials]);

    const groupedPayments = payments.reduce((acc, payment) => {
        const formattedMonthYear = formatMonthYear(payment.month, payment.year);

        if (!acc[formattedMonthYear]) acc[formattedMonthYear] = { payments: [], total: 0 };

        acc[formattedMonthYear].payments.push(payment);
        acc[formattedMonthYear].total += parseFloat(payment.total_value);
        return acc;
    }, {});

    const chartData = {
        dates: Object.keys(groupedPayments).reverse(), 
        totals: Object.keys(groupedPayments).map(month => groupedPayments[month].total).reverse(),
    };

    return (
        <>
            {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <Spinner style={{ width: '3em', height: '3em' }} />
                </div>
            ) : (
                chartData.dates.length > 0 && chartData.totals.length > 0 ? (
                    <Grid columns={2}>
                        <div style={{ maxHeight: '40em', overflowY: 'auto' }}>
                            {Object.entries(groupedPayments).map(([date, group], index) => (
                                <div key={index} style={{ marginBottom: '20px' }}>
                                    <Grid columns={2}>
                                        <Text style={{ fontSize: 'large' }}>{date}</Text> 
                                        <Text style={{ fontSize: 'large', marginLeft: 'auto' }}>
                                            €{group.total.toFixed(6)}
                                        </Text>
                                    </Grid>
                                    <CardDivider />
                                    {group.payments.map((payment, i) => (
                                        <Grid columns={2} key={i}>
                                            <Text style={{ fontSize: 'medium' }}>
                                                {payment.sub_type}
                                            </Text>
                                            <Text style={{ fontSize: 'small', marginLeft: 'auto' }}>
                                                €{parseFloat(payment.total_value).toFixed(6)}
                                            </Text>
                                        </Grid>
                                    ))}
                                </div>
                            ))}
                        </div>
                        <div>
                            <LineChart chartData={chartData} />
                        </div>
                    </Grid>
                ) : (
                    <p>No chart data available</p>
                )
            )}
        </>
    );
};

export default MonthlyPaymentHistory;
