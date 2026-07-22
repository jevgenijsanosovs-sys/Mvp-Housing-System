const water = {
  resident: {
    title: "Ūdens skaitītāju rādījumi",
    subtitle: "Iesniedziet pašreizējos ūdens skaitītāju rādījumus.",
    noMeters: "Ūdens skaitītāji nav atrasti.",
    apartment: "Dzīvoklis",
    notAssigned: "Nav piešķirts",
    meterCount: {
      one: "{{count}} skaitītājs",
      other: "{{count}} skaitītāji",
    },

    period: {
      statusTitle: "Ūdens skaitītāju rādījumu iesniegšanas statuss",
      openTitle: "Ūdens skaitītāju rādījumu iesniegšana ir atvērta",
      closedTitle: "Ūdens skaitītāju rādījumu iesniegšana ir slēgta",
      loading: "Ielādē ūdens skaitītāju rādījumu iesniegšanas periodu...",
      loadFailed: "Neizdevās ielādēt ūdens skaitītāju rādījumu iesniegšanas periodu.",
      unavailable: "Ūdens skaitītāju rādījumu iesniegšanas periods nav pieejams.",
      openUntil: "Rādījumus var iesniegt līdz {{date}}.",
      opensOn: "Nākamais rādījumu iesniegšanas periods sāksies {{date}}.",
      closedOn: "Pēdējais rādījumu iesniegšanas periods beidzās {{date}}.",
    },
  },

  card: {
    water: "Ūdens",
    coldWater: "Aukstais ūdens",
    hotWater: "Karstais ūdens",
    customWater: "{{type}} ūdens",
    riser: "Stāvvads",
    serialNumber: "Sērijas numurs",
    currentReading: "Pašreizējais rādījums",
    lastSubmitted: "Pēdējoreiz iesniegts",
    newReading: "Jaunais rādījums, m³",
    submit: "Iesniegt",
    submitting: "Iesniedz...",
    inputHint: "Ievadiet pilnu skaitītāja rādījumu. Cipari pirms komata ir kubikmetri; trīs cipari pēc komata ir litri.",
    viewHistory: "Skatīt vēsturi",
  },

  history: {
    title: "Skaitītāja vēsture",
    typeHistory: "{{type}} vēsture",
    waterMeter: "Ūdens skaitītājs",
    loading: "Ielādē vēsturi...",
    apartment: "Dzīvoklis",
    noPreviousReadings: "Iepriekšēju rādījumu nav.",
    date: "Datums",
    reading: "Rādījums",
    consumption: "Patēriņš",
    correct: "Labot",
    correctLatestReading: "Labot jaunāko rādījumu",
    correctedReading: "Labotais rādījums, m³",
    correctionReason: "Labošanas iemesls",
    otherReason: "Cits iemesls",
    describeReason: "Aprakstiet iemeslu",
    enterCorrectionReason: "Ievadiet labošanas iemeslu",
    cancel: "Atcelt",
    saving: "Saglabā...",
    saveCorrection: "Saglabāt labojumu",
    close: "Aizvērt",

    reasons: {
      incorrectDigit: "Ievadīts nepareizs cipars",
      wrongMeter: "Izvēlēts nepareizs skaitītājs",
      decimalPoint: "Kļūda decimālatdalītājā",
      other: "Cits",
    },
  },
};

export default water;
