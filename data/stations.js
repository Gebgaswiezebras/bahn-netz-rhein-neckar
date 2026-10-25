//=====================================================
// 🚉 STATIONSDATEN
//=====================================================
//
// Alle Stationen von Straßenbahn und S-Bahn.
// Jede reale Station steht nur EINMAL in der Liste,
// auch wenn mehrere Linien dort halten.
//
// Eigenschaften jeder Station:
//
// name       = Name der Haltestelle
// lat / lng  = Koordinaten
// lines      = Linien, die hier halten, z. B. ["1", "3", "S9"]
// details    = optional: Bahnsteige, Anzeiger usw.
//              (Nachbarstationen werden NICHT mehr eingetragen,
//               script.js berechnet sie automatisch aus tracks.js)
// discovered = Quizstatus (false = noch nicht erraten)
//
// Wird in index.html VOR script.js geladen.


//=====================================================
// Linie 1
//=====================================================

const tramStations = [
    {
        name: "Schönau",
        lat: 49.546929,
        lng: 8.474256,

        lines: ["1"],


        discovered: false
    },
    {
        name: "Schönauschule",
        lat: 49.543949,
        lng: 8.474107,

        lines: ["1"],


        discovered: false
    },
    {
        name: "Schönau Siedlung",
        lat: 49.539664,
        lng: 8.473378,

        lines: ["1"],


        discovered: false
    },
    {
        name: "Waldhof Nord",
        lat: 49.530915,
        lng: 8.481215,

        lines: ["1"],


        discovered: false
    },
    {
        name: "Waldhof Bahnhof",
        lat: 49.524967,
        lng: 8.481942,

        lines: ["1", "S9", "S10"],


        discovered: false
    },
    {
        name: "Luzenberg",
        lat: 49.516218,
        lng: 8.475493,

        lines: ["1","3", "S9"],


        discovered: false
    },
    {
        name: "Untermühlaustraße",
        lat: 49.511030,
        lng: 8.471373,

        lines: ["1","3"],


        discovered: false
    },
    {
        name: "Herzogenriedstraße",
        lat: 49.508590,
        lng: 8.470686,

        lines: ["1","3"],


        discovered: false
    },
    {
        name: "Neuer Meßplatz",
        lat: 49.505159,
        lng: 8.469971,

        lines: ["1","3"],


        discovered: false
    },
    {
        name: "Carl-Benz-Straße",
        lat: 49.499544,
        lng: 8.471546,

        lines: ["1","3"],


        discovered: false
    },
    {
        name: "Alte Feuerwache",
        lat: 49.496017,
        lng: 8.473652,

        lines: ["1", "2","3","4"],


        discovered: false
    },
    {
        name: "Abendakademie",
        lat: 49.491711,
        lng: 8.469846,

        lines: ["1","3","4", "5", "7"],

        details: {
        bahnsteiggleise: 2,
        aussenbahnsteige: 2,
        inselbahnsteige: 0,

        getrennt: false,
        doppelhaltestelle: false,
    },

        discovered: false
    },
    {
        name: "Marktplatz",
        lat: 49.489449,
        lng: 8.467781,

        lines: ["1","3","4", "5", "7"],

        details: {
        bahnsteiggleise: 2,
        aussenbahnsteige: 2,
        inselbahnsteige: 0,

        getrennt: false,
        doppelhaltestelle: false,
    },

        discovered: false
    },
    {
        name: "Paradeplatz",
        lat: 49.487760,
        lng: 8.466203,

        lines: ["1","2","3","4", "5", "7"],

        details: {
        bahnsteiggleise: 4,
        aussenbahnsteige: 4,
        inselbahnsteige: 0,

        getrennt: true,
        doppelhaltestelle: false,
    },

        discovered: false
    },
        {
        name: "Schloss",
        lat: 49.484944,
        lng: 8.463589,

        lines: ["1", "5", "7"],


        discovered: false
    },
    {
        name: "Universität",
        lat: 49.482036,
        lng: 8.464609,

        lines: ["1", "4", "5", "6", "6A", "7", "15"],


        discovered: false
    },
    {
        name: "MA Hbf",
        lat: 49.479804,
        lng: 8.469966,

        lines: ["1", "3", "4", "5", "6", "6A", "9X", "15", "S1", "S2", "S3", "S5", "S6", "S9", "S10"],


        discovered: false
    },
    {
        name: "Tattersall",
        lat: 49.481791,
        lng: 8.473005,

        lines: ["1", "6", "6A", "9X"],


        discovered: false
    },
    {
        name: "Kopernikusstraße",
        lat: 49.478509,
        lng: 8.477416,

        lines: ["1"],


        discovered: false
    },
    {
        name: "Krappmühlstraße",
        lat: 49.475208,
        lng: 8.481281,

        lines: ["1"],


        discovered: false
    },
    {
        name: "Hochschule",
        lat: 49.469682,
        lng: 8.483961,

        lines: ["1"],


        discovered: false
    },
    {
        name: "Lettestraße",
        lat: 49.465397,
        lng: 8.486765,

        lines: ["1"],


        discovered: false
    },
    {
        name: "Voltastraße",
        lat: 49.461277,
        lng: 8.490136,

        lines: ["1"],


        discovered: false
    },
    {
        name: "Neckarau Bahnhof",
        lat: 49.455471,
        lng: 8.494599,

        lines: ["1", "S6", "S9"],


        discovered: false
    },
    {
        name: "Friedrichstraße",
        lat: 49.453429,
        lng: 8.495283,

        lines: ["1"],


        discovered: false
    },
    {
        name: "Isarweg",
        lat: 49.449324,
        lng: 8.502712,

        lines: ["1"],


        discovered: false
    },
    {
        name: "Dannstadter Straße",
        lat: 49.446208,
        lng: 8.509179,

        lines: ["1"],


        discovered: false
    },
    {
        name: "Sandrain",
        lat: 49.443206,
        lng: 8.515547,

        lines: ["1"],


        discovered: false
    },
    {
        name: "Rheinau Karlsplatz",
        lat: 49.438801,
        lng: 8.523158,

        lines: ["1"],


        discovered: false
    },
    {
        name: "Neuhofer Straße",
        lat: 49.435332,
        lng: 8.525860,

        lines: ["1"],


        discovered: false
    },
    {
        name: "Waldseestraße",
        lat: 49.431750,
        lng: 8.528653,

        lines: ["1"],


        discovered: false
    },
    {
        name: "Distelsand",
        lat: 49.427947,
        lng: 8.531598,

        lines: ["1"],


        discovered: false
    },
    {
        name: "Rheinau Bahnhof",
        lat: 49.424092,
        lng: 8.535092,

        lines: ["1", "S6", "S9"],


        discovered: false
    },

//=====================================================
// Linie 2
//=====================================================

{
        name: "Neckarstadt West",
        lat: 49.503053,
        lng: 8.460085,

        lines: ["2", "S9"],


        discovered: false
},
{
        name: "Bürgermeister-Fuchs-Straße",
        lat: 49.501245,
        lng: 8.463708,

        lines: ["2"],


        discovered: false
},
{
        name: "Neumarkt",
        lat: 49.498905,
        lng: 8.467501,

        lines: ["2"],


        discovered: false
},
{
        name: "Kurpfalzbrücke",
        lat: 49.493626,
        lng: 8.469741,

        lines: ["2"],


        discovered: false
},
{
        name: "MVV-Hochhaus",
        lat: 49.493957,
        lng: 8.466281,

        lines: ["2"],


        discovered: false
},
{
        name: "Dalbergstraße",
        lat: 49.493430,
        lng: 8.461191,

        lines: ["2"],


        discovered: false
},
{
        name: "MA Rheinstraße",
        lat: 49.490970,
        lng: 8.457935,

        lines: ["2"],


        discovered: false
},
{
        name: "MA Rathaus/rem",
        lat: 49.489195,
        lng: 8.462422,

        lines: ["2"],


        discovered: false
},
{
        name: "Strohmarkt",
        lat: 49.486256,
        lng: 8.470049,

        lines: ["2", "3", "4"],


        discovered: false
},
{
        name: "Wasserturm",
        lat: 49.484885,
        lng: 8.473436,

        lines: ["2", "3", "4"],


        discovered: false
},
{
        name: "Rosengarten",
        lat: 49.485384,
        lng: 8.475410,

        lines: ["2", "5", "15"],


        discovered: false
},
{
        name: "Nationaltheater",
        lat: 49.487682,
        lng: 8.477654,

        lines: ["2", "5", "7", "15"],

        details: {
        bahnsteiggleise: 3,
        aussenbahnsteige: 3,
        inselbahnsteige: 0,

        getrennt: true,
        doppelhaltestelle: false,
    },

        discovered: false
},
{
        name: "Theresienkrankenhaus",
        lat: 49.489945,
        lng: 8.480862,

        lines: ["2", "5", "7", "15"],

        details: {
        bahnsteiggleise: 2,
        aussenbahnsteige: 2,
        inselbahnsteige: 0,

        getrennt: false,
        doppelhaltestelle: true,
    },

        discovered: false
},
{
        name: "Universitätsklinikum",
        lat: 49.493698,
        lng: 8.484211,

        lines: ["2", "4", "5", "7", "15"],

        details: {
        bahnsteiggleise: 3,
        aussenbahnsteige: 2,
        inselbahnsteige: 1,

        getrennt: false,
        doppelhaltestelle: true,

        anzeiger: "digital_gross",
    },

        discovered: false
},
{
        name: "Bibienastraße",
        lat: 49.494631,
        lng: 8.488596,

        lines: ["2", "7"],

        details: {
        bahnsteiggleise: 2,
        aussenbahnsteige: 2,
        inselbahnsteige: 0,

        getrennt: false,
        doppelhaltestelle: false,
    },

        discovered: false
},
{
        name: "MA Hauptfriedhof",
        lat: 49.490830,
        lng: 8.491229,

        lines: ["2", "7"],

        details: {
        bahnsteiggleise: 2,
        aussenbahnsteige: 2,
        inselbahnsteige: 0,

        getrennt: false,
        doppelhaltestelle: false,
    },

        discovered: false
},
{
        name: "Pfeifferswörth",
        lat: 49.489439,
        lng: 8.501453,

        lines: ["2", "7"],

        details: {
        bahnsteiggleise: 2,
        aussenbahnsteige: 2,
        inselbahnsteige: 0,

        getrennt: false,
        doppelhaltestelle: false,
    },

        discovered: false
},
{
        name: "Neckarplatt",
        lat: 49.488940,
        lng: 8.512486,

        lines: ["2", "7"],

        details: {
        bahnsteiggleise: 2,
        aussenbahnsteige: 2,
        inselbahnsteige: 0,

        getrennt: false,
        doppelhaltestelle: false,
    },

        discovered: false
},
{
        name: "Am Aubuckel",
        lat: 49.488559,
        lng: 8.518743,

        lines: ["2"],


        discovered: false
},
{
        name: "Liebfrauenstraße",
        lat: 49.488397,
        lng: 8.523538,

        lines: ["2"],


        discovered: false
},
{
        name: "Blücherstraße",
        lat: 49.487322,
        lng: 8.527555,

        lines: ["2"],


        discovered: false
},
{
        name: "Feudenheim Kirche",
        lat: 49.486358,
        lng: 8.530571,

        lines: ["2"],


        discovered: false
},
{
        name: "Neckarstraße",
        lat: 49.484260,
        lng: 8.532215,

        lines: ["2"],


        discovered: false
},
{
        name: "Feudenheim",
        lat: 49.483981,
        lng: 8.537921,

        lines: ["2"],


        discovered: false
},


//=====================================================
// Linie 3
//=====================================================

{
        name: "Sandhofen",
        lat: 49.542147,
        lng: 8.449335,

        lines: ["3"],


        discovered: false
},
{
        name: "Hanfstraße",
        lat: 49.538429,
        lng: 8.451024,

        lines: ["3"],


        discovered: false
},
{
        name: "Bürstadter Straße",
        lat: 49.535337,
        lng: 8.453112,

        lines: ["3"],


        discovered: false
},
{
        name: "Papyrus",
        lat: 49.533467,
        lng: 8.459843,

        lines: ["3"],


        discovered: false
},
{
        name: "Zellstoff-Fabrik",
        lat: 49.531339,
        lng: 8.465095,

        lines: ["3"],


        discovered: false
},
{
        name: "Roche",
        lat: 49.528468,
        lng: 8.468932,

        lines: ["3"],


        discovered: false
},
{
        name: "Altrheinstraße",
        lat: 49.525534,
        lng: 8.471064,

        lines: ["3"],


        discovered: false
},
{
        name: "Stolberger Straße",
        lat: 49.518159,
        lng: 8.473820,

        lines: ["3"],


        discovered: false
},
{
        name: "Kunsthalle",
        lat: 49.483106,
        lng: 8.473284,

        lines: ["3", "4", "5", "15"],


        discovered: false
},
{
        name: "MA Hbf Süd",
        lat: 49.477121,
        lng: 8.467868,

        lines: ["3"],


        discovered: false
},
{
        name: "Windeckstraße",
        lat: 49.474530,
        lng: 8.468721,

        lines: ["3"],


        discovered: false
},
{
        name: "Diesterwegschule",
        lat: 49.471352,
        lng: 8.469932,

        lines: ["3"],


        discovered: false
},
{
        name: "Meeräckerplatz",
        lat: 49.469118,
        lng: 8.471711,

        lines: ["3"],


        discovered: false
},
{
        name: "Markuskirche",
        lat: 49.464921,
        lng: 8.475351,

        lines: ["3"],


        discovered: false
},
{
        name: "Franz-Sigel-Straße",
        lat: 49.462538,
        lng: 8.477090,

        lines: ["3"],


        discovered: false
},
{
        name: "Freiheitsplatz",
        lat: 49.459309,
        lng: 8.479498,

        lines: ["3"],


        discovered: false
},
{
        name: "Neckarau West",
        lat: 49.455394,
        lng: 8.481890,

        lines: ["3"],


        discovered: false
},
{
        name: "Tannhäuserring",
        lat: 49.452319,
        lng: 8.477349,

        lines: ["3"],


        discovered: false
},
{
        name: "Stollenwörth",
        lat: 49.450776,
        lng: 8.472416,

        lines: ["3"],


        discovered: false
},
{
        name: "Rheingoldhalle",
        lat: 49.449930,
        lng: 8.469698,

        lines: ["3"],


        discovered: false
},


//=====================================================
// Linie 4
//=====================================================

{
        name: "Käfertaler Wald",
        lat: 49.529183,
        lng: 8.508967,

        lines: ["4"],


        discovered: false
},
{
        name: "Carl-Benz-Bad",
        lat: 49.526605,
        lng: 8.505593,

        lines: ["4"],


        discovered: false
},
{
        name: "Waldfriedhof",
        lat: 49.535594,
        lng: 8.494451,

        lines: ["4"],


        discovered: false
},
{
        name: "Freilichtbühne",
        lat: 49.533708,
        lng: 8.493078,

        lines: ["4"],


        discovered: false
},
{
        name: "Waldstraße",
        lat: 49.528402,
        lng: 8.489776,

        lines: ["4"],


        discovered: false
},
{
        name: "Erlöserkirche",
        lat: 49.525735,
        lng: 8.496797,

        lines: ["4"],


        discovered: false
},
{
        name: "Hermann-Gutzmann-Schule",
        lat: 49.523047,
        lng: 8.501048,

        lines: ["4"],


        discovered: false
},
{
        name: "Speckweg",
        lat: 49.520868,
        lng: 8.499232,

        lines: ["4"],


        discovered: false
},
{
        name: "Hessische Straße",
        lat: 49.515458,
        lng: 8.496308,

        lines: ["4"],


        discovered: false
},
{
        name: "Jugendverkehrsschule",
        lat: 49.511535,
        lng: 8.493778,

        lines: ["4"],


        discovered: false
},
{
        name: "Ulmenweg",
        lat: 49.507551,
        lng: 8.493319,

        lines: ["4"],


        discovered: false
},
{
        name: "Landwehrstraße",
        lat: 49.505649,
        lng: 8.490083,

        lines: ["4"],


        discovered: false
},
{
        name: "Hochuferstraße",
        lat: 49.503004,
        lng: 8.487643,

        lines: ["4"],


        discovered: false
},
{
        name: "Bonifatiuskirche",
        lat: 49.498606,
        lng: 8.488851,

        lines: ["4", "5", "15"],


        discovered: false
},
{
        name: "Lange Rötterstraße",
        lat: 49.495919,
        lng: 8.486603,

        lines: ["4", "5", "15"],


        discovered: false
},
{
        name: "Schafweide",
        lat: 49.494653,
        lng: 8.479416,

        lines: ["4"],


        discovered: false
},
{
        name: "Berliner Platz/LU Mitte",
        lat: 49.479320,
        lng: 8.451545,

        lines: ["4", "6", "6A", "7", "9X", "10", "12", "15", "S1", "S2", "S3", "S5", "S6"],


        discovered: false
},
{
        name: "Kaiser-Wilhelm-Straße",
        lat: 49.481505,
        lng: 8.448401,

        lines: ["4", "7", "10", "15"],


        discovered: false
},
{
        name: "Pfalzbau",
        lat: 49.479669,
        lng: 8.444886,

        lines: ["4", "7", "10", "15"],


        discovered: false
},
{
        name: "Bürgermeister-Kutterer-Straße",
        lat: 49.477733,
        lng: 8.441364,

        lines: ["4", "10", "15"],


        discovered: false
},
{
        name: "LU Hbf",
        lat: 49.476967,
        lng: 8.434633,

        lines: ["4", "9X", "10", "15", "S1", "S2", "S3", "S5", "S6", "S44"],


        discovered: false
},
{
        name: "Rohrlachstraße",
        lat: 49.483152,
        lng: 8.429331,

        lines: ["4", "9X"],


        discovered: false
},
{
        name: "LU Hauptfriedhof",
        lat: 49.484272,
        lng: 8.421840,

        lines: ["4"],


        discovered: false
},
{
        name: "Heinrich-Pesch-Haus",
        lat: 49.483612,
        lng: 8.413379,

        lines: ["4"],


        discovered: false
},
{
        name: "Wollstraße",
        lat: 49.485592,
        lng: 8.397413,

        lines: ["4"],


        discovered: false
},
{
        name: "Zum Guten Hirten",
        lat: 49.488269,
        lng: 8.387361,

        lines: ["4"],


        discovered: false
},
{
        name: "Mannheimer Tor",
        lat: 49.490983,
        lng: 8.378888,

        lines: ["4"],


        discovered: false
},
{
        name: "Hans-Warsch-Platz",
        lat: 49.492652,
        lng: 8.376320,

        lines: ["4", "9X"],


        discovered: false
},
{
        name: "Wilhelm-Tell-Straße",
        lat: 49.490519,
        lng: 8.370367,

        lines: ["4"],


        discovered: false
},
{
        name: "Oggersheim Comeniusstraße",
        lat: 49.488611, 
        lng: 8.364626,

        lines: ["4", "9X"],


        discovered: false
},
{
        name: "Westlich B9",
        lat: 49.483439,
        lng: 8.354056,

        lines: ["4", "9X"],


        discovered: false
},
{
        name: "Ruchheim Bahnhof",
        lat: 49.478531,
        lng: 8.327701,

        lines: ["4", "9X"],


        discovered: false
},
{
        name: "Maxdorf Bahnhof",
        lat: 49.480137,
        lng: 8.293717,

        lines: ["4", "9X"],


        discovered: false
},
{
        name: "Maxdorf Süd",
        lat: 49.476469,
        lng: 8.289276,

        lines: ["4", "9X"],


        discovered: false
},
{
        name: "Fußgönheim",
        lat: 49.466376,
        lng: 8.287566,

        lines: ["4", "9X"],


        discovered: false
},
{
        name: "Ellerstadt Ost",
        lat: 49.464071,
        lng: 8.264443,

        lines: ["4", "9X"],


        discovered: false
},
{
        name: "Ellerstadt West",
        lat: 49.462594,
        lng: 8.255116,

        lines: ["4", "9X"],


        discovered: false
},
{
        name: "Gönnheim",
        lat: 49.458042,
        lng: 8.232084,

        lines: ["4", "9X"],


        discovered: false
},
{
        name: "Friedelsheim",
        lat: 49.457977,
        lng: 8.224983,

        lines: ["4", "9X"],


        discovered: false
},
{
        name: "Bad Dürkheim Ost",
        lat: 49.463400,
        lng: 8.184857,

        lines: ["4", "9X"],


        discovered: false
},
{
        name: "Bad Dürkheim Bahnhof",
        lat: 49.461361,
        lng: 8.170501,

        lines: ["4", "9X"],


        discovered: false
},


//=====================================================
// Linie 5
//=====================================================


{
        name: "Collini-Center",
        lat: 49.491686,
        lng: 8.476961,

        lines: ["5"],


        discovered: false
},
{
        name: "Lessingstraße",
        lat: 49.489191,
        lng: 8.485510,

        lines: ["5"],

        details: {
        bahnsteiggleise: 2,
        aussenbahnsteige: 2,
        inselbahnsteige: 0,
        inselbahnsteigkanten: 0,
        anzeiger: "digital_gross",
        getrennt: false,
        doppelhaltestelle: false,
    },

        discovered: false
},
{
        name: "Fernmeldeturm",
        lat: 49.486882,
        lng: 8.493383,

        lines: ["5"],

        details: {
        bahnsteiggleise: 2,
        aussenbahnsteige: 2,
        inselbahnsteige: 0,
        inselbahnsteigkanten: 0,
        anzeiger: "digital_gross",
        getrennt: false,
        doppelhaltestelle: false,
    },

        discovered: false
},
{
        name: "Holbeinstraße",
        lat: 49.481259,
        lng: 8.512630,

        lines: ["5"],

        details: {
        bahnsteiggleise: 2,
        aussenbahnsteige: 2,
        inselbahnsteige: 0,
        inselbahnsteigkanten: 0,
        anzeiger: "digital_gross",
        getrennt: false,
        doppelhaltestelle: false,
    },

        discovered: false
},
{
        name: "Neuostheim",
        lat: 49.477612,
        lng: 8.522974,

        lines: ["5", "6"],

        details: {
        bahnsteiggleise: 4,
        aussenbahnsteige: 2,
        inselbahnsteige: 1,
        inselbahnsteigkanten: 2,
        anzeiger: "digital_gross",
        getrennt: false,
        doppelhaltestelle: false,
    },

        discovered: false

},
{
        name: "Duale Hochschule",
        lat: 49.475321,
        lng: 8.534370,

        lines: ["5"],

        details: {
        bahnsteiggleise: 2,
        aussenbahnsteige: 2,
        inselbahnsteige: 0,
        inselbahnsteigkanten: 0,
        anzeiger: "digital_gross",
        getrennt: false,
        doppelhaltestelle: false,
    },

        discovered: false
},
{
        name: "Pforzheimer Straße",
        lat: 49.473471,
        lng: 8.550020,

        lines: ["5"],

        details: {
        bahnsteiggleise: 2,
        aussenbahnsteige: 2,
        inselbahnsteige: 0,
        inselbahnsteigkanten: 0,
        anzeiger: "digital_gross",
        getrennt: false,
        doppelhaltestelle: false,
    },

        discovered: false
},
{
        name: "Deutscher Hof",
        lat: 49.470850,
        lng: 8.557086,

        lines: ["5"],

        details: {
        bahnsteiggleise: 2,
        aussenbahnsteige: 2,
        inselbahnsteige: 0,
        inselbahnsteigkanten: 0,
        anzeiger: "analog",
        getrennt: false,
        doppelhaltestelle: false,
    },

        discovered: false
},
{
        name: "Seckenheim Rathaus",
        lat: 49.467117,
        lng: 8.562963,

        lines: ["5"],

        details: {
        bahnsteiggleise: 2,
        aussenbahnsteige: 2,
        inselbahnsteige: 0,
        inselbahnsteigkanten: 0,
        anzeiger: "digital_gross",
        getrennt: false,
        doppelhaltestelle: false,
    },

        discovered: false
},
{
        name: "Seckenheim OEG-Bahnhof",
        lat: 49.462091,
        lng: 8.569668,

        lines: ["5"],

        details: {
        bahnsteiggleise: 3,
        aussenbahnsteige: 1,
        inselbahnsteige: 1,
        inselbahnsteigkanten: 2,
        anzeiger: "digital_gross",
        getrennt: false,
        doppelhaltestelle: false,
    },

        discovered: false
},
{
        name: "Neu-Edingen Gewerbegebiet",
        lat: 49.454311,
        lng: 8.591271,

        lines: ["5"],

        details: {
        bahnsteiggleise: 2,
        aussenbahnsteige: 2,
        inselbahnsteige: 0,
        inselbahnsteigkanten: 0,
        anzeiger: "digital_gross",
        getrennt: true,
        doppelhaltestelle: false,
    },

        discovered: false
},
{
        name: "Edingen West",
        lat: 49.446924,
        lng: 8.604315,

        lines: ["5"],

        details: {
        bahnsteiggleise: 2,
        aussenbahnsteige: 2,
        inselbahnsteige: 0,
        inselbahnsteigkanten: 0,
        anzeiger: "digital_gross",
        getrennt: true,
        doppelhaltestelle: false,
    },

        discovered: false
},
{
        name: "Edingen Bahnhof",
        lat: 49.441375,
        lng: 8.614992,

        lines: ["5"],

        details: {
        bahnsteiggleise: 3,
        aussenbahnsteige: 0,
        inselbahnsteige: 2,
        inselbahnsteigkanten: 4,
        anzeiger: "digital_gross",
        getrennt: false,
        doppelhaltestelle: false,
    },

        discovered: false
},
{
        name: "Taubenfeld",
        lat: 49.428611,
        lng: 8.642546,

        lines: ["5"],

        details: {
        bahnsteiggleise: 2,
        aussenbahnsteige: 2,
        inselbahnsteige: 0,
        inselbahnsteigkanten: 0,
        anzeiger: "digital_gross",
        getrennt: false,
        doppelhaltestelle: false,
    },

        discovered: false
},
{
        name: "Wieblingen Mitte",
        lat: 49.423684,
        lng: 8.645927,

        lines: ["5"],

        details: {
        bahnsteiggleise: 2,
        aussenbahnsteige: 2,
        inselbahnsteige: 0,
        inselbahnsteigkanten: 0,
        anzeiger: "digital_gross",
        getrennt: false,
        doppelhaltestelle: false,
    },

        discovered: false
},
{
        name: "SRH Campus",
        lat: 49.415483,
        lng: 8.649378,

        lines: ["5"],

        details: {
        bahnsteiggleise: 2,
        aussenbahnsteige: 2,
        inselbahnsteige: 0,
        inselbahnsteigkanten: 0,
        anzeiger: "analog",
        getrennt: false,
        doppelhaltestelle: false,
    },

        discovered: false
},
{
        name: "Ochsenkopf",
        lat: 49.409513,
        lng: 8.652524,

        lines: ["5"],

        details: {
        bahnsteiggleise: 2,
        aussenbahnsteige: 2,
        inselbahnsteige: 0,
        inselbahnsteigkanten: 0,
        anzeiger: "digital_gross",
        getrennt: false,
        doppelhaltestelle: false,
    },

        discovered: false
},
{
        name: "Berufsschule",
        lat: 49.408534,
        lng: 8.660879,

        lines: ["5"],

        details: {
        bahnsteiggleise: 2,
        aussenbahnsteige: 2,
        inselbahnsteige: 0,
        inselbahnsteigkanten: 0,
        anzeiger: "analog",
        getrennt: false,
        doppelhaltestelle: false,
    },

        discovered: false
},
{
        name: "Gneisenaustraße Süd",
        lat: 49.406628,
        lng: 8.667272,

        lines: ["5"],

        details: {
        bahnsteiggleise: 2,
        aussenbahnsteige: 2,
        inselbahnsteige: 0,
        inselbahnsteigkanten: 0,
        anzeiger: "digital_gross",
        getrennt: false,
        doppelhaltestelle: false,
    },

        discovered: false
},
{
        name: "HD Hbf",
        lat: 49.404189,
        lng: 8.676111,

        lines: ["5", "21", "24", "S1", "S2", "S3", "S7", "S8"],

        details: {

        //---------------------------------------------
        // Gilt für die Straßenbahn
        //---------------------------------------------
        getrennt: false,
        doppelhaltestelle: false,

        //---------------------------------------------
        // Straßenbahnhaltestelle
        //---------------------------------------------
        tram: {
            bahnsteiggleise: 4,
            aussenbahnsteige: 0,
            inselbahnsteige: 2,
            inselbahnsteigkanten: 4,
            anzeiger: "digital_gross"
        },

        //---------------------------------------------
        // S-Bahn-Bahnhof
        //---------------------------------------------
        sbahn: {
            bahnsteiggleise: 4,
            aussenbahnsteige: 0,
            inselbahnsteige: 2
        },
    },

        discovered: false
},
{
        name: "Stadtwerke",
        lat: 49.404988,
        lng: 8.681834,

        lines: ["5", "21", "24"],


        discovered: false
},
{
        name: "Stadtbücherei",
        lat: 49.406168,
        lng: 8.686420,

        lines: ["5", "21", "22", "23"],

        details: {
        bahnsteiggleise: 2,
        aussenbahnsteige: 2,
        inselbahnsteige: 0,
        inselbahnsteigkanten: 0,
        anzeiger: "digital_gross",
        getrennt: false,
        doppelhaltestelle: true,
    },

        discovered: false
},
{
        name: "Seegarten",
        lat: 49.407112,
        lng: 8.691808,

        lines: ["5", "21", "22", "23"],

        details: {
        bahnsteiggleise: 2,
        aussenbahnsteige: 2,
        inselbahnsteige: 0,
        inselbahnsteigkanten: 0,
        anzeiger: "digital_gross",
        getrennt: false,
        doppelhaltestelle: true,
    },

        discovered: false
},
{
        name: "Bismarckplatz",
        lat: 49.409594,
        lng: 8.693045,

        lines: ["5", "21", "22", "23", "26"],

        details: {
        bahnsteiggleise: 2,
        aussenbahnsteige: 2,
        inselbahnsteige: 0,
        inselbahnsteigkanten: 0,
        anzeiger: "digital_gross",
        getrennt: false,
        doppelhaltestelle: false,
    },

        discovered: false
},
{
        name: "Brückenstraße",
        lat: 49.415522,
        lng: 8.692106,

        lines: ["5", "26"],

        details: {
        bahnsteiggleise: 2,
        aussenbahnsteige: 2,
        inselbahnsteige: 0,
        inselbahnsteigkanten: 0,
        anzeiger: "digital_gross",
        getrennt: false,
        doppelhaltestelle: false,
    },

        discovered: false
},
{
        name: "Kußmaulstraße",
        lat: 49.418763,
        lng: 8.690661,

        lines: ["5", "26"],

        details: {
        bahnsteiggleise: 2,
        aussenbahnsteige: 2,
        inselbahnsteige: 0,
        inselbahnsteigkanten: 0,
        anzeiger: "analog",
        getrennt: false,
        doppelhaltestelle: false,
    },

        discovered: false
},
{
        name: "Blumenthalstraße",
        lat: 49.421814,
        lng: 8.689035,

        lines: ["5", "26"],

        details: {
        bahnsteiggleise: 2,
        aussenbahnsteige: 2,
        inselbahnsteige: 0,
        inselbahnsteigkanten: 0,
        anzeiger: "digital_klein",
        getrennt: false,
        doppelhaltestelle: false,
    },

        discovered: false
},
{
        name: "Kapellenweg",
        lat: 49.424879,
        lng: 8.686744,

        lines: ["5", "26"],

        details: {
        bahnsteiggleise: 2,
        aussenbahnsteige: 2,
        inselbahnsteige: 0,
        inselbahnsteigkanten: 0,
        anzeiger: "analog",
        getrennt: false,
        doppelhaltestelle: false,
    },

        discovered: false
},
{
        name: "Hans-Thoma-Platz",
        lat: 49.427741,
        lng: 8.683156,

        lines: ["5", "21"],

        details: {
        bahnsteiggleise: 3,
        aussenbahnsteige: 2,
        inselbahnsteige: 1,
        inselbahnsteigkanten: 2,
        anzeiger: "digital_gross",
        getrennt: false,
        doppelhaltestelle: false,
    },

        discovered: false
},
{
        name: "Johann-Fischer-Straße",
        lat: 49.430197,
        lng: 8.682486,

        lines: ["5", "21"],

        details: {
        bahnsteiggleise: 2,
        aussenbahnsteige: 2,
        inselbahnsteige: 0,
        inselbahnsteigkanten: 0,
        anzeiger: "digital_neu",
        getrennt: true,
        doppelhaltestelle: false,
    },

        discovered: false
},
{
        name: "Handschuhsheim Burgstraße",
        lat: 49.434707,
        lng: 8.682094,

        lines: ["5", "21"],

        details: {
        bahnsteiggleise: 2,
        aussenbahnsteige: 2,
        inselbahnsteige: 0,
        inselbahnsteigkanten: 0,
        anzeiger: "digital_gross",
        getrennt: false,
        doppelhaltestelle: false,
    },

        discovered: false
},
{
        name: "Dossenheim Süd",
        lat: 49.445871,
        lng: 8.675061,

        lines: ["5", "21"],

        details: {
        bahnsteiggleise: 2,
        aussenbahnsteige: 2,
        inselbahnsteige: 0,
        inselbahnsteigkanten: 0,
        anzeiger: "digital_gross",
        getrennt: false,
        doppelhaltestelle: false,
    },

        discovered: false
},
{
        name: "Dossenheim Bahnhof",
        lat: 49.448436,
        lng: 8.669704,

        lines: ["5", "21"],

        details: {
        bahnsteiggleise: 2,
        aussenbahnsteige: 2,
        inselbahnsteige: 0,
        inselbahnsteigkanten: 0,
        anzeiger: "digital_gross",
        getrennt: false,
        doppelhaltestelle: false,
    },

        discovered: false
},
{
        name: "Dossenheim Nord",
        lat: 49.453157,
        lng: 8.667146,

        lines: ["5", "21"],

        details: {
        bahnsteiggleise: 2,
        aussenbahnsteige: 2,
        inselbahnsteige: 0,
        inselbahnsteigkanten: 0,
        anzeiger: "digital_gross",
        getrennt: false,
        doppelhaltestelle: false,
    },

        discovered: false
},
{
        name: "Schriesheim Süd",
        lat: 49.463462,
        lng: 8.663600,

        lines: ["5", "21"],

        details: {
        bahnsteiggleise: 2,
        aussenbahnsteige: 0,
        inselbahnsteige: 1,
        inselbahnsteigkanten: 2,
        anzeiger: "digital_gross",
        getrennt: false,
        doppelhaltestelle: false,
    },

        discovered: false
},
{
        name: "Schriesheim Bahnhof",
        lat: 49.472044,
        lng: 8.660185,

        lines: ["5", "21"],

        details: {
        bahnsteiggleise: 3,
        aussenbahnsteige: 2,
        inselbahnsteige: 1,
        inselbahnsteigkanten: 2,
        anzeiger: "digital_gross",
        getrennt: false,
        doppelhaltestelle: false,
    },

        discovered: false
},
{
        name: "Zentgrafenstraße",
        lat: 49.477181,
        lng: 8.657561,

        lines: ["5"],

        details: {
        bahnsteiggleise: 1,
        aussenbahnsteige: 1,
        inselbahnsteige: 0,
        inselbahnsteigkanten: 0,
        anzeiger: "analog",
        getrennt: false,
        doppelhaltestelle: false,
    },

        discovered: false
},
{
        name: "Leutershausen Bahnhof",
        lat: 49.497955,
        lng: 8.656624,

        lines: ["5"],

        details: {
        bahnsteiggleise: 2,
        aussenbahnsteige: 1,
        inselbahnsteige: 1,
        inselbahnsteigkanten: 1,
        anzeiger: "digital_gross",
        getrennt: false,
        doppelhaltestelle: false,
    },

        discovered: false
},
{
        name: "Großsachsen Süd",
        lat: 49.509037,
        lng: 8.655953,

        lines: ["5"],

        details: {
        bahnsteiggleise: 2,
        aussenbahnsteige: 2,
        inselbahnsteige: 0,
        inselbahnsteigkanten: 0,
        anzeiger: "digital_gross",
        getrennt: false,
        doppelhaltestelle: false,
    },

        discovered: false
},
{
        name: "Großsachsen Bahnhof",
        lat: 49.514301,
        lng: 8.656788,

        lines: ["5"],

        details: {
        bahnsteiggleise: 2,
        aussenbahnsteige: 2,
        inselbahnsteige: 0,
        inselbahnsteigkanten: 0,
        anzeiger: "digital_gross",
        getrennt: false,
        doppelhaltestelle: false,
    },

        discovered: false
},
{
        name: "Hohensachsen",
        lat: 49.520491,
        lng: 8.655304,

        lines: ["5"],

        details: {
        bahnsteiggleise: 2,
        aussenbahnsteige: 2,
        inselbahnsteige: 0,
        inselbahnsteigkanten: 0,
        anzeiger: "digital_gross",
        getrennt: false,
        doppelhaltestelle: false,
    },

        discovered: false
},
{
        name: "Lützelsachsen Bergstraße",
        lat: 49.526912,
        lng: 8.657187,

        lines: ["5"],

        details: {
        bahnsteiggleise: 2,
        aussenbahnsteige: 2,
        inselbahnsteige: 0,
        inselbahnsteigkanten: 0,
        anzeiger: "digital_gross",
        getrennt: false,
        doppelhaltestelle: false,
    },

        discovered: false
},
{
        name: "Pilgerhaus",
        lat: 49.532991,
        lng: 8.658442,

        lines: ["5"],

        details: {
        bahnsteiggleise: 2,
        aussenbahnsteige: 2,
        inselbahnsteige: 0,
        inselbahnsteigkanten: 0,
        anzeiger: "digital_gross",
        getrennt: false,
        doppelhaltestelle: false,
    },

        discovered: false
},
{
        name: "Rosenbrunnen",
        lat: 49.541012,
        lng: 8.660826,

        lines: ["5"],

        details: {
        bahnsteiggleise: 2,
        aussenbahnsteige: 2,
        inselbahnsteige: 0,
        inselbahnsteigkanten: 0,
        anzeiger: "digital_gross",
        getrennt: false,
        doppelhaltestelle: false,
    },

        discovered: false
},
{
        name: "Weinheim Alter OEG-Bahnhof",
        lat: 49.548891,
        lng: 8.664949,

        lines: ["5"],

        details: {
        bahnsteiggleise: 3,
        aussenbahnsteige: 2,
        aussenbahnsteigkanten: 2,
        inselbahnsteigkanten: 2,
        inselbahnsteige: 1,

        getrennt: false,
        doppelhaltestelle: false,

        anzeiger: "digital_neu"
    },


        discovered: false
},
{
        name: "Weinheim Hbf",
        lat: 49.552648,
        lng: 8.665219,

        lines: ["5", "S5"],

        details: {

        //---------------------------------------------
        // Gilt für die Tramstation
        //---------------------------------------------
        getrennt: false,
        doppelhaltestelle: false,

        //---------------------------------------------
        // Straßenbahnhaltestelle
        //---------------------------------------------
        tram: {
            bahnsteiggleise: 2,
            aussenbahnsteige: 2,
            inselbahnsteige: 0,
            inselbahnsteigkanten: 0,
            anzeiger: "digital_gross"
        },

        //---------------------------------------------
        // S-Bahn-Bahnhof
        //---------------------------------------------
        sbahn: {
            bahnsteiggleise: 4,
            aussenbahnsteige: 2,
            inselbahnsteige: 1,
            inselbahnsteigkanten: 2
        },
    },

        discovered: false
},
{
        name: "Händelstraße",
        lat: 49.548923,
        lng: 8.656259,

        lines: ["5"],

        details: {
        bahnsteiggleise: 2,
        aussenbahnsteige: 2,
        inselbahnsteige: 0,
        inselbahnsteigkanten: 0,
        anzeiger: "analog",
        getrennt: false,
        doppelhaltestelle: false,
    },

        discovered: false
},
{
        name: "Stahlbad",
        lat: 49.545020,
        lng: 8.649149,

        lines: ["5"],

        details: {
        bahnsteiggleise: 2,
        aussenbahnsteige: 2,
        inselbahnsteige: 0,
        inselbahnsteigkanten: 0,
        anzeiger: "digital_gross",
        getrennt: false,
        doppelhaltestelle: false,
    },

        discovered: false
},
{
        name: "Blumenstraße",
        lat: 49.544542,
        lng: 8.638105,

        lines: ["5"],

        details: {
        bahnsteiggleise: 2,
        aussenbahnsteige: 2,
        inselbahnsteige: 0,
        inselbahnsteigkanten: 0,
        anzeiger: "digital_gross",
        getrennt: false,
        doppelhaltestelle: false,
    },

        discovered: false
},
{
        name: "Freiburger Straße",
        lat: 49.545162,
        lng: 8.630569,

        lines: ["5"],

        details: {
        bahnsteiggleise: 2,
        aussenbahnsteige: 2,
        inselbahnsteige: 0,
        inselbahnsteigkanten: 0,
        anzeiger: "digital_gross",
        getrennt: false,
        doppelhaltestelle: false,
    },

        discovered: false
},
{
        name: "Walter-Gropius-Allee",
        lat: 49.539237,
        lng: 8.595821,

        lines: ["5"],

        details: {
        bahnsteiggleise: 2,
        aussenbahnsteige: 2,
        inselbahnsteige: 0,
        inselbahnsteigkanten: 0,
        anzeiger: "analog",
        getrennt: false,
        doppelhaltestelle: false,
    },

        discovered: false
},
{
        name: "Viernheim Ost",
        lat: 49.537538,
        lng: 8.589832,

        lines: ["5"],

        details: {
        bahnsteiggleise: 2,
        aussenbahnsteige: 2,
        inselbahnsteige: 0,
        inselbahnsteigkanten: 0,
        anzeiger: "analog",
        getrennt: false,
        doppelhaltestelle: false,
    },

        discovered: false
},
{
        name: "Viernheim Bahnhof",
        lat: 49.535473,
        lng: 8.582723,

        lines: ["5"],

        details: {
        bahnsteiggleise: 3,
        aussenbahnsteige: 2,
        inselbahnsteige: 1,
        inselbahnsteigkanten: 2,
        anzeiger: "digital_gross",
        getrennt: false,
        doppelhaltestelle: false,
    },

        discovered: false
},
{
        name: "Kapellenberg",
        lat: 49.529807,
        lng: 8.575558,

        lines: ["5"],

        details: {
        bahnsteiggleise: 2,
        aussenbahnsteige: 2,
        inselbahnsteige: 0,
        inselbahnsteigkanten: 0,
        anzeiger: "analog",
        getrennt: false,
        doppelhaltestelle: false,
    },

        discovered: false
},
{
        name: "Tivoli/RNZ",
        lat: 49.528170,
        lng: 8.565208,

        lines: ["5"],

        details: {
        bahnsteiggleise: 2,
        aussenbahnsteige: 2,
        inselbahnsteige: 0,
        inselbahnsteigkanten: 0,
        anzeiger: "digital_gross",
        getrennt: false,
        doppelhaltestelle: false,
    },

        discovered: false
},
{
        name: "Platz der Freundschaft",
        lat: 49.518382,
        lng: 8.538355,

        lines: ["5"],

        details: {
        bahnsteiggleise: 2,
        aussenbahnsteige: 2,
        inselbahnsteige: 0,
        inselbahnsteigkanten: 0,
        anzeiger: "digital_neu",
        getrennt: false,
        doppelhaltestelle: false,
    },

        discovered: false
},
{
        name: "Bensheimer Straße",
        lat: 49.513814,
        lng: 8.527416,

        lines: ["5", "16"],

        details: {
        bahnsteiggleise: 3,
        aussenbahnsteige: 1,
        inselbahnsteige: 1,
        inselbahnsteigkanten: 2,
        anzeiger: "digital_neu",
        getrennt: false,
        doppelhaltestelle: false,
    },

        discovered: false
},
{
        name: "Käfertal Bahnhof",
        lat: 49.509723,
        lng: 8.518231,

        lines: ["5", "15"],

        details: {
        bahnsteiggleise: 4,
        aussenbahnsteige: 1,
        inselbahnsteige: 2,
        inselbahnsteigkanten: 3,
        anzeiger: "digital_gross",
        getrennt: false,
        doppelhaltestelle: false,
    },

        discovered: false
},
{
        name: "Mannheimer Straße",
        lat: 49.507971,
        lng: 8.512975,

        lines: ["5", "15"],

        details: {
        bahnsteiggleise: 2,
        aussenbahnsteige: 2,
        inselbahnsteige: 0,
        inselbahnsteigkanten: 0,
        anzeiger: "digital_gross",
        getrennt: false,
        doppelhaltestelle: false,
    },

        discovered: false
},
{
        name: "Käfertal Süd",
        lat: 49.507066,
        lng: 8.505826,

        lines: ["5", "15"],

        details: {
        bahnsteiggleise: 2,
        aussenbahnsteige: 2,
        inselbahnsteige: 0,
        inselbahnsteigkanten: 0,
        anzeiger: "digital_gross",
        getrennt: true,
        doppelhaltestelle: false,
    },

        discovered: false
},
{
        name: "Boveristraße",
        lat: 49.505354,
        lng: 8.502307,

        lines: ["5", "15"],


        discovered: false
},
{
        name: "Exerzierplatz",
        lat: 49.503443,
        lng: 8.497892,

        lines: ["5", "15"],


        discovered: false
},


//=====================================================
// Linie 6
//=====================================================

{
        name: "Oppau Fritz-Haber-Straße",
        lat: 49.517885,
        lng: 8.410249,

        lines: ["6", "6A", "12"],


        discovered: false
},
{
        name: "Oppau Süd",
        lat: 49.512498,
        lng: 8.407905,

        lines: ["6", "6A", "12"],


        discovered: false
},
{
        name: "Ammoniakstraße",
        lat: 49.505177,
        lng: 8.410398,

        lines: ["6", "6A", "12"],


        discovered: false
},
{
        name: "Rottstückerstraße",
        lat: 49.502828,
        lng: 8.415783,

        lines: ["6", "6A", "12"],


        discovered: false
},
{
        name: "Friesenheim Ost",
        lat: 49.501465,
        lng: 8.421546,

        lines: ["6", "6A", "12"],


        discovered: false
},
{
        name: "Rheinfeldstraße",
        lat: 49.499331,
        lng: 8.424968,

        lines: ["6", "6A", "12"],


        discovered: false
},
{
        name: "Schopenhauerstraße",
        lat: 49.496874,
        lng: 8.426894,

        lines: ["6", "6A", "12"],


        discovered: false
},
{
        name: "BASF Tor 1+2",
        lat: 49.494653,
        lng: 8.433417,

        lines: ["6", "6A", "12"],


        discovered: false
},
{
        name: "Hemshofstraße",
        lat: 49.492204,
        lng: 8.436885,

        lines: ["6", "6A", "12"],


        discovered: false
},
{
        name: "Gartenstraße",
        lat: 49.488904,
        lng: 8.440895,

        lines: ["6", "6A", "12"],


        discovered: false
},
{
        name: "LU Rathaus",
        lat: 49.485393,
        lng: 8.442803,

        lines: ["6", "6A", "12"],


        discovered: false
},
{
        name: "Ludwigstraße",
        lat: 49.483006,
        lng: 8.448483,

        lines: ["6", "6A", "12"],


        discovered: false
},
{
        name: "Werderstraße",
        lat: 49.480645,
        lng: 8.478334,

        lines: ["6", "6A", "9X"],


        discovered: false
},
{
        name: "Pestalozzischule",
        lat: 49.478758,
        lng: 8.482158,

        lines: ["6", "6A", "9X"],


        discovered: false
},
{
        name: "Weberstraße",
        lat: 49.476527,
        lng: 8.485761,

        lines: ["6", "6A", "9X"],


        discovered: false
},
{
        name: "Planetarium",
        lat: 49.476614,
        lng: 8.489737,

        lines: ["6", "6A", "9X"],


        discovered: false
},
{
        name: "Luisenpark/Technoseum",
        lat: 49.478746,
        lng: 8.496253,

        lines: ["6", "9X"],


        discovered: false
},
{
        name: "Carl-Benz-Stadion",
        lat: 49.477854,
        lng: 8.502379,

        lines: ["6"],


        discovered: false
},
{
        name: "Harrlach",
        lat: 49.478201,
        lng: 8.506591,

        lines: ["6"],


        discovered: false
},
{
        name: "Lucas-Cranach-Straße",
        lat: 49.478464,
        lng: 8.512694,

        lines: ["6"],


        discovered: false
},
{
        name: "Schwindstraße",
        lat: 49.478422,
        lng: 8.518370,

        lines: ["6"],


        discovered: false
},
{
        name: "Hans-Thoma-Straße",
        lat: 49.475042,
        lng: 8.524256,

        lines: ["6"],


        discovered: false
},
{
        name: "Maimarkt",
        lat: 49.470018,
        lng: 8.522477,

        lines: ["6"],


        discovered: false
},
{
        name: "SAP-Arena",
        lat: 49.464119,
        lng: 8.519701,

        lines: ["6"],


        discovered: false
},
{
        name: "MA Arena/Maimarkt",
        lat: 49.459933,
        lng: 8.516063,

        lines: ["6", "6A", "S1", "S2", "S3", "S5"],


        discovered: false
},


//=====================================================
// Linie 6A
//=====================================================


{
        name: "Technoseum Süd",
        lat: 49.475967,
        lng: 8.493920,

        lines: ["6A"],


        discovered: false
},
{
        name: "Fahrlach",
        lat: 49.473385,
        lng: 8.498589,

        lines: ["6A"],


        discovered: false
},
{
        name: "Husarenweg",
        lat: 49.469215,
        lng: 8.502739,

        lines: ["6A"],


        discovered: false
},
{
        name: "Ulanenweg",
        lat: 49.467515,
        lng: 8.506463,

        lines: ["6A"],


        discovered: false
},
{
        name: "Gerd-Dehof-Platz",
        lat: 49.465857,
        lng: 8.509939,

        lines: ["6A"],


        discovered: false
},
{
        name: "SAP-Arena Süd",
        lat: 49.462976,
        lng: 8.516735,

        lines: ["6A"],


        discovered: false
},



//=====================================================
// Linie 7
//=====================================================


{
        name: "Rheingönheim Neubruch",
        lat: 49.443612,
        lng: 8.419154,

        lines: ["7", "12"],


        discovered: false
},
{
        name: "Brückweg",
        lat: 49.446353,
        lng: 8.425839,

        lines: ["7", "12"],


        discovered: false
},
{
        name: "Friedensstraße",
        lat: 49.449272,
        lng: 8.424051,

        lines: ["7", "12"],


        discovered: false
},
{
        name: "Giulinistraße",
        lat: 49.453231,
        lng: 8.425301,

        lines: ["7", "12"],


        discovered: false
},
{
        name: "Hoheneckenstraße",
        lat: 49.456951,
        lng: 8.426758,

        lines: ["7", "12"],


        discovered: false
},
{
        name: "Schillerschule",
        lat: 49.460136,
        lng: 8.427761,

        lines: ["7", "12"],


        discovered: false
},
{
        name: "Am Schwanen",
        lat: 49.463233,
        lng: 8.429336,

        lines: ["7", "12"],


        discovered: false
},
{
        name: "Mundenheim Nord",
        lat: 49.465668,
        lng: 8.431916,

        lines: ["7", "12"],


        discovered: false
},
{
        name: "Stifterstraße",
        lat: 49.468715,
        lng: 8.435461,

        lines: ["7", "12"],


        discovered: false
},
{
        name: "Südwest-Stadion",
        lat: 49.472166,
        lng: 8.439366,

        lines: ["7", "9X", "12"],


        discovered: false
},
{
        name: "Wittelsbachplatz",
        lat: 49.475916,
        lng: 8.444345,

        lines: ["7", "9X", "12"],


        discovered: false
},
{
        name: "Gewerkschaftshaus",
        lat: 49.490235,
        lng: 8.475495,

        lines: ["7"],

        details: {
        bahnsteiggleise: 2,
        aussenbahnsteige: 2,
        inselbahnsteige: 0,

        getrennt: true,
        doppelhaltestelle: false,
    },

        discovered: false
},
{
        name: "Ziethenstraße",
        lat: 49.490464,
        lng: 8.519255,

        lines: ["7"],

        details: {
        bahnsteiggleise: 2,
        aussenbahnsteige: 2,
        inselbahnsteige: 0,

        getrennt: false,
        doppelhaltestelle: false,
    },

        discovered: false
},
{
        name: "Adolf-Damaschke-Ring",
        lat: 49.493465,
        lng: 8.521026,

        lines: ["7"],

        details: {
        bahnsteiggleise: 2,
        aussenbahnsteige: 2,
        inselbahnsteige: 0,

        getrennt: false,
        doppelhaltestelle: false,
    },

        discovered: false
},
{
        name: "Talstraße",
        lat: 49.495346,
        lng: 8.524900,

        lines: ["7"],

        details: {
        bahnsteiggleise: 2,
        aussenbahnsteige: 2,
        inselbahnsteige: 0,

        getrennt: false,
        doppelhaltestelle: false,
    },

        discovered: false
},
{
        name: "Hölderlinstraße",
        lat: 49.496420,
        lng: 8.529759,

        lines: ["7"],

        details: {
        bahnsteiggleise: 2,
        aussenbahnsteige: 2,
        inselbahnsteige: 0,

        getrennt: false,
        doppelhaltestelle: false,
    },

        discovered: false
},
{
        name: "Kiesäcker",
        lat: 49.498982,
        lng: 8.536573,

        lines: ["7"],

        details: {
        bahnsteiggleise: 2,
        aussenbahnsteige: 2,
        inselbahnsteige: 0,

        getrennt: false,
        doppelhaltestelle: false,
    },

    discovered: false
},
{
        name: "Vogelstang West",
        lat: 49.506149,
        lng: 8.532025,

        lines: ["7", "15"],

        details: {
        bahnsteiggleise: 4,
        aussenbahnsteige: 4,
        inselbahnsteige: 0,

        getrennt: true,
        doppelhaltestelle: false,
    },

        discovered: false
},
{
        name: "Potsdamer Weg",
        lat: 49.508289,
        lng: 8.533506,

        lines: ["7"],


        discovered: false
},
{
        name: "Vogelstang Zentrum",
        lat: 49.510261,
        lng: 8.539360,

        lines: ["7"],


        discovered: false
},
{
        name: "Vogelstang",
        lat: 49.511797,
        lng: 8.543966,

        lines: ["7"],


        discovered: false
},



//=====================================================
// Linie 10
//=====================================================


{
        name: "Friesenheim Mitte",
        lat: 49.498223,
        lng: 8.419257,

        lines: ["10"],


        discovered: false
},
{
        name: "Hagellochstraße",
        lat: 49.499202,
        lng: 8.415775,

        lines: ["10"],


        discovered: false
},
{
        name: "Kreuzstraße",
        lat: 49.497596,
        lng: 8.413057,

        lines: ["10"],


        discovered: false
},
{
        name: "Sternstraße",
        lat: 49.495531,
        lng: 8.415544,

        lines: ["10"],


        discovered: false
},
{
        name: "Schwalbenweg",
        lat: 49.493572,
        lng: 8.418302,

        lines: ["10"],


        discovered: false
},
{
        name: "Ebertpark/Fichtestraße",
        lat: 49.491615,
        lng: 8.421089,

        lines: ["10", "15"],


        discovered: false
},
{
        name: "LU Klinikum",
        lat: 49.490255,
        lng: 8.422997,

        lines: ["10", "15"],


        discovered: false
},
{
        name: "Heinrich-Ries-Halle",
        lat: 49.487925,
        lng: 8.426320,

        lines: ["10", "15"],


        discovered: false
},
{
        name: "Marienkirche",
        lat: 49.485373,
        lng: 8.430583,

        lines: ["10", "15"],


        discovered: false
},
{
        name: "Schützenstraße",
        lat: 49.477215,
        lng: 8.448599,

        lines: ["10", "12"],


        discovered: false
},
{
        name: "Rottstraße",
        lat: 49.473886,
        lng: 8.448219,

        lines: ["10"],


        discovered: false
},
{
        name: "Amtsgericht",
        lat: 49.471684,
        lng: 8.451416,

        lines: ["10"],


        discovered: false
},
{
        name: "Luitpoldhafen",
        lat: 49.471513,
        lng: 8.452772,

        lines: ["10"],


        discovered: false
},



//=====================================================
// Linie 15
//=====================================================



{
        name: "Ebertpark",
        lat: 49.490013,
        lng: 8.417443,

        lines: ["15"],


        discovered: false
},
{
        name: "Im Rott",
        lat: 49.507855,
        lng: 8.527851,

        lines: ["15"],

        details: {
        bahnsteiggleise: 2,
        aussenbahnsteige: 2,
        inselbahnsteige: 0,

        getrennt: false,
        doppelhaltestelle: false,
    },

        discovered: false
},
{
        name: "Wallstadt West",
        lat: 49.500366,
        lng: 8.544183,

        lines: ["15"],

        details: {
        bahnsteiggleise: 2,
        aussenbahnsteige: 2,
        inselbahnsteige: 0,

        getrennt: false,
        doppelhaltestelle: false,
    },

        discovered: false
},
{
        name: "Wallstadt Bahnhof",
        lat: 49.498652,
        lng: 8.548999,

        lines: ["15"],

        details: {
        bahnsteiggleise: 2,
        aussenbahnsteige: 2,
        inselbahnsteige: 0,

        getrennt: false,
        doppelhaltestelle: false,
    },

        discovered: false
},
{
        name: "Wallstadt Ost",
        lat: 49.497385,
        lng: 8.553710,

        lines: ["15"],

        details: {
        bahnsteiggleise: 2,
        aussenbahnsteige: 2,
        inselbahnsteige: 0,

        getrennt: false,
        doppelhaltestelle: false,
    },

        discovered: false
},
{
        name: "Heddesheim Bahnhof",
        lat: 49.504858,
        lng: 8.594490,

        lines: ["15"],

        details: {
        bahnsteiggleise: 1,
        aussenbahnsteige: 1,
        inselbahnsteige: 0,

        getrennt: false,
        doppelhaltestelle: false,
    },

        discovered: false
},



//=====================================================
// Linie 16
//=====================================================


{
        name: "Franklinschule",
        lat: 49.517488,
        lng: 8.525652,

        lines: ["16"],


        discovered: false
},
{
        name: "Franklin Mitte",
        lat: 49.520227,
        lng: 8.529381,

        lines: ["16"],


        discovered: false
},
{
        name: "Sullivan",
        lat: 49.522596,
        lng: 8.534513,

        lines: ["16"],


        discovered: false
},


//=====================================================
// Linie 21
//=====================================================

{
        name: "Heiligenbergschule",
        lat: 49.423516,
        lng: 8.679392,

        lines: ["21", "24", "26"],


        discovered: false
},
{
        name: "Technologiepark",
        lat: 49.419157,
        lng: 8.676259,

        lines: ["21", "24"],


        discovered: false
},

{
        name: "Bunsengymnasium",
        lat: 49.417409,
        lng: 8.676301,

        lines: ["21", "24"],


        discovered: false
},

{
        name: "Jahnstraße",
        lat: 49.413033,
        lng: 8.676619,

        lines: ["21", "24"],


        discovered: false
},

{
        name: "Betriebshof",
        lat: 49.407897,
        lng: 8.675991,

        lines: ["21", "24", "26"],

        details: {
        bahnsteiggleise: 4,
        aussenbahnsteige: 4,
        inselbahnsteige: 0,
        inselbahnsteigkanten: 0,
        anzeiger: "digital_gross",
        getrennt: true,
        doppelhaltestelle: false,
    },

        discovered: false
},



//=====================================================
// Linie 22
//=====================================================


{
        name: "Eppelheim Kirchheimer Straße",
        lat: 49.399234,
        lng: 8.626530,

        lines: ["22"],

        details: {
        bahnsteiggleise: 2,
        aussenbahnsteige: 0,
        inselbahnsteige: 1,
        inselbahnsteigkanten: 2,
        anzeiger: "digital_klein",
        getrennt: false,
        doppelhaltestelle: false,
    },

        discovered: false
},
{
        name: "Eppelheim Rathaus",
        lat: 49.401602,
        lng: 8.628958,

        lines: ["22"],

        details: {
        bahnsteiggleise: 1,
        aussenbahnsteige: 1,
        inselbahnsteige: 0,
        inselbahnsteigkanten: 0,
        anzeiger: "analog",
        getrennt: false,
        doppelhaltestelle: false,
    },

        discovered: false
},
{
        name: "Jakobsgasse",
        lat: 49.400996,
        lng: 8.633033,

        lines: ["22"],

        details: {
        bahnsteiggleise: 1,
        aussenbahnsteige: 1,
        inselbahnsteige: 0,
        inselbahnsteigkanten: 0,
        anzeiger: "analog",
        getrennt: false,
        doppelhaltestelle: false,
    },

        discovered: false
},
{
        name: "Kranichweg/Stotz",
        lat: 49.402218,
        lng: 8.642305,

        lines: ["22"],

        details: {
        bahnsteiggleise: 3,
        aussenbahnsteige: 1,
        inselbahnsteige: 1,
        inselbahnsteigkanten: 2,
        anzeiger: "digital_gross",
        getrennt: false,
        doppelhaltestelle: false,
    },

        discovered: false
},
{
        name: "Marktstraße",
        lat: 49.403593,
        lng: 8.647538,

        lines: ["22"],

        details: {
        bahnsteiggleise: 2,
        aussenbahnsteige: 0,
        inselbahnsteige: 1,
        inselbahnsteigkanten: 2,
        anzeiger: "digital_gross",
        getrennt: false,
        doppelhaltestelle: false,
    },

        discovered: false
},
{
        name: "Henkel-Teroson-Straße",
        lat: 49.405740,
        lng: 8.652526,

        lines: ["22"],

        details: {
        bahnsteiggleise: 2,
        aussenbahnsteige: 2,
        inselbahnsteige: 0,
        inselbahnsteigkanten: 0,
        anzeiger: "digital_gross",
        getrennt: false,
        doppelhaltestelle: false,
    },

        discovered: false
},
{
        name: "Eppelheimer Terrasse",
        lat: 49.405339,
        lng: 8.659466,

        lines: ["22"],

        details: {
        bahnsteiggleise: 2,
        aussenbahnsteige: 2,
        inselbahnsteige: 0,
        inselbahnsteigkanten: 0,
        anzeiger: "digital_gross",
        getrennt: false,
        doppelhaltestelle: false,
    },

        discovered: false
},
{
        name: "Gadamerplatz",
        lat: 49.403675,
        lng: 8.668036,

        details: {
        bahnsteiggleise: 4,
        aussenbahnsteige: 4,
        inselbahnsteige: 0,
        inselbahnsteigkanten: 0,
        anzeiger: "digital_gross",
        getrennt: true,
        doppelhaltestelle: false,
    },

        lines: ["22", "26"],


        discovered: false
},
{
        name: "HD Hbf-Süd",
        lat: 49.401939,
        lng: 8.673956,

        lines: ["22", "26"],


        discovered: false
},
{
        name: "Montpellierbrücke",
        lat: 49.400626,
        lng: 8.678486,

        lines: ["22"],


        discovered: false
},
{
        name: "Ringstraße",
        lat: 49.403305,
        lng: 8.681594,

        lines: ["22"],


        discovered: false
},


//=====================================================
// Linie 23
//=====================================================


{
        name: "Leimen Friedhof",
        lat: 49.343365,
        lng: 8.693523,

        lines: ["23"],

        details: {
        bahnsteiggleise: 1,
        aussenbahnsteige: 1,
        inselbahnsteige: 0,
        inselbahnsteigkanten: 0,
        anzeiger: "digital_klein",
        getrennt: false,
        doppelhaltestelle: false,
    },

        discovered: false
},
{
        name: "Moltkestraße",
        lat: 49.345400,
        lng: 8.692528,

        lines: ["23"],

        details: {
        bahnsteiggleise: 1,
        aussenbahnsteige: 1,
        inselbahnsteige: 0,
        inselbahnsteigkanten: 0,
        anzeiger: "digital_klein",
        getrennt: false,
        doppelhaltestelle: false,
    },

        discovered: false
},
{
        name: "Kurpfalz-Centrum",
        lat: 49.347953,
        lng: 8.689609,

        lines: ["23"],

        details: {
        bahnsteiggleise: 2,
        aussenbahnsteige: 0,
        inselbahnsteige: 1,
        inselbahnsteigkanten: 2,
        anzeiger: "digital_gross",
        getrennt: false,
        doppelhaltestelle: false,
    },

        discovered: false
},
{
        name: "Georgi-Marktplatz",
        lat: 49.349327,
        lng: 8.688905,

        lines: ["23"],

        details: {
        bahnsteiggleise: 1,
        aussenbahnsteige: 1,
        inselbahnsteige: 0,
        inselbahnsteigkanten: 0,
        anzeiger: "analog",
        getrennt: false,
        doppelhaltestelle: false,
    },

        discovered: false
},
{
        name: "Johannes-Reidel-Straße",
        lat: 49.353645,
        lng: 8.689228,

        lines: ["23"],

        details: {
        bahnsteiggleise: 1,
        aussenbahnsteige: 1,
        inselbahnsteige: 0,
        inselbahnsteigkanten: 0,
        anzeiger: "digital_klein",
        getrennt: false,
        doppelhaltestelle: false,
    },

        discovered: false
},
{
        name: "Zementwerk",
        lat: 49.357563,
        lng: 8.689348,

        lines: ["23"],

        details: {
        bahnsteiggleise: 1,
        aussenbahnsteige: 1,
        inselbahnsteige: 0,
        inselbahnsteigkanten: 0,
        anzeiger: "digital_klein",
        getrennt: false,
        doppelhaltestelle: false,
    },

        discovered: false
},
{
        name: "Rohrbach Süd",
        lat: 49.365726,
        lng: 8.688731,

        lines: ["23", "24"],

        details: {
        bahnsteiggleise: 2,
        aussenbahnsteige: 2,
        inselbahnsteige: 0,
        inselbahnsteigkanten: 0,
        anzeiger: "digital_gross",
        getrennt: false,
        doppelhaltestelle: false,
    },

        discovered: false
},
{
        name: "HD Freiburger Straße",
        lat: 49.373597,
        lng: 8.688044,

        lines: ["23", "24"],

        details: {
        bahnsteiggleise: 2,
        aussenbahnsteige: 2,
        inselbahnsteige: 0,
        inselbahnsteigkanten: 0,
        anzeiger: "digital_klein",
        getrennt: false,
        doppelhaltestelle: false,
    },

        discovered: false
},
{
        name: "Ortenauer Straße",
        lat: 49.376683,
        lng: 8.687738,

        lines: ["23", "24"],

        details: {
        bahnsteiggleise: 2,
        aussenbahnsteige: 2,
        inselbahnsteige: 0,
        inselbahnsteigkanten: 0,
        anzeiger: "digital_klein",
        getrennt: false,
        doppelhaltestelle: false,
    },

        discovered: false
},
{
        name: "Rohrbach Markt",
        lat: 49.380472,
        lng: 8.688148,

        lines: ["23", "24"],

        details: {
        bahnsteiggleise: 2,
        aussenbahnsteige: 2,
        inselbahnsteige: 0,
        inselbahnsteigkanten: 0,
        anzeiger: "digital_gross",
        getrennt: false,
        doppelhaltestelle: false,
    },

        discovered: false
},
{
        name: "Eichendorffplatz",
        lat: 49.383398,
        lng: 8.690417,

        lines: ["23", "24"],

        details: {
        bahnsteiggleise: 2,
        aussenbahnsteige: 2,
        inselbahnsteige: 0,
        inselbahnsteigkanten: 0,
        anzeiger: "digital_klein",
        getrennt: false,
        doppelhaltestelle: false,
    },

        discovered: false
},
{
        name: "Markscheide",
        lat: 49.386719,
        lng: 8.690494,

        lines: ["23", "24"],

        details: {
        bahnsteiggleise: 2,
        aussenbahnsteige: 2,
        inselbahnsteige: 0,
        inselbahnsteigkanten: 0,
        anzeiger: "digital_klein",
        getrennt: true,
        doppelhaltestelle: false,
    },

        discovered: false
},
{
        name: "HD Rheinstraße",
        lat: 49.389818,
        lng: 8.690353,

        lines: ["23", "24"],

        details: {
        bahnsteiggleise: 2,
        aussenbahnsteige: 2,
        inselbahnsteige: 0,
        inselbahnsteigkanten: 0,
        anzeiger: "digital_klein",
        getrennt: false,
        doppelhaltestelle: false,
    },

        discovered: false
},
{
        name: "Bethanien-Krankenhaus",
        lat: 49.392261,
        lng: 8.690222,

        lines: ["23", "24"],

        details: {
        bahnsteiggleise: 2,
        aussenbahnsteige: 2,
        inselbahnsteige: 0,
        inselbahnsteigkanten: 0,
        anzeiger: "digital_klein",
        getrennt: false,
        doppelhaltestelle: false,
    },

        discovered: false
},
{
        name: "Bergfriedhof",
        lat: 49.395574,
        lng: 8.689874,

        lines: ["23", "24"],

        details: {
        bahnsteiggleise: 2,
        aussenbahnsteige: 2,
        inselbahnsteige: 0,
        inselbahnsteigkanten: 0,
        anzeiger: "digital_gross",
        getrennt: true,
        doppelhaltestelle: false,
    },

        discovered: false
},
{
        name: "HD Weststadt/Südstadt",
        lat: 49.398349,
        lng: 8.688895,

        lines: ["23", "24", "S1", "S2", "S7", "S8"],

        details: {

        //---------------------------------------------
        // Gilt für die Straßenbahn
        //---------------------------------------------
        getrennt: false,
        doppelhaltestelle: false,

        //---------------------------------------------
        // Straßenbahnhaltestelle
        //---------------------------------------------
        tram: {
            bahnsteiggleise: 2,
            aussenbahnsteige: 2,
            inselbahnsteige: 0,
            inselbahnsteigkanten: 0,
            anzeiger: "digital_gross"
        },

        //---------------------------------------------
        // S-Bahn-Bahnhof
        //---------------------------------------------
        sbahn: {
            bahnsteiggleise: 2,
            aussenbahnsteige: 2,
            inselbahnsteige: 0
        },
    },

        discovered: false
},
{
        name: "Christuskirche",
        lat: 49.401702,
        lng: 8.685234,

        lines: ["23", "24"],

        details: {
        bahnsteiggleise: 2,
        aussenbahnsteige: 2,
        inselbahnsteige: 0,
        inselbahnsteigkanten: 0,
        anzeiger: "digital_klein",
        getrennt: false,
        doppelhaltestelle: false,
    },

        discovered: false
},
{
        name: "Römerkreis Süd",
        lat: 49.404630,
        lng: 8.684651,

        lines: ["23", "24"],

        details: {
        bahnsteiggleise: 2,
        aussenbahnsteige: 2,
        inselbahnsteige: 0,
        inselbahnsteigkanten: 0,
        anzeiger: "digital_gross",
        getrennt: false,
        doppelhaltestelle: false,
    },

        discovered: false
},


//=====================================================
// Linie 26
//=====================================================


{
        name: "Kirchheim Friedhof",
        lat: 49.375924,
        lng: 8.658944,

        lines: ["26"],


        discovered: false
},
{
        name: "Kirchheim Rathaus",
        lat: 49.377232,
        lng: 8.665041,

        lines: ["26"],


        discovered: false
},
{
        name: "Odenwaldstraße",
        lat: 49.379119,
        lng: 8.669328,

        lines: ["26"],


        discovered: false
},
{
        name: "Albert-Fritz-Straße",
        lat: 49.383008,
        lng: 8.672275,

        lines: ["26"],


        discovered: false
},
{
        name: "Ilse-Krall-Straße",
        lat: 49.386467,
        lng: 8.673459,

        lines: ["26"],


        discovered: false
},
{
        name: "Messplatz",
        lat: 49.391048,
        lng: 8.675410,

        lines: ["26"],


        discovered: false
},
{
        name: "Rudolf-Diesel-Straße",
        lat: 49.396406,
        lng: 8.678409,

        lines: ["26"],


        discovered: false
},
{
        name: "Czernybrücke",
        lat: 49.406827,
        lng: 8.671243,

        lines: ["26"],

        details: {
        bahnsteiggleise: 2,
        aussenbahnsteige: 2,
        inselbahnsteige: 0,
        inselbahnsteigkanten: 0,
        anzeiger: "analog",
        getrennt: false,
        doppelhaltestelle: false,
    },

        discovered: false
},
{
        name: "Volkshochschule",
        lat: 49.407854,
        lng: 8.680599,

        lines: ["26"],

        details: {
        bahnsteiggleise: 2,
        aussenbahnsteige: 2,
        inselbahnsteige: 0,
        inselbahnsteigkanten: 0,
        anzeiger: "digital_klein",
        getrennt: false,
        doppelhaltestelle: false,
    },

        discovered: false
},
{
        name: "Campus Bergheim",
        lat: 49.407911,
        lng: 8.685146,

        lines: ["26"],

        details: {
        bahnsteiggleise: 2,
        aussenbahnsteige: 2,
        inselbahnsteige: 0,
        inselbahnsteigkanten: 0,
        anzeiger: "digital_klein",
        getrennt: false,
        doppelhaltestelle: false,
    },

        discovered: false
},
{
        name: "Altes Hallenbad",
        lat: 49.408408,
        lng: 8.688318,

        lines: ["26"],

        details: {
        bahnsteiggleise: 2,
        aussenbahnsteige: 2,
        inselbahnsteige: 0,
        inselbahnsteigkanten: 0,
        anzeiger: "digital_klein",
        getrennt: false,
        doppelhaltestelle: false,
    },

        discovered: false
},



//=====================================================
// S1
//=====================================================

{
        name: "Homburg Hbf",
        lat: 49.327973,
        lng: 7.336889,

        lines: ["S1"],


        discovered: false
},
{
        name: "Bruchmühlbach-Miesau",
        lat: 49.385314,
        lng: 7.444242,

        lines: ["S1"],


        discovered: false
},
{
        name: "Hauptstuhl",
        lat: 49.401972,
        lng: 7.491432,

        lines: ["S1"],


        discovered: false
},
{
        name: "Landstuhl",
        lat: 49.416293,
        lng: 7.566206,

        lines: ["S1"],


        discovered: false
},
{
        name: "Kindsbach",
        lat: 49.419511,
        lng: 7.613350,

        lines: ["S1"],


        discovered: false
},
{
        name: "Einsiedlerhof",
        lat: 49.430913,
        lng: 7.662250,

        lines: ["S1"],


        discovered: false
},
{
        name: "Vogelweh",
        lat: 49.438629,
        lng: 7.706483,

        lines: ["S1"],


        discovered: false
},
{
        name: "Kennelgarten",
        lat: 49.440900,
        lng: 7.733830,

        lines: ["S1"],


        discovered: false
},
{
        name: "Kaiserslautern Hbf",
        lat: 49.435915,
        lng: 7.769058,

        lines: ["S1", "S2"],


        discovered: false
},
{
        name: "Hochspeyer",
        lat: 49.444087,
        lng: 7.904207,

        lines: ["S1", "S2"],


        discovered: false
},
{
        name: "Frankenstein",
        lat: 49.438908,
        lng: 7.969476,

        lines: ["S1", "S2"],


        discovered: false
},
{
        name: "Weidenthal",
        lat: 49.417761,
        lng: 7.993518,

        lines: ["S1", "S2"],


        discovered: false
},
{
        name: "Neidenfels",
        lat: 49.386399,
        lng: 8.045173,

        lines: ["S1", "S2"],


        discovered: false
},
{
        name: "Lambrecht",
        lat: 49.373241,
        lng: 8.074431,

        lines: ["S1", "S2"],


        discovered: false
},
{
        name: "Neustadt (Weinstraße) Hbf",
        lat: 49.349610,
        lng: 8.141160,

        lines: ["S1", "S2"],


        discovered: false
},
{
        name: "Neustadt-Böbig",
        lat: 49.353609,
        lng: 8.157550,

        lines: ["S1", "S2"],


        discovered: false
},
{
        name: "Haßloch",
        lat: 49.371837,
        lng: 8.252158,

        lines: ["S1", "S2"],


        discovered: false
},
{
        name: "Böhl-Iggelheim",
        lat: 49.379785,
        lng: 8.304011,

        lines: ["S1", "S2"],


        discovered: false
},
{
        name: "Schifferstadt",
        lat: 49.392709,
        lng: 8.364943,

        lines: ["S1", "S2", "S3"],


        discovered: false
},
{
        name: "Limburgerhof",
        lat: 49.424196,
        lng: 8.390612,

        lines: ["S1", "S2", "S3"],


        discovered: false
},
{
        name: "LU-Rheingönheim",
        lat: 49.447115,
        lng: 8.409300,

        lines: ["S1", "S2", "S3"],


        discovered: false
},
{
        name: "LU-Mundenheim",
        lat: 49.461145,
        lng: 8.420862,

        lines: ["S1", "S2", "S3"],


        discovered: false
},
{
        name: "MA Seckenheim",
        lat: 49.451407,
        lng: 8.538108,

        lines: ["S1", "S2", "S3", "S5"],


        discovered: false
},
{
        name: "MA Friedrichsfeld-Süd",
        lat: 49.438068,
        lng: 8.572559,

        lines: ["S1", "S2", "S3"],


        discovered: false
},
{
        name: "HD Pfaffengrund-Wieblingen",
        lat: 49.411866,
        lng: 8.641735,

        lines: ["S1", "S2", "S3"],


        discovered: false
},
{
        name: "HD Altstadt",
        lat: 49.415320,
        lng: 8.720981,

        lines: ["S1", "S2", "S7", "S8"],


        discovered: false
},
{
        name: "HD Schlierbach/Ziegelhausen",
        lat: 49.415264,
        lng: 8.760772,

        lines: ["S1", "S2", "S7", "S8"],


        discovered: false
},
{
        name: "HD Orthopädie",
        lat: 49.410165,
        lng: 8.774760,

        lines: ["S1", "S2", "S7", "S8"],


        discovered: false
},
{
        name: "Neckargemünd",
        lat: 49.393844,
        lng: 8.788468,

        lines: ["S1", "S2", "S7", "S8"],


        discovered: false
},
{
        name: "Neckargemünd Altstadt",
        lat: 49.392290,
        lng: 8.802636,

        lines: ["S1", "S2"],


        discovered: false
},
{
        name: "Neckarsteinach",
        lat: 49.404968,
        lng: 8.841388,

        lines: ["S1", "S2"],


        discovered: false
},
{
        name: "Neckarhausen",
        lat: 49.416986,
        lng: 8.880226,

        lines: ["S1", "S2"],


        discovered: false
},
{
        name: "Hirschhorn",
        lat: 49.442554,
        lng: 8.896139,

        lines: ["S1", "S2"],


        discovered: false
},
{
        name: "Eberbach",
        lat: 49.465646,
        lng: 8.984444,

        lines: ["S1", "S2"],


        discovered: false
},
{
        name: "Lindach",
        lat: 49.416739,
        lng: 9.006907,

        lines: ["S1", "S2"],


        discovered: false
},
{
        name: "Zwingenberg",
        lat: 49.415831,
        lng: 9.042886,

        lines: ["S1", "S2"],


        discovered: false
},
{
        name: "Neckargerach",
        lat: 49.398202,
        lng: 9.074606,

        lines: ["S1", "S2"],


        discovered: false
},
{
        name: "Binau",
        lat: 49.371992,
        lng: 9.084086,

        lines: ["S1", "S2"],


        discovered: false
},
{
        name: "Mosbach-Neckarelz",
        lat: 49.348570,
        lng: 9.112891,

        lines: ["S1", "S2"],


        discovered: false
},
{
        name: "Mosbach West",
        lat: 49.346675,
        lng: 9.133958,

        lines: ["S1", "S2"],


        discovered: false
},
{
        name: "Mosbach",
        lat: 49.352685,
        lng: 9.143672,

        lines: ["S1", "S2"],


        discovered: false
},
{
        name: "Neckarburken",
        lat: 49.378577,
        lng: 9.164224,

        lines: ["S1"],


        discovered: false
},
{
        name: "Dallau",
        lat: 49.387964,
        lng: 9.187377,

        lines: ["S1"],


        discovered: false
},
{
        name: "Auerbach",
        lat: 49.399531,
        lng: 9.223307,

        lines: ["S1"],


        discovered: false
},
{
        name: "Oberschefflenz",
        lat: 49.416862,
        lng: 9.278542,

        lines: ["S1"],


        discovered: false
},
{
        name: "Eicholzheim",
        lat: 49.432564,
        lng: 9.290340,

        lines: ["S1"],


        discovered: false
},
{
        name: "Seckach",
        lat: 49.441105,
        lng: 9.338670,

        lines: ["S1"],


        discovered: false
},
{
        name: "Zimmern bei Seckach",
        lat: 49.430432,
        lng: 9.371903,

        lines: ["S1"],


        discovered: false
},
{
        name: "Adelsheim Nord",
        lat: 49.421352,
        lng: 9.392449,

        lines: ["S1"],


        discovered: false
},
{
        name: "Osterburken",
        lat: 49.429931,
        lng: 9.422955,

        lines: ["S1"],


        discovered: false
},


//=====================================================
// S3
//=====================================================

{
        name: "Karlsruhe Hbf",
        lat: 48.993684,
        lng: 8.401790,

        lines: ["S3", "S6", "S9"],


        discovered: false
},
{
        name: "Karlsruhe-Knielingen",
        lat: 49.026622,
        lng: 8.341264,

        lines: ["S3"],


        discovered: false
},
{
        name: "Wörth",
        lat: 49.045774,
        lng: 8.273169,

        lines: ["S3"],


        discovered: false
},
{
        name: "Jockgrim",
        lat: 49.092291,
        lng: 8.272297,

        lines: ["S3"],


        discovered: false
},
{
        name: "Rheinzabern Alte Römerstraße",
        lat: 49.109145,
        lng: 8.272999,

        lines: ["S3"],


        discovered: false
},
{
        name: "Rheinzabern",
        lat: 49.119344,
        lng: 8.274119,

        lines: ["S3"],


        discovered: false
},
{
        name: "Rülzheim Freiheitszentrum",
        lat: 49.151509,
        lng: 8.279339,

        lines: ["S3"],


        discovered: false
},
{
        name: "Rülzheim",
        lat: 49.160905,
        lng: 8.290482,

        lines: ["S3"],


        discovered: false
},
{
        name: "Bellheim",
        lat: 49.188270,
        lng: 8.294529,

        lines: ["S3"],


        discovered: false
},
{
        name: "Sondernheim",
        lat: 49.195284,
        lng: 8.360323,

        lines: ["S3"],


        discovered: false
},
{
        name: "Germersheim Mitte",
        lat: 49.220196,
        lng: 8.379147,

        lines: ["S3", "S33"],


        discovered: false
},
{
        name: "Germersheim",
        lat: 49.225265,
        lng: 8.365490,

        lines: ["S3", "S33"],


        discovered: false
},
{
        name: "Lingenfeld",
        lat: 49.252227,
        lng: 8.349546,

        lines: ["S3"],


        discovered: false
},
{
        name: "Heiligenstein",
        lat: 49.285982,
        lng: 8.394192,

        lines: ["S3"],


        discovered: false
},
{
        name: "Berghausen",
        lat: 49.296002,
        lng: 8.406731,

        lines: ["S3"],


        discovered: false
},
{
        name: "Speyer Hbf",
        lat: 49.324093,
        lng: 8.427878,

        lines: ["S3"],


        discovered: false
},
{
        name: "Speyer Nord-West",
        lat: 49.333698,
        lng: 8.419182,

        lines: ["S3"],


        discovered: false
},
{
        name: "Schifferstadt Süd",
        lat: 49.374245,
        lng: 8.377242,

        lines: ["S3"],


        discovered: false
},
{
        name: "HD-Kirchheim/Rohrbach",
        lat: 49.378970,
        lng: 8.675284,

        lines: ["S3"],


        discovered: false
},
{
        name: "St. Ilgen-Sandhausen",
        lat: 49.341103,
        lng: 8.668684,

        lines: ["S3"],


        discovered: false
},
{
        name: "Wiesloch-Walldorf",
        lat: 49.290828,
        lng: 8.664078,

        lines: ["S3"],


        discovered: false
},
{
        name: "Rot-Malsch",
        lat: 49.243361,
        lng: 8.652196,

        lines: ["S3"],


        discovered: false
},
{
        name: "Bad Schönborn-Kronau",
        lat: 49.219460,
        lng: 8.646867,

        lines: ["S3"],


        discovered: false
},
{
        name: "Bad Schönborn Süd",
        lat: 49.199951,
        lng: 8.641870,

        lines: ["S3"],


        discovered: false
},
{
        name: "Stettfeld-Weiher",
        lat: 49.183857,
        lng: 8.637099,

        lines: ["S3"],


        discovered: false
},
{
        name: "Ubstadt-Weiher",
        lat: 49.166918,
        lng: 8.623324,

        lines: ["S3"],


        discovered: false
},
{
        name: "Bruchsal",
        lat: 49.124569,
        lng: 8.590018,

        lines: ["S3", "S33"],


        discovered: false
},
{
        name: "Bruchsal-Bildungszentrum",
        lat: 49.110024,
        lng: 8.574132,

        lines: ["S3"],


        discovered: false
},
{
        name: "Untergrombach",
        lat: 49.087500,
        lng: 8.548149,

        lines: ["S3"],


        discovered: false
},
{
        name: "Weingarten",
        lat: 49.059300,
        lng: 8.521401,

        lines: ["S3"],


        discovered: false
},
{
        name: "Karlsruhe-Durlach",
        lat: 49.002048,
        lng: 8.462283,

        lines: ["S3"],


        discovered: false
},


//=====================================================
// S5
//=====================================================

{
        name: "Mainz Hbf",
        lat: 50.000917,
        lng: 8.258874,

        lines: ["S5", "S6"],


        discovered: false
},
{
        name: "Mainz Römisches Theater",
        lat: 49.993444,
        lng: 8.277775,

        lines: ["S5", "S6"],


        discovered: false
},
{
        name: "Mainz Laubenheim",
        lat: 49.961363,
        lng: 8.314209,

        lines: ["S5", "S6"],


        discovered: false
},
{
        name: "Bodenheim",
        lat: 49.929641,
        lng: 8.312427,

        lines: ["S5", "S6"],


        discovered: false
},
{
        name: "Nackenheim",
        lat: 49.919063,
        lng: 8.341996,

        lines: ["S5", "S6"],


        discovered: false
},
{
        name: "Nierstein",
        lat: 49.872092,
        lng: 8.342740,

        lines: ["S5", "S6"],


        discovered: false
},
{
        name: "Oppenheim",
        lat: 49.856688,
        lng: 8.358591,

        lines: ["S5", "S6"],


        discovered: false
},
{
        name: "Dienheim",
        lat: 49.841364,
        lng: 8.357164,

        lines: ["S5", "S6"],


        discovered: false
},
{
        name: "Guntersblum",
        lat: 49.791533,
        lng: 8.351098,

        lines: ["S5", "S6"],


        discovered: false
},
{
        name: "Alsheim",
        lat: 49.765231,
        lng: 8.342491,

        lines: ["S5", "S6"],


        discovered: false
},
{
        name: "Mettenheim",
        lat: 49.739845,
        lng: 8.334184,

        lines: ["S5", "S6"],


        discovered: false
},
{
        name: "Osthofen",
        lat: 49.705370,
        lng: 8.326081,

        lines: ["S5", "S6"],


        discovered: false
},
{
        name: "Worms Hbf",
        lat: 49.634653,
        lng: 8.356337,

        lines: ["S5", "S6"],


        discovered: false
},
{
        name: "Bobenheim",
        lat: 49.587930,
        lng: 8.350325,

        lines: ["S5", "S6"],


        discovered: false
},
{
        name: "Frankenthal Hbf",
        lat: 49.535644,
        lng: 8.349639,

        lines: ["S5", "S6"],


        discovered: false
},
{
        name: "Frankenthal Süd",
        lat: 49.522845,
        lng: 8.349514,

        lines: ["S5", "S6"],


        discovered: false
},
{
        name: "LU Oggersheim",
        lat: 49.493257,
        lng: 8.381365,

        lines: ["S5", "S6"],


        discovered: false
},
{
        name: "Neu-Edingen/Friedrichsfeld",
        lat: 49.448598,
        lng: 8.580030,

        lines: ["S5", "S12"],


        discovered: false
},
{
        name: "Ladenburg",
        lat: 49.474219,
        lng: 8.602796,

        lines: ["S5"],


        discovered: false
},
{
        name: "Heddesheim/Hirschberg",
        lat: 49.509394,
        lng: 8.633747,

        lines: ["S5"],


        discovered: false
},
{
        name: "Lützelsachsen",
        lat: 49.527867,
        lng: 8.649961,

        lines: ["S5"],


        discovered: false
},
{
        name: "Weinheim-Sulzbach",
        lat: 49.575779,
        lng: 8.656316,

        lines: ["S5"],


        discovered: false
},
{
        name: "Hemsbach",
        lat: 49.590844,
        lng: 8.648769,

        lines: ["S5"],


        discovered: false
},
{
        name: "Laudenbach",
        lat: 49.611805,
        lng: 8.644605,

        lines: ["S5"],


        discovered: false
},
{
        name: "Heppenheim",
        lat: 49.641566,
        lng: 8.633356,

        lines: ["S5"],


        discovered: false
},
{
        name: "Bensheim",
        lat: 49.680844,
        lng: 8.616941,

        lines: ["S5"],


        discovered: false
},


//=====================================================
// S6
//=====================================================


{
        name: "Schwetzingen-Hirschacker",
        lat: 49.406070,
        lng: 8.557231,

        lines: ["S6", "S9"],


        discovered: false
},
{
        name: "Schwetzingen-Nordstadt",
        lat: 49.394546,
        lng: 8.571490,

        lines: ["S6", "S9"],


        discovered: false
},
{
        name: "Schwetzingen",
        lat: 49.383524,
        lng: 8.578665,

        lines: ["S6", "S9", "S12"],


        discovered: false
},
{
        name: "Oftersheim",
        lat: 49.372855,
        lng: 8.578585,

        lines: ["S6", "S9"],


        discovered: false
},
{
        name: "Hockenheim",
        lat: 49.317424,
        lng: 8.537266,

        lines: ["S6", "S9"],


        discovered: false
},
{
        name: "Neulußheim",
        lat: 49.292591,
        lng: 8.530384,

        lines: ["S6", "S9"],


        discovered: false
},
{
        name: "Waghäusel",
        lat: 49.247977,
        lng: 8.508227,

        lines: ["S6", "S9"],


        discovered: false
},
{
        name: "Wiesental",
        lat: 49.226037,
        lng: 8.502493,

        lines: ["S6", "S9"],


        discovered: false
},
{
        name: "Graben-Neudorf",
        lat: 49.162288,
        lng: 8.490644,

        lines: ["S6", "S9", "S33"],


        discovered: false
},
{
        name: "Friedrichstal",
        lat: 49.100742,
        lng: 8.474239,

        lines: ["S6", "S9"],


        discovered: false
},
{
        name: "Blankenloch",
        lat: 49.066346,
        lng: 8.464679,

        lines: ["S6", "S9"],


        discovered: false
},
{
        name: "Karlsruhe-Hagsfeld",
        lat: 49.027606,
        lng: 8.453986,

        lines: ["S6", "S9"],


        discovered: false
},


//=====================================================
// S7
//=====================================================


{
        name: "Bammental",
        lat: 49.359400,
        lng: 8.783579,

        lines: ["S7", "S8"],


        discovered: false
},
{
        name: "Reilsheim",
        lat: 49.353412,
        lng: 8.778529,

        lines: ["S7", "S8"],


        discovered: false
},
{
        name: "Mauer",
        lat: 49.336258,
        lng: 8.794378,

        lines: ["S7", "S8"],


        discovered: false
},
{
        name: "Meckesheim",
        lat: 49.320701,
        lng: 8.812795,

        lines: ["S7", "S8"],


        discovered: false
},
{
        name: "Zuzenhausen",
        lat: 49.297629,
        lng: 8.821214,

        lines: ["S7"],


        discovered: false
},
{
        name: "Hoffenheim",
        lat: 49.271999,
        lng: 8.838432,

        lines: ["S7"],


        discovered: false
},
{
        name: "Sinsheim (Elsenz) Hbf",
        lat: 49.250232,
        lng: 8.875199,

        lines: ["S7"],


        discovered: false
},
{
        name: "Sinsheim Museum/Arena",
        lat: 49.241439,
        lng: 8.899692,

        lines: ["S7"],


        discovered: false
},
{
        name: "Steinsfurt",
        lat: 49.235954,
        lng: 8.907835,

        lines: ["S7"],


        discovered: false
},
{
        name: "Reihen",
        lat: 49.216461,
        lng: 8.920623,

        lines: ["S7"],


        discovered: false
},
{
        name: "Ittlingen",
        lat: 49.187677,
        lng: 8.934493,

        lines: ["S7"],


        discovered: false
},
{
        name: "Richen",
        lat: 49.168276,
        lng: 8.936454,

        lines: ["S7"],


        discovered: false
},
{
        name: "Eppingen",
        lat: 49.136128,
        lng: 8.914877,

        lines: ["S7"],


        discovered: false
},


//=====================================================
// S8
//=====================================================


{
        name: "Eschelbronn",
        lat: 49.323946,
        lng: 8.867854,

        lines: ["S8"],


        discovered: false
},
{
        name: "Neidenstein",
        lat: 49.320248,
        lng: 8.890279,

        lines: ["S8"],


        discovered: false
},
{
        name: "Waibstadt",
        lat: 49.300897,
        lng: 8.919418,

        lines: ["S8"],


        discovered: false
},
{
        name: "Neckarbischofsheim Nord",
        lat: 49.307131,
        lng: 8.942461,

        lines: ["S8"],


        discovered: false
},
{
        name: "Helmstadt",
        lat: 49.319902,
        lng: 8.974823,

        lines: ["S8"],


        discovered: false
},
{
        name: "Aglasterhausen",
        lat: 49.349884,
        lng: 8.990739,

        lines: ["S8"],


        discovered: false
},


//=====================================================
// S9
//=====================================================


{
        name: "Groß-Rohrheim",
        lat: 49.714198,
        lng: 8.476932,

        lines: ["S9"],


        discovered: false
},
{
        name: "Biblis",
        lat: 49.688859,
        lng: 8.450460,

        lines: ["S9", "S10"],


        discovered: false
},
{
        name: "Bobstadt",
        lat: 49.662418,
        lng: 8.452122,

        lines: ["S9", "S10"],


        discovered: false
},
{
        name: "Bürstadt",
        lat: 49.645499,
        lng: 8.459063,

        lines: ["S9", "S10"],


        discovered: false
},
{
        name: "Lampertheim",
        lat: 49.598657,
        lng: 8.478445,

        lines: ["S9", "S10"],


        discovered: false
},
{
        name: "MA-Handelshafen/Jungbusch",
        lat: 49.492014,
        lng: 8.453840,

        lines: ["S9"],


        discovered: false
},


//=====================================================
// S10
//=====================================================


{
        name: "MA-Käfertal",
        lat: 49.501777,
        lng: 8.503619,

        lines: ["S10"],


        discovered: false
},


//=====================================================
// S33
//=====================================================


{
        name: "Rheinsheim",
        lat: 49.229172,
        lng: 8.415930,

        lines: ["S33"],


        discovered: false
},
{
        name: "Philippsburg",
        lat: 49.231974,
        lng: 8.453317,

        lines: ["S33"],


        discovered: false
},
{
        name: "Huttenheim",
        lat: 49.197103,
        lng: 8.472714,

        lines: ["S33"],


        discovered: false
},
{
        name: "Graben-Neudorf Nord",
        lat: 49.178016,
        lng: 8.494167,

        lines: ["S33"],


        discovered: false
},
{
        name: "Bruchsal am Mantel",
        lat: 49.141049,
        lng: 8.563963,

        lines: ["S33"],


        discovered: false
},
{
        name: "Bruchsal Sportzentrum",
        lat: 49.135559,
        lng: 8.589662,

        lines: ["S33"],


        discovered: false
},   


//=====================================================
// S44
//=====================================================


{
        name: "BASF Nord",
        lat: 49.520347,
        lng: 8.427675,

        lines: ["S44"],


        discovered: false
},
{
        name: "BASF Mitte",
        lat: 49.510264,
        lng: 8.432009,

        lines: ["S44"],


        discovered: false
},
{
        name: "BASF Süd",
        lat: 49.494008,
        lng: 8.438953,

        lines: ["S44"],


        discovered: false
},
];
