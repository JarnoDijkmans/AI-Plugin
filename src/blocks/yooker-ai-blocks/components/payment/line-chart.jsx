import Chart from 'react-apexcharts';

const LineChart = ({chartData}) => {
    const options = {
        chart: {
            id: 'payment-history',
            zoom: {
                enabled: false,
            },
        },
        xaxis: {
            categories: chartData.dates,
            title: {
                text: 'Date',
            },
            labels: {
                formatter: (value) => {
                    if (value === chartData.dates[0] || value === chartData.dates[chartData.dates.length - 1]) {
                        return value;  
                    }
                    return '';  
                },
            },
        },
        yaxis: {
            min: 0,
            labels: {
                formatter: (value) => `€${value.toFixed(4)}`, 
            },
        },
        tooltip: {
            x: {
                show: true, 
            },
            y: {
                formatter: (value, {dataPointIndex}) => {
                    const date = chartData.dates[dataPointIndex];
                    return `${date} <br> €${value.toFixed(4)}`;
                },
            },
        },
    };
    
    const series = [
        {
            name: 'Payments',
            data: chartData.totals, 
        },
    ];
    
    
    return (
        <Chart
        options={options}
        series={series}
        type="line"
        width="100%"
        height={400}
    />
    )
}

export default LineChart;