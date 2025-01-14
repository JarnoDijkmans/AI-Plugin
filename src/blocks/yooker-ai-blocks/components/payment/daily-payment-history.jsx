import LineChart from "./line-chart";
import { useEffect, useState } from "@wordpress/element";
import {
  Spinner,
  __experimentalText as Text,
  __experimentalGrid as Grid,
  CardDivider,
} from "@wordpress/components";
import PaymentService from "../../services/payment-service";

const DailyPaymentHistory = ({ credentials }) => {
  const [loading, setLoading] = useState(true);
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    if (credentials.username && credentials.apiKey) {
      PaymentService.paymentHistoryDaily(
        credentials.username,
        credentials.apiKey
      )
        .then((response) => setPayments(response || []))
        .finally(() => setLoading(false));
    }
  }, [credentials]);

  const groupedPayments = Object.keys(payments).reduce((acc, date) => {
    const dailyPayments = payments[date];

    acc[date] = {
      payments: dailyPayments,
      total: dailyPayments.reduce(
        (sum, payment) => sum + parseFloat(payment.value),
        0
      ),
    };

    return acc;
  }, {});

  const chartData = {
    dates: Object.keys(groupedPayments).reverse(),
    totals: Object.keys(groupedPayments)
      .map((date) => groupedPayments[date].total)
      .reverse(),
  };

  return (
    <>
      {loading ? (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Spinner style={{ width: "3em", height: "3em" }} />
        </div>
      ) : chartData.dates.length > 0 && chartData.totals.length > 0 ? (
        <Grid columns={2}>
          <div style={{ maxHeight: "40em", overflowY: "auto" }}>
            {Object.entries(groupedPayments).map(([date, group], index) => (
              <div key={index} style={{ marginBottom: "20px" }}>
                <Grid columns={2}>
                  <Text style={{ fontSize: "large" }}>{date}</Text>
                  <Text style={{ fontSize: "large", marginLeft: "auto" }}>
                    €{group.total.toFixed(6)}
                  </Text>
                </Grid>
                <CardDivider />
                {group.payments.map((payment, i) => (
                  <Grid columns={2} key={i}>
                    <Text style={{ fontSize: "medium" }}>
                      {payment.sub_type} - {payment.post_name}
                    </Text>
                    <Text style={{ fontSize: "small", marginLeft: "auto" }}>
                      €{parseFloat(payment.value).toFixed(6)}
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
      )}
    </>
  );
};

export default DailyPaymentHistory;
