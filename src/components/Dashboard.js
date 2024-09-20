import React, { useState, useEffect } from 'react';
import {
  LineChart, Line, PieChart, Pie, Cell,
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer, ReferenceLine
} from 'recharts';
import './Dashboard.css';

/**
 * Generates a random number following a normal distribution.
 * @param {number} mean - The mean value.
 * @param {number} stdDev - The standard deviation.
 * @returns {number} - A random number.
 */
const normalRandom = (mean, stdDev) => {
  const u = 1 - Math.random();
  const v = Math.random();
  const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  return z * stdDev + mean;
};

/**
 * Clamps a value between a minimum and maximum range.
 * @param {number} value - The value to clamp.
 * @param {number} min - The minimum value.
 * @param {number} max - The maximum value.
 * @returns {number} - The clamped value.
 */
const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

// Initial state for the simulation
let ultimaTemperatura = normalRandom(20, 5); // Initial average temperature of 20°C with a standard deviation of 5°C

/**
 * Generates daily data for weather, production, finance, and sustainability.
 * @param {number} giorno - The day of the month.
 * @param {Object|null} [datoPrecedente=null] - The previous day's data.
 * @returns {Object} - The generated data for the day.
 */
const generaDatiGiornalieri = (giorno, datoPrecedente = null) => {
  const colturePossibili = ['Grano', 'Mais', 'Pomodori', 'Vite', 'Olivo'];
  const coltura = colturePossibili[Math.floor(Math.random() * colturePossibili.length)];

  // Generate temperature with a maximum deviation of 5% from the previous day
  let nuovaTemperatura;
  if (datoPrecedente) {
    const scostamentoMax = ultimaTemperatura * 0.05;
    nuovaTemperatura = clamp(
      normalRandom(ultimaTemperatura, scostamentoMax / 2),
      ultimaTemperatura - scostamentoMax,
      ultimaTemperatura + scostamentoMax
    );
  } else {
    nuovaTemperatura = ultimaTemperatura;
  }
  ultimaTemperatura = nuovaTemperatura;

  return {
    giorno,
    meteo: {
      temperatura: parseFloat(nuovaTemperatura.toFixed(1)),
      umidita: parseFloat(clamp(normalRandom(60, 10), 30, 90).toFixed(1)),
      pioggia: parseFloat(Math.max(0, normalRandom(10, 5)).toFixed(1))
    },
    produzione: {
      coltura,
      resa: parseFloat(Math.max(0, normalRandom(75, 15)).toFixed(2)),
      prezzoVendita: parseFloat(Math.max(0, normalRandom(3, 0.5)).toFixed(2))
    },
    finanza: {
      costiProduzione: parseFloat(Math.max(0, normalRandom(750, 100)).toFixed(2)),
      ricavi: parseFloat(Math.max(0, normalRandom(1500, 200)).toFixed(2)),
      profitto: parseFloat(normalRandom(400, 150).toFixed(2)),
      margineProfitto: parseFloat(clamp(normalRandom(20, 5), 0, 40).toFixed(2))
    },
    sostenibilita: {
      consumoAcqua: parseFloat(Math.max(0, normalRandom(300, 50)).toFixed(2)),
      emissioniCO2: parseFloat(Math.max(0, normalRandom(125, 25)).toFixed(2))
    }
  };
};

