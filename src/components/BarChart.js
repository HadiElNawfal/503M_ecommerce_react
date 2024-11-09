import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Register necessary Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BarChart = ({ labels, data, colors }) => {
  const chartData = {
    labels: labels, // Labels for the bars (e.g., "Total Products", "Orders Today")
    datasets: [
      {
        label: 'Statistics',
        data: data, // The actual values (e.g., [320, 15, 1234, 42])
        backgroundColor: colors, // Color for each bar
        borderColor: colors, // Border color for each bar
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Admin Dashboard Stats', // Title of the chart
      },
      legend: {
        display: false, // Hide legend as we only have one dataset
      },
    },
  };

  return <Bar data={chartData} options={options} />;
};

export default BarChart;
