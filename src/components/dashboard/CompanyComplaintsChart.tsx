import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto'; // Required for Chart.js

// Define the type for the API response
interface CompanyComplaint {
  company: string;
  count: number;
}

export function CompanyComplaintsChart(): JSX.Element {
  const [chartData, setChartData] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Fetch the complaint data for companies
    fetch('http://localhost/project/api/get_company_complaints.php')
      .then((response) => response.json())
      .then((data: CompanyComplaint[]) => {
        const labels = data.map((item) => item.company);
        const counts = data.map((item) => item.count);

        setChartData({
          labels,
          datasets: [
            {
              label: 'Number of Complaints',
              data: counts,
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
            },
          ],
        });
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching chart data:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p>Loading chart...</p>;
  }

  if (!chartData) {
    return <p>No data available to display.</p>;
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-lg font-bold mb-4">Complaints per Company</h2>
      <div style={{ height: '300px' }}>
        <Bar data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />
      </div>
    </div>
  );
}
