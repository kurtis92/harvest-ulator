const numeroCasuale = (minimo, massimo) => Math.random() * (massimo - minimo) + minimo;
const sceltaCasuale = (opzioni) => opzioni[Math.floor(Math.random() * opzioni.length)];

export const generaDatiGiornalieri = (giorno) => {
  const colturePossibili = ['Grano', 'Mais', 'Pomodori', 'Vite', 'Olivo'];
  const coltura = sceltaCasuale(colturePossibili);
  
  let resa, prezzoVendita;
  switch (coltura) {
    case 'Grano':
      resa = numeroCasuale(30, 60);
      prezzoVendita = numeroCasuale(20, 30);
      break;
    case 'Mais':
      resa = numeroCasuale(80, 120);
      prezzoVendita = numeroCasuale(15, 25);
      break;
    case 'Pomodori':
      resa = numeroCasuale(300, 600);
      prezzoVendita = numeroCasuale(40, 60);
      break;
    case 'Vite':
      resa = numeroCasuale(70, 120);
      prezzoVendita = numeroCasuale(30, 50);
      break;
    case 'Olivo':
      resa = numeroCasuale(20, 50);
      prezzoVendita = numeroCasuale(300, 500);
      break;
    default:
      resa = 0;
      prezzoVendita = 0;
  }
  
  const costiProduzione = numeroCasuale(500, 1500);
  const ricavi = resa * prezzoVendita;
  const profitto = ricavi - costiProduzione;
  const margineProfitto = (profitto / ricavi) * 100;

  return {
    giorno,
    meteo: {
      temperatura: parseFloat(numeroCasuale(5, 35).toFixed(1)),
      umidita: parseFloat(numeroCasuale(30, 90).toFixed(1)),
      pioggia: parseFloat(numeroCasuale(0, 50).toFixed(1)),
    },
    produzione: {
      coltura,
      resa: parseFloat(resa.toFixed(2)),
      prezzoVendita: parseFloat(prezzoVendita.toFixed(2)),
    },
    finanza: {
      costiProduzione: parseFloat(costiProduzione.toFixed(2)),
      ricavi: parseFloat(ricavi.toFixed(2)),
      profitto: parseFloat(profitto.toFixed(2)),
      margineProfitto: parseFloat(margineProfitto.toFixed(2)),
    },
    sostenibilita: {
      consumoAcqua: parseFloat(numeroCasuale(100, 500).toFixed(2)),
      emissioniCO2: parseFloat(numeroCasuale(50, 200).toFixed(2)),
    },
  };
};

export const convertiInXML = (dati) => {
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<dati_agricoli>\n';
  dati.forEach(giorno => {
    xml += `  <giorno numero="${giorno.giorno}">\n`;
    xml += `    <meteo>\n`;
    xml += `      <temperatura>${giorno.meteo.temperatura}</temperatura>\n`;
    xml += `      <umidita>${giorno.meteo.umidita}</umidita>\n`;
    xml += `      <pioggia>${giorno.meteo.pioggia}</pioggia>\n`;
    xml += `    </meteo>\n`;
    xml += `    <produzione>\n`;
    xml += `      <coltura>${giorno.produzione.coltura}</coltura>\n`;
    xml += `      <resa>${giorno.produzione.resa}</resa>\n`;
    xml += `      <prezzoVendita>${giorno.produzione.prezzoVendita}</prezzoVendita>\n`;
    xml += `    </produzione>\n`;
    xml += `    <finanza>\n`;
    xml += `      <costiProduzione>${giorno.finanza.costiProduzione}</costiProduzione>\n`;
    xml += `      <ricavi>${giorno.finanza.ricavi}</ricavi>\n`;
    xml += `      <profitto>${giorno.finanza.profitto}</profitto>\n`;
    xml += `      <margineProfitto>${giorno.finanza.margineProfitto}</margineProfitto>\n`;
    xml += `    </finanza>\n`;
    xml += `    <sostenibilita>\n`;
    xml += `      <consumoAcqua>${giorno.sostenibilita.consumoAcqua}</consumoAcqua>\n`;
    xml += `      <emissioniCO2>${giorno.sostenibilita.emissioniCO2}</emissioniCO2>\n`;
    xml += `    </sostenibilita>\n`;
    xml += `  </giorno>\n`;
  });
  xml += '</dati_agricoli>';
  return xml;
};
