import React, { useState } from "react";
import { Header } from "../../components/Header";

export function CreateBusCompany() {
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage(null);
    setErrorMessage(null);

    const newBusCompany = {
      name,
      description,
    };

    try {
      const response = await fetch("http://localhost/project/api/bus_companies/bus_company.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newBusCompany),
      });

      if (!response.ok) {
        throw new Error("Failed to create bus company.");
      }

      const data = await response.json();
      setSuccessMessage("Bus company created successfully!");
      setName(""); // Reset the form
      setDescription("");
    } catch (error: any) {
      setErrorMessage(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Create Bus Company</h2>
          {successMessage && <div className="text-green-600 mb-4">{successMessage}</div>}
          {errorMessage && <div className="text-red-600 mb-4">{errorMessage}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                rows={4}
              ></textarea>
            </div>
            <div>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
