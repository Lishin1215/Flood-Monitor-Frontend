import React, { useEffect, useState } from "react";
import axios from "axios";
import ChartComponent from "./ChartComponent";
import "./MeasurementList.css";
import * as Sentry from "@sentry/react";

// export default MeasurementList;
interface Measurement {
  parameterName: string;
  qualifier: string;
  notation: string;
  hasData: boolean;
}
interface MeasurementListProps {
    stationId: string;
    stationName: string;
  }
  
  const MeasurementList: React.FC<MeasurementListProps> = ({ stationId, stationName }) => {
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
  
          if (fetchedMeasurements.length > 0) {
            setSelectedNotation(fetchedMeasurements[0].notation);
          }
  
          setLoading(false);
        })
        .catch((err) => {
            Sentry.captureException(err);
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
            {stationName} ({stationId})
          </h2>
          <p className="measurement-text">No measurements found.</p>
        </div>
      );
    }
  
    return (
      <div className="measurement-container">
        <h2 className="measurement-title">
          {stationName} ({stationId})
        </h2>
  
        {measurements.length > 0 && (
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
  
        {selectedNotation && <ChartComponent notation={selectedNotation} />}
      </div>
    );
  };
  
  export default MeasurementList;
  