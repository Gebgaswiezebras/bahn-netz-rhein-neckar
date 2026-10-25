//=====================================================
// 🚲 FAHRRADWEGE
//=====================================================
//
// bikeWayTypes  = Kategorien (Ausbauart) mit Name und Farbe
// bikeSegments  = einzelne Radweg-Abschnitte auf der Karte
//
// Jeder Abschnitt braucht:
// - name   = Bezeichnung (erscheint im Popup)
// - type   = Schlüssel aus bikeWayTypes, z. B. "getrennt"
// - points = Koordinaten des Verlaufs
//
// Wird in index.html VOR script.js geladen.


//-----------------------------------------------------
// FAHRRADWEG-KATEGORIEN
//-----------------------------------------------------
//
// Jeder Fahrradweg-Abschnitt bekommt später eine dieser Kategorien.
// Die Farbe bestimmt, wie der Abschnitt auf der Karte dargestellt wird.

const bikeWayTypes = {
    schnellweg: {
        label: "Radschnellweg",
        color: "#1B9E77"
    },

    fahrradstrasse: {
        label: "Fahrradstraße",
        color: "#377eb8"
    },

    radfahrstreifen: {
        label: "Radfahrstreifen",
        color: "#a937b8"
    },

    schutzstreifen: {
        label: "Schutzstreifen",
        color: "#E6AB02"
    },

    gemeinsam: {
        label: "Gemeinsamer Geh- und Radweg",
        color: "#FF7F00"
    },

    unklar: {
        label: "Unklare / gemischte Führung",
        color: "#999999"
    }
};


//===========================================
// Radweg 1
// ==========================================
const bikeSegments = [
    {
        name: "Radschnellweg Spinelli Schleuse Feudnenheim",
        type: "schnellweg",

        points: [
            [49.498453, 8.512262],
            [49.496128, 8.512543],
            [49.495626, 8.512632],
            [49.494332, 8.513235],
            [49.494187, 8.513226],
            [49.494073, 8.513127],
            [49.493789, 8.511816],
            [49.493683, 8.511586],
            [49.493513, 8.511395],
            [49.493333, 8.511299],
            [49.493002, 8.511328],
            [49.492636, 8.511477],
            [49.492296, 8.511442],
            [49.490204, 8.512451],
            [49.488742, 8.512333]
        ]
    },

];