import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ComplaintStats {
    type: string;
    count: number;
    resolved: number;
    pending: number;
}

export function ComplaintsChart() {
    const [data, setData] = useState<ComplaintStats[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await fetch('http://localhost/api/complaints_chart.php');
                const result = await response.json();
                if (!response.ok) throw new Error(result.error || 'Failed to fetch data.');
                setData(result);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) return <div>Loading data...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <ResponsiveContainer width="100%" height={400}>
            <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="type" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="resolved" fill="#82ca9d" />
                <Bar dataKey="pending" fill="#8884d8" />
            </BarChart>
        </ResponsiveContainer>
    );
}
