import React, { useEffect, useState } from 'react';

interface Complaint {
    id: number;
    type: string;
    description: string;
    location: string;
    status: string;
    created_at: string;
}

export default function ActiveComplaints() {
    const [complaints, setComplaints] = useState<Complaint[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchComplaints = async () => {
            try {
                const response = await fetch('http://localhost/api/active_complaints.php');
                const data = await response.json();
                if (!response.ok) throw new Error(data.error || 'Failed to fetch complaints.');

                setComplaints(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchComplaints();
    }, []);

    if (loading) return <div>Loading complaints...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <h2>Active Complaints</h2>
            {complaints.map((complaint) => (
                <div key={complaint.id}>
                    <h3>{complaint.type}</h3>
                    <p>{complaint.description}</p>
                    <p>{complaint.location}</p>
                    <p>{new Date(complaint.created_at).toLocaleString()}</p>
                    <p>Status: {complaint.status}</p>
                </div>
            ))}
        </div>
    );
}
