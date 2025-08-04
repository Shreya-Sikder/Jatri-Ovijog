import React, { useEffect, useState } from 'react';
import { Header } from '../../components/Header';
import { CreateBusCompany } from './CreateBusCompany'; // Import CreateBusCompany

// Define types for props using an interface
interface BusCompanyList {
  id: number;
  name: string; // The 'name' prop must be a string
}

export function BusCompanyList() {
  const [busCompanyList, setComplaints] = useState<BusCompanyList[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState<boolean>(false); // State to toggle form visibility

  // Fetch data from the PHP API
  useEffect(() => {
    fetch('http://localhost/project/api/bus_companies/bus_company.php')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch complaints');
        }
        return response.json();
      })
      .then((data: BusCompanyList[]) => {
        console.log(JSON.stringify(data));
        setComplaints(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (showCreateForm) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Header />
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <CreateBusCompany />
          <button
            onClick={() => setShowCreateForm(false)}
            className="mt-4 px-4 py-2 bg-gray-600 text-white rounded-md"
          >
            Back to List
          </button>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Bus Company List
            </h2>
            <button
              onClick={() => setShowCreateForm(true)} // Show the CreateBusCompany form
              className="mb-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Create New Bus Company
            </button>
            <div className="space-y-4">
              {busCompanyList.map((busCompany) => (
                <div key={busCompany.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {busCompany.name}
                      </h3>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
