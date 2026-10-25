//=====================================================
// 🚋 LINIEN-DATEN
//=====================================================
//
// Alle Straßenbahn- und S-Bahn-Linien mit:
// - type  = "tram" oder "sbahn" (bestimmt die Markerform)
// - color = Linienfarbe
//
// Neue Linie anlegen: hier eintragen, dann Stationen
// in stations.js und Gleisverlauf in tracks.js ergänzen.
//
// Wird in index.html VOR script.js geladen.

//=====================================================
// LINIEN-DATEN
//=====================================================
//
// Jede Linie bekommt jetzt:
// - type  = Art der Linie ("tram" oder "sbahn")
// - color = Farbe der Linie
//
// Vorteil:
// Später können Straßenbahn und S-Bahn unterschiedlich aussehen,
// bleiben aber trotzdem mit denselben Stationsdaten kompatibel.

const transitLines = {
    "1": {
        type: "tram",
        color: "#F39A9A"
    },

    "2": {
        type: "tram",
        color: "#B00043"
    },

    "3": {
        type: "tram",
        color: "#D5AD00"
    },

    "4": {
        type: "tram",
        color: "#E2000A"
    },

    "5": {
        type: "tram",
        color: "#00965D"
    },

    "6": {
        type: "tram",
        color: "#946A25"
    },

    "6A": {
        type: "tram",
        color: "#946A25"
    },

    "7": {
        type: "tram",
        color: "#FECB00"
    },

    "9X": {
        type: "tram",
        color: "#93C23B"
    },

    "10": {
        type: "tram",
        color: "#A60F7F"
    },

    "12": {
        type: "tram",
        color: "#DB603C"
    },

    "15": {
        type: "tram",
        color: "#F6AA62"
    },

    "16": {
        type: "tram",
        color: "#5D6BAE"
    },

    "21": {
        type: "tram",
        color: "#E3030E"
    },

    "22": {
        type: "tram",
        color: "#FDC300"
    },

    "23": {
        type: "tram",
        color: "#E48E00"
    },

    "24": {
        type: "tram",
        color: "#8C1D75"
    },

    "26": {
        type: "tram",
        color: "#F39B9A"
    },

    //=====================================================
    // S-BAHN-LINIEN
    //=====================================================
    //
    // Diese Linien kannst du später Stationen hinzufügen,
    // z. B. lines: ["S1"] oder lines: ["1", "S1"]

    "S1": {
        type: "sbahn",
        color: "#EE1D23"
    },

    "S2": {
        type: "sbahn",
        color: "#0078C0"
    },

    "S3": {
        type: "sbahn",
        color: "#FFE545"
    },

    "S5": {
        type: "sbahn",
        color: "#9E4B21"
    },

    "S6": {
        type: "sbahn",
        color: "#01BDF2"
    },
    
    "S7": {
        type: "sbahn",
        color: "#F79735"
    },
    
    "S8": {
        type: "sbahn",
        color: "#ED4A9B"
    },
    
    "S9": {
        type: "sbahn",
        color: "#7FC241"
    },

    "S10": {
        type: "sbahn",
        color: "#A46EA7"
    },
    
    "S12": {
        type: "sbahn",
        color: "#F5A8CA"
    },
    
    "S33": {
        type: "sbahn",
        color: "#7C51A1"
    },

    "S44": {
        type: "sbahn",
        color: "#108C85"
    }
};