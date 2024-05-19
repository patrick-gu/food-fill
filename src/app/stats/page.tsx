"use client";
import React, { useEffect } from 'react';
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
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );

  const calData = {
    labels: ['3', '7', '8', '15', '18', '19'],
    datasets: [
      {
        label: 'Calories',
        backgroundColor: 'rgba(65,105,225,0.5)',
        borderColor: 'rgba(65,105,225,1)',
        borderWidth: 1,
        hoverBackgroundColor: 'rgba(65,105,225,0.5)',
        hoverBorderColor: 'rgba(65,105,225,0.5)',
        data: [650, 590, 800, 810, 560, 550],
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
    const [calories, setCalories] = useState('');
    const [id, setId] = useState('6649fb043336782fe87c8652');
    useEffect(() => {
        fetchInfo();
    }, []);

    const fetchInfo = async () => {
        const response = await fetch(`https://us-west-2.aws.neurelo.com/rest/users/${id}`, {
            method: "GET",
            headers: {
                "X-API-KEY": "neurelo_9wKFBp874Z5xFw6ZCfvhXdQI0n/IuXyaFnE2pRTKQKV1kIYj2NATYl+L0t52jsR3dHeN/1e+hI+j5Fc1Wh9ozkWhNZt7XhLhxhsp5rJn5oJKz54N2r0UA3Z1vYstHVYlb06mu90fZHBJI+axoLkdT7ooxhL9WN6TnK6qHPSFbrQijhkbTf35C7MeKwT1HOth_DKYSPo6Y4FGUXFdvVb3TcGHezJQ95M+jh9WG/Do6KVw=",
            }
        });
        const data = await response.json();

        setCalories(data.data.calorie);
        console.log(data.data.calorie);
        calData.datasets[0].data = data.data.calorie;
        console.log(calData.datasets[0].data);
    };
    return (
      <div style={{ border: '1px solid #000', padding: '20px', boxSizing: 'border-box' }}>
        <Link href="/welcome">
            <FontAwesomeIcon icon={faHome} size="2x" />
        </Link>
        <h1></h1>
        <Line data={calData} options={options} />
      </div>
    );
  };
  
  export default Home;