import React, { useEffect, useState } from 'react';
import { Header } from '../../components/Header';

// Define types for props using an interface
interface BusCompanyList {
  id: number;
  name: string; // The 'name' prop must be a string
}

export function BusCompanyList(){

    //const busCompanyList:BusCompanyList[] = [
      //{id:1, name:'a'},
      //{id:2, name:'b'}
    //];


    const [busCompanyList, setComplaints] = useState<BusCompanyList[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

        // Fetch data from the PHP API
        useEffect(() => {
            fetch('http://localhost:8081/api/bus_companies/bus_company.php')
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
        
          return (
            <div className="min-h-screen bg-gray-100">
                <Header />
                <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="bg-white rounded-lg shadow">
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Bus company lists (Showing name of the bus companies)</h2>
                <div className="space-y-4">
                  {busCompanyList.map((busCompany) => (
                    <div key={busCompany.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-gray-900">{busCompany.name}</h3>
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
       // };
    
        /*
    return (
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Complaints</h2>
            <div className="space-y-4">
              {busCompanyList.map((busCompany) => (
                <div key={busCompany.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-900">{busCompany.name}</h3>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );*/
};