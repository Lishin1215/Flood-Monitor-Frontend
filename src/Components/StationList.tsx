import React, { useEffect, useState } from "react";
import axios from "axios";
import "./StationList.css";

const API_URL = process.env.REACT_APP_API_BASE_URL;

interface Station {
  station_id: string;
  catchment_name?: string;
}

const StationList: React.FC<{ onSelect: (stationId: string, stationName: string) => void }> = ({ onSelect }) => {
const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 8;

  useEffect(() => {
    axios
      .get("http://127.0.0.1:5000/get-stations")
      .then((res) => {
        setStations(res.data.stations || []);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load stations. Please try again later.");
        setLoading(false);
      });
  }, []);

  const filteredStations = stations.filter((station) => {
    const name = typeof station.catchment_name === "string" ? station.catchment_name.toLowerCase() : "";
    const id = typeof station.station_id === "string" ? station.station_id.toLowerCase() : "";
    return name.includes(searchTerm.toLowerCase()) || id.includes(searchTerm.toLowerCase());
  });

  
  const totalPages = Math.ceil(filteredStations.length / itemsPerPage);
  const paginatedStations = filteredStations.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="station-list-container">
      <h2 className="station-list-title">🚏 Select a Station</h2>


      <input
        type="text"
        placeholder="🔍 Search by name or ID..."
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setCurrentPage(1);
        }}
        className="search-input"
      />

      {loading ? (
        <p className="text-center text-gray-500">Loading stations...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <>
          <ul className="station-list">
            {paginatedStations.map((station) => (
              <li key={station.station_id} className="station-item">
                <button onClick={() => onSelect(station.station_id, station.catchment_name || "unknown")} className="station-button">
                  {station.catchment_name || "Unknown"} ({station.station_id})
                </button>
              </li>
            ))}
          </ul>

          {totalPages > 1 && (
            <div className="pagination-container">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="pagination-button"
              >
                ← Previous
              </button>
              <span className="pagination-text">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="pagination-button"
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default StationList;
