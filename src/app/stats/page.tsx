"use client";
import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );

  const data = {
    labels: ['3', '7', '8', '15', '18', '19'],
    datasets: [
      {
        label: 'Calories',
        backgroundColor: 'rgba(65,105,225,0.5)',
        borderColor: 'rgba(65,105,225,1)',
        borderWidth: 1,
        hoverBackgroundColor: 'rgba(65,105,225,0.5)',
        hoverBorderColor: 'rgba(65,105,225,0.5)',
        data: [65, 59, 80, 81, 56, 55, 40],
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Calories for the month of May 2024',
      },
    },
  };
  
  const Home: React.FC = () => {
    return (
      <div style={{ border: '1px solid #000', padding: '20px', boxSizing: 'border-box' }}>
        <h1></h1>
        <Line data={data} options={options} />
      </div>
    );
  };
  
  export default Home;