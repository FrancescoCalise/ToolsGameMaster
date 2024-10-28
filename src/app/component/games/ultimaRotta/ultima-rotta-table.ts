import { TableConfig } from "../../../interface/TableConfig";

export const ultimaRottaTable: TableConfig[] = [
  {
    columns: ['Armi Bianche', 'Danno', 'Distanza', 'Costo'],
    data: [
      { 'Armi Bianche': 'Mani nude', 'Danno': '1', 'Distanza': '', 'Costo': 'GRATIS' },
      { 'Armi Bianche': 'Tirapugni', 'Danno': 'D4', 'Distanza': '', 'Costo': '30 R' },
      { 'Armi Bianche': 'Coltello da cucina', 'Danno': 'D4', 'Distanza': '', 'Costo': '20 R' },
      { 'Armi Bianche': 'Coltello da caccia', 'Danno': 'D6', 'Distanza': 'Dist.10 m.', 'Costo': '40 R' },
      { 'Armi Bianche': 'Spada corta', 'Danno': 'D8', 'Distanza': '', 'Costo': '60 R' },
      { 'Armi Bianche': 'Accetta da lancio', 'Danno': 'D8', 'Distanza': 'Dist.10 m.', 'Costo': '80 R' },
      { 'Armi Bianche': 'Spada, Ascia, Mazza', 'Danno': 'D10', 'Distanza': '', 'Costo': '100 R' },
      { 'Armi Bianche': 'Ascia a due mani, Spadone', 'Danno': 'D12', 'Distanza': '', 'Costo': '200 R' }
    ]
  },
  {
    columns: ['Armi Energetiche', 'Danno', 'Tipo', 'Durata', 'Costo'],
    data: [
      { 'Armi Energetiche': 'Fulmilama', 'Danno': 'D12**', 'Tipo': '', 'Durata': '3*', 'Costo': '300 R' },
      { 'Armi Energetiche': 'Folgore', 'Danno': 'D20**', 'Tipo': '2 Mani', 'Durata': '1*', 'Costo': '500 R' },
    ],
    notes: [
      { symbol: '*', idml: '', description: 'La durata indica per quanti combattimenti può venire accessa prima di essere ricaricata' },
      { symbol: '**', idml: '', description: 'Il danno invariabile non viene modificato da nulla.' }
    ]
  },
  {
    columns: ['Armi Meccaniche', 'Danno', 'Dist', 'Tipo', 'Colpi', 'Costo'],
    data: [
      { 'Armi Meccaniche': 'Sparachiodi minore', 'Danno': 'D6+Man', 'Dist': '20 m.', 'Tipo': '', 'Colpi': '10', 'Costo': '60 R' },
      { 'Armi Meccaniche': 'Sparachiodi rapido', 'Danno': 'D6+Man', 'Dist': '20 m.', 'Tipo': 'Raffica***', 'Colpi': '20', 'Costo': '100 R' },
      { 'Armi Meccaniche': 'Sparachiodi pesante', 'Danno': 'D10+Man', 'Dist': '50 m.', 'Tipo': '', 'Colpi': '6', 'Costo': '200 R' },
      { 'Armi Meccaniche': 'Sparachiodi greve', 'Danno': 'D12+Man', 'Dist': '100 m.', 'Tipo': '', 'Colpi': '20', 'Costo': '300 R' },
      { 'Armi Meccaniche': 'Sparachiodi da guerra', 'Danno': 'D12+Man', 'Dist': '100 m.', 'Tipo': 'Raffica***', 'Colpi': '40', 'Costo': '500 R' },
      { 'Armi Meccaniche': 'Impalatore', 'Danno': 'D20+Man', 'Dist': '50 m.', 'Tipo': '', 'Colpi': '1', 'Costo': '500 R' }
    ],
    notes: [
      { symbol: 'Note', idml: '', description: 'Armi Meccaniche attacco su percesione / Danno su Manualità' },
    ]
  },
  {
    columns: ['Armi Folgoranti', 'Danno', 'Dist', 'Tipo', 'Costo'],
    data: [
      { 'Armi Folgoranti': 'Sparalampo', 'Danno': 'D10+Man', 'Dist': '100 m.', 'Tipo': '2 Mani', 'Costo': '500 R' },
      { 'Armi Folgoranti': 'Sparafulmini', 'Danno': 'D10+Man', 'Dist': '100 m.', 'Tipo': '2 Mani, Raffica ***', 'Costo': '800 R' },
      { 'Armi Folgoranti': 'Fogolrante', 'Danno': 'D12+Man', 'Dist': '100 m.', 'Tipo': '2 Mani', 'Costo': '1000 R' },
    ],
    notes: [
      { symbol: 'Note', idml: '', description: 'Armi Folgoranti attacco su percesione / Danno su Manualità' },
    ]
  },
  {
    columns: ['Bombe', 'Danno', 'Raggio', 'Tipo'],
    data: [
      { 'Bombe': 'B-Boom', 'Danno': 'D20', 'Dist': '10 m.', 'Tipo': 'Danno invariabile, lancio da 20m.' },
      { 'Bombe': 'B-Flash', 'Danno': 'D10', 'Dist': '10 m.', 'Tipo': 'Test Coraggio (8) o restare inermi per 2D6 Giri' },
      { 'ABombe': 'B-Gas', 'Danno': 'Var', 'Dist': '10 m.', 'Tipo': 'Test Forza (8) o subire 2D6 e-1 a tutti i test per 2D6 Giri, lancio 20 m' },
    ],
    notes: [
      { symbol: 'Note', idml: '', description: 'Bombe attacco su percesione / Danno su invariabile' },
      { symbol: 'Inermme', idml: '', description: 'Cosa fa inerme?' }
    ]
  },
  {
    columns: ['Risultato', 'Area Maciullata', 'Modificatorti'],
    data: [
      { 'Risultato': '7', 'Area Maciullata': 'Corpo', 'Modificatorti': '-1 PS Massimi' },
      { 'Risultato': '8', 'Area Maciullata': 'Testa', 'Modificatorti': '-1 Percezione' },
      { 'Risultato': '9', 'Area Maciullata': 'Braccio destro', 'Modificatorti': ' -1 Forza e -1 Manualità' },
      { 'Risultato': '10', 'Area Maciullata': 'Braccio sinistro', 'Modificatorti': ' -1 Forza e -1 Manualità' },
      { 'Risultato': '11', 'Area Maciullata': 'Gamba destra', 'Modificatorti': ' -1 Agilità' },
      { 'Risultato': '12', 'Area Maciullata': 'Gamba sinistra', 'Modificatorti': ' -1 Agilità' },
      { 'Risultato': '13', 'Area Maciullata': 'Corpo', 'Modificatorti': '-2 PS Massimi' },
      { 'Risultato': '14', 'Area Maciullata': 'Testa', 'Modificatorti': '-1 Percezione e -1 Intelligenza' },
      { 'Risultato': '15', 'Area Maciullata': 'Braccio destro', 'Modificatorti': ' -2 Forza e -2 Manualità' },
      { 'Risultato': '16', 'Area Maciullata': 'Braccio sinistro', 'Modificatorti': ' -2 Forza e -2 Manualità' },
      { 'Risultato': '17', 'Area Maciullata': 'Gamba destra', 'Modificatorti': ' -2 Agilità' },
      { 'Risultato': '18', 'Area Maciullata': 'Gamba sinistra', 'Modificatorti': ' -2 Agilità' },
      { 'Risultato': '19', 'Area Maciullata': 'Corpo', 'Modificatorti': '-3 PS Massimi' },
      { 'Risultato': '20', 'Area Maciullata': 'Testa', 'Modificatorti': '-2 Percezione e -2 Intelligenza' }
    ],
    notes: [
      { symbol: 'Note', idml: '', description: 'Da 1 a 6 non succede nulla' },
      { symbol: '->', idml: '', description: 'Da 7 a 20 Inerme +  modificatori' }
    ]
  }


];
