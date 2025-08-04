import React, { useEffect, useState } from 'react';

interface Alert {
    id: number;
    message: string;
    created_at: string;
}

export default function EmergencyAlerts() {
    const [alerts, setAlerts] = useState<Alert[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchAlerts = async () => {
            try {
                const response = await fetch('http://localhost/api/emergency_alerts.php');
                const result = await response.json();
                if (!response.ok) throw new Error(result.error || 'Failed to fetch alerts.');
                setAlerts(result);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchAlerts();
    }, []);

    if (loading) return <div>Loading alerts...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <h2>Emergency Alerts</h2>
            <ul>
                {alerts.map((alert) => (
                    <li key={alert.id}>{alert.message} - {new Date(alert.created_at).toLocaleString()}</li>
                ))}
            </ul>
        </div>
    );
}
