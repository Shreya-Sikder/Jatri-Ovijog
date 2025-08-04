import React, { useState } from 'react';
import './FareCalculator.css'; // Custom CSS for styling

export default function FareCalculator() {
  const [startLocation, setStartLocation] = useState('');
  const [endLocation, setEndLocation] = useState('');
  const [isStudent, setIsStudent] = useState(false);
  const [fare, setFare] = useState<number | null>(null);

  const calculateFare = async () => {
    try {
      const response = await fetch('http://localhost/project/api/CalculateFare.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ startLocation, endLocation, isStudent }),
      });

      const data = await response.json();

      if (response.ok) {
        setFare(data.fare);
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error('Error calculating fare:', error);
      alert('Failed to calculate fare.');
    }
  };

  return (
    <div className="fare-calculator-container">
      <div className="fare-calculator">
        <h1 className="title">
          <span className="icon">🚌</span> Fare Calculator
        </h1>
        <div className="inputs">
          <button
            className="location-btn"
            onClick={() => setStartLocation('23.8103,90.4125')}
          >
            Set Start Point
          </button>
          <button
            className="location-btn"
            onClick={() => setEndLocation('23.8143,90.4145')}
          >
            Set End Point
          </button>
        </div>
        <div className="map">
          {/* Use Google Maps or Leaflet for an interactive map */}
          <iframe
            title="Map"
            width="100%"
            height="300"
            src={`https://www.google.com/maps/embed/v1/view?key=YOUR_API_KEY&center=23.8103,90.4125&zoom=12`}
            style={{ border: 0, borderRadius: '8px' }}
          ></iframe>
        </div>
        <div className="discounts">
          <label>
            <input
              type="checkbox"
              checked={isStudent}
              onChange={(e) => setIsStudent(e.target.checked)}
            />
            Student (50% discount)
          </label>
        </div>
        <button className="calculate-btn" onClick={calculateFare}>
          Calculate Fare
        </button>
        {fare !== null && (
          <div className="fare-details">
            <h2>Fare Details</h2>
            <p>Start Point: {startLocation || 'Not Set'}</p>
            <p>End Point: {endLocation || 'Not Set'}</p>
            <p>Fare: <strong>৳{fare}</strong></p>
          </div>
        )}
      </div>
    </div>
  );
}
