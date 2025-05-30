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
    // =============================================
    // useState
    const [measurements, setMeasurements] = useState<Measurement[]>([]);
    const [selectedNotation, setSelectedNotation] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);


    // =============================================
    // function 
    useEffect(() => { // Component 一出現就會執行
      axios
        .get(`https://flood.api-janet-web.com/get-measurement/${stationId}`)
        .then((res) => {
          const fetchedMeasurements = res.data.measurements || [];
          setMeasurements(fetchedMeasurements);
  
          if (fetchedMeasurements.length > 0) {
            // set "notation" so that can pass it to chart
            setSelectedNotation(fetchedMeasurements[0].notation);
          }
  
          setLoading(false);
        })
        .catch((err) => {
            Sentry.captureException(err);
            setError("Failed to load measurements. Please try again later.");
            setLoading(false);
        });
    }, [stationId]); // *** need?
  
  
    // =============================================
  // start of UI
  return (
    <div className="measurement-container">
      <h2 className="measurement-title">
        {stationName} ({stationId})
      </h2>

      {loading ? (
        <p className="text-center text-gray-500">Loading measurements...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : measurements.length === 0 ? (
        <p className="measurement-text">No measurements found.</p>
      ) : (
        <>
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

          {selectedNotation && <ChartComponent notation={selectedNotation} />}
        </>
      )}
    </div>
  );
};

export default MeasurementList;