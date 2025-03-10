import React, { useState } from "react";
import StationList from "./Components/StationList";
import MeasurementList from "./Components/MeasurementList";
import "./App.css"; 

const App: React.FC = () => {
  const [selectedStation, setSelectedStation] = useState<string | null>(null);

  return (
    <div className="app-container">
      <div className="card-container">
        <h1 className="title">🌊 Flood Monitor Dashboard</h1>

        {!selectedStation ? (
          <StationList onSelect={setSelectedStation} />
        ) : (
          <MeasurementList stationId={selectedStation} />
        )}

        <div className="button-group">
          {selectedStation && (
            <button
              onClick={() => setSelectedStation(null)}
              className="btn btn-back"
            >
              🔙 Back to Stations
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
