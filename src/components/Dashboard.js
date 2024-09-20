import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { generaDatiGiornalieri, convertiInXML } from '../utils/dataUtils';
import './Dashboard.css';

const Dashboard = () => {
  const [dati, setDati] = useState([]);

  const generaDati = () => {
    const nuoviDati = Array.from({ length: 30 }, (_, i) => generaDatiGiornalieri(i + 1));
    setDati(nuoviDati);
  };

  useEffect(() => {
    generaDati();
  }, []);

  const scaricaFile = (contenuto, nomeFile, tipo) => {
    const blob = new Blob([contenuto], { type: tipo });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = nomeFile;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const scaricaJSON = () => {
    scaricaFile(JSON.stringify(dati, null, 2), 'dati_agricoli.json', 'application/json');
  };

  const scaricaXML = () => {
    scaricaFile(convertiInXML(dati), 'dati_agricoli.xml', 'application/xml');
  };

  return (
    <div className="dashboard">
      <h1>Dashboard Agricolo</h1>
      
      <div className="button-container">
        <button onClick={generaDati}>Genera Nuovi Dati</button>
        <button onClick={scaricaJSON}>Scarica JSON</button>
        <button onClick={scaricaXML}>Scarica XML</button>
      </div>
      
      <div className="chart-container">
        <BarChart width={600} height={300} data={dati}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="giorno" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="meteo.temperatura" fill="#8884d8" name="Temperatura" />
          <Bar dataKey="produzione.resa" fill="#82ca9d" name="Resa" />
        </BarChart>
      </div>
      
      <div className="data-container">
        <h2>Dati JSON:</h2>
        <pre>{JSON.stringify(dati, null, 2)}</pre>
        
        <h2>Dati XML:</h2>
        <pre>{convertiInXML(dati)}</pre>
      </div>
    </div>
  );
};

export default Dashboard;