const Dashboard = () => {
  const [dati, setDati] = useState([]);
  const [darkMode, setDarkMode] = useState(true);
  const [intervallo, setIntervallo] = useState(null);

  /**
   * Toggles the dark mode state.
   */
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [darkMode]);

  /**
   * Generates monthly data.
   */
  const generaDatiMensili = () => {
    const oggi = new Date();
    const nuoviDati = [];
    for (let i = -22; i <= 7; i++) {
      const giorno = new Date(oggi);
      giorno.setDate(oggi.getDate() + i);
      const datoPrecedente = nuoviDati[nuoviDati.length - 1];
      nuoviDati.push({
        ...generaDatiGiornalieri(giorno.getDate(), datoPrecedente),
        data: giorno.toISOString().split('T')[0],
        previsione: i > 0
      });
    }
    setDati(nuoviDati);
  };

  /**
   * Updates future data.
   */
  const aggiornaDatiFuturi = () => {
    setDati(datiPrecedenti => {
      const oggi = new Date().toISOString().split('T')[0];
      return datiPrecedenti.map((dato, index) => {
        if (dato.data > oggi) {
          const datoPrecedente = index > 0 ? datiPrecedenti[index - 1] : null;
          return {
            ...generaDatiGiornalieri(new Date(dato.data).getDate(), datoPrecedente),
            data: dato.data,
            previsione: true
          };
        }
        return dato;
      });
    });
  };

  /**
   * Starts the automatic update of future data.
   */
  const avviaAggiornamentoAutomatico = () => {
    if (!intervallo) {
      const nuovoIntervallo = setInterval(() => {
        aggiornaDatiFuturi();
      }, 2000);
      setIntervallo(nuovoIntervallo);
    }
  };

  /**
   * Stops the automatic update of future data.
   */
  const fermaAggiornamentoAutomatico = () => {
    if (intervallo) {
      clearInterval(intervallo);
      setIntervallo(null);
    }
  };

  useEffect(() => {
    generaDatiMensili();
    return () => {
      if (intervallo) clearInterval(intervallo);
    };
  }, []);

  const colori = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  /**
   * Aggregates crop data.
   */
  const datiColture = dati.reduce((acc, giorno) => {
    const coltura = giorno.produzione.coltura;
    const esistente = acc.find(item => item.name === coltura);
    if (esistente) {
      esistente.value++;
    } else {
      acc.push({ name: coltura, value: 1 });
    }
    return acc;
  }, []);

  /**
   * Formats the X-axis labels.
   * @param {string} tickItem - The tick item.
   * @returns {string} - The formatted date.
   */
  const formatXAxis = (tickItem) => {
    const date = new Date(tickItem);
    return `${date.getDate()}/${date.getMonth() + 1}`;
  };

  /**
   * Custom tooltip for the charts.
   * @param {Object} param0 - The tooltip parameters.
   * @param {boolean} param0.active - Whether the tooltip is active.
   * @param {Array} param0.payload - The payload data.
   * @param {string} param0.label - The label.
   * @returns {JSX.Element|null} - The custom tooltip element.
   */
  const customTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = new Date(label);
      const oggi = new Date();
      const isPrediction = data > oggi;
      return (
        <div className="custom-tooltip" style={{ backgroundColor: '#333333', padding: '10px', border: '1px solid #ccc' }}>
          <p style={{color: '#fff'}}>{`Data: ${data.toLocaleDateString()}`}</p>
          {payload.map((pld, index) => (
            <p key={index} style={{color: pld.color}}>{`${pld.name}: ${pld.value}`}</p>
          ))}
          {isPrediction && <p style={{color: 'red'}}>Previsione</p>}
        </div>
      );
    }
    return null;
  };

  /**
   * Renders a chart component.
   * @param {React.Component} ChartComponent - The chart component to render.
   * @param {Array<string>} dataKeys - The data keys for the chart.
   * @param {Array<string>} nomi - The names for the chart data.
   * @param {Array<string>} colori - The colors for the chart data.
   * @param {string|null} [stackId=null] - The stack ID for the chart (if applicable).
   * @returns {JSX.Element} - The rendered chart component.
   */
  const renderChart = (ChartComponent, dataKeys, nomi, colori, stackId = null) => (
    <ChartComponent data={dati}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis
        dataKey="data"
        tickFormatter={formatXAxis}
        ticks={dati.map(d => d.data)}
        angle={-45}
        textAnchor="end"
        height={70}
        interval={0}
      />
      <YAxis />
      <Tooltip content={customTooltip} />
      <Legend />
      <ReferenceLine
        x={new Date().toISOString().split('T')[0]}
        stroke="red"
        strokeDasharray="3 3"
        strokeWidth={2}
        label={{
          value: "Oggi",
          position: "top",
          fill: darkMode ? "#ffffff" : "#000000",
          fontSize: 12,
          dy: 10,
          padding: 5,
          backgroundColor: darkMode ? "#333333" : "#ffffff",
          borderRadius: 3,
          border: '2px solid black',
          fontWeight: 'bold'
        }}
      />
      {dataKeys.map((dataKey, index) => {
        if (ChartComponent === AreaChart) {
          return <Area key={dataKey} type="monotone" dataKey={dataKey} stackId={stackId} stroke={colori[index]} fill={colori[index]} name={nomi[index]} />;
        } else if (ChartComponent === LineChart) {
          return <Line key={dataKey} type="monotone" dataKey={dataKey} stroke={colori[index]} name={nomi[index]} />;
        } else if (ChartComponent === BarChart) {
          return <Bar key={dataKey} dataKey={dataKey} fill={colori[index]} name={nomi[index]} />;
        }
      })}
    </ChartComponent>
  );

  return (
    <div className="dashboard">
      <h1>Dashboard Agricolo - Dati Mensili</h1>
      <div className="controls">
        <button onClick={generaDatiMensili}>Genera Dati Iniziali</button>
        <button onClick={avviaAggiornamentoAutomatico}>Avvia Aggiornamento Automatico</button>
        <button onClick={fermaAggiornamentoAutomatico}>Ferma Aggiornamento Automatico</button>
        <button onClick={toggleDarkMode}>
          {darkMode ? 'Disattiva Modalità Scura' : 'Attiva Modalità Scura'}
        </button>
      </div>
      <p>Data corrente: {new Date().toLocaleDateString()}</p>
      <p>I dati a partire da {new Date(new Date().setDate(new Date().getDate() + 1)).toLocaleDateString()} sono delle previsioni.</p>
      <div className="grafici-container">
        <div className="grafico">
          <h2>Condizioni Meteo</h2>
          <ResponsiveContainer width="100%" height={300}>
            {renderChart(
              BarChart,
              ["meteo.temperatura", "meteo.umidita", "meteo.pioggia"],
              ["Temperatura", "Umidità", "Pioggia"],
              [colori[0], colori[1], colori[2]]
            )}
          </ResponsiveContainer>
        </div>

        <div className="grafico">
          <h2>Produzione e Prezzo</h2>
          <ResponsiveContainer width="100%" height={300}>
            {renderChart(
              LineChart,
              ["produzione.resa", "produzione.prezzoVendita"],
              ["Resa", "Prezzo di Vendita"],
              [colori[3], colori[4]]
            )}
          </ResponsiveContainer>
        </div>

        <div className="grafico">
          <h2>Distribuzione Colture</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={datiColture}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                label
              >
                {datiColture.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colori[index % colori.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="grafico">
          <h2>Finanze</h2>
          <ResponsiveContainer width="100%" height={300}>
            {renderChart(
              AreaChart,
              ["finanza.costiProduzione", "finanza.ricavi", "finanza.profitto"],
              ["Costi di Produzione", "Ricavi", "Profitto"],
              [colori[5], colori[6], colori[7]],
              "1"
            )}
          </ResponsiveContainer>
        </div>

        <div className="grafico">
          <h2>Margine di Profitto</h2>
          <ResponsiveContainer width="100%" height={300}>
            {renderChart(
              LineChart,
              ["finanza.margineProfitto"],
              ["Margine di Profitto (%)"],
              [colori[0]]
            )}
          </ResponsiveContainer>
        </div>

        <div className="grafico">
          <h2>Sostenibilità</h2>
          <ResponsiveContainer width="100%" height={300}>
            {renderChart(
              BarChart,
              ["sostenibilita.consumoAcqua", "sostenibilita.emissioniCO2"],
              ["Consumo d'Acqua", "Emissioni CO2"],
              [colori[1], colori[2]]
            )}
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;