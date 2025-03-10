import React, { useEffect, useState } from "react";
import axios from "axios";
import "./MeasurementList.css";

interface Measurement {
  parameterName: string;
  qualifier: string;
  notation: string;
  hasData: boolean;
}

interface MeasurementListProps {
  stationId: string;
}

const MeasurementList: React.FC<MeasurementListProps> = ({ stationId }) => {
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [selectedNotation, setSelectedNotation] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios
      .get(`http://127.0.0.1:5000/get-measurement/${stationId}`)
      .then((res) => {
        const fetchedMeasurements = res.data.measurements || [];
        setMeasurements(fetchedMeasurements);
        
        // 預設選擇第一個測項
        if (fetchedMeasurements.length > 0) {
          setSelectedNotation(fetchedMeasurements[0].notation);
        }

        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load measurements. Please try again later.");
        setLoading(false);
      });
  }, [stationId]);

  if (loading) {
    return <p className="text-center text-gray-500">Loading measurements...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  if (measurements.length === 0) {
    return (
      <div className="measurement-container">
        <h2 className="measurement-title">
          Measurements for Station {stationId}
        </h2>
        <p className="measurement-text">No measurements found.</p>
      </div>
    );
  }

  return (
    <div className="measurement-container">
      <h2 className="measurement-title">
        Measurements for Station {stationId}
      </h2>

      
      {measurements.length > 1 && (
        <div className="measurement-toggle-container">
          {measurements.map((measurement) => (
            <button
              key={measurement.notation}
              onClick={() => setSelectedNotation(measurement.notation)}
              className={`measurement-toggle-button ${
                selectedNotation === measurement.notation ? "active" : "inactive"
              }`}
            >
              {measurement.parameterName} ({measurement.qualifier})
            </button>
          ))}
        </div>
      )}

      
      {selectedNotation && (
        <div className="measurement-details">
          <h3>Selected Measurement</h3>
          <p><strong>Station ID:</strong> {stationId}</p>
          <p><strong>Parameter:</strong> {measurements.find((m) => m.notation === selectedNotation)?.parameterName}</p>
          <p><strong>Qualifier:</strong> {measurements.find((m) => m.notation === selectedNotation)?.qualifier}</p>
        </div>
      )}
    </div>
  );
};

export default MeasurementList;
