import React, {useState} from 'react';
import logo from './logo.svg';
import './App.css';
import StationList from './Components/StationList';

function App() {
  const [selectedStation, setSelectedStation] = useState<string | null>(null);
  return (
   <div>
    <h1>
      Station Selector</h1>
      <StationList onSelect={setSelectedStation}></StationList>
   </div>
  );
}

export default App;
