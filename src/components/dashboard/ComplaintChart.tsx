import React, { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { supabase } from '../../lib/supabase';

interface ComplaintStats {
  type: string;
  count: number;
  resolved: number;
  pending: number;
}

export function ComplaintChart() {
  const [data, setData] = useState<ComplaintStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
    
    // Subscribe to changes
    const subscription = supabase
      .channel('reports_changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'reports' 
      }, () => {
        fetchStats();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchStats = async () => {
    try {
      const { data: stats, error } = await supabase
        .from('reports')
        .select('type, status')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Process data for chart
      const processedData = stats.reduce((acc, curr) => {
        const type = curr.type;
        const status = curr.status;
        
        const existingType = acc.find(item => item.type === type);
        if (existingType) {
          existingType.count++;
          if (status === 'resolved') existingType.resolved++;
          if (status === 'pending') existingType.pending++;
        } else {
          acc.push({
            type,
            count: 1,
            resolved: status === 'resolved' ? 1 : 0,
            pending: status === 'pending' ? 1 : 0
          });
        }
        return acc;
      }, [] as ComplaintStats[]);

      setData(processedData);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading chart...</div>;
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Complaints Overview</h3>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="type" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="resolved" fill="#10B981" name="Resolved" />
            <Bar dataKey="pending" fill="#F59E0B" name="Pending" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}