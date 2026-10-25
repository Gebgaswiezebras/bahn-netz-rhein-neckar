//=====================================================
// CARTO API-KEY
//=====================================================
//
// CARTO verlangt seit Herbst 2026 einen kostenlosen API-Key
// für die Positron-Karte. Ohne Key erscheinen nur Kacheln
// mit dem Wasserzeichen "API KEY REQUIRED".
//
// Key anfordern unter: carto.com/basemaps/apikey

const CARTO_API_KEY = "cb1_46s6_1_4f850bbbce736578459a8338";


//-----------------------------------------------------
// BEWEGBAREN KARTENBEREICH BEGRENZEN
//-----------------------------------------------------
//
// Südwestliche und nordöstliche Ecke des erlaubten Bereichs

const mapBounds = L.latLngBounds(
    [48.460586, 5.768847], // südwestliche Ecke
    [50.599741, 10.872308]  // nordöstliche Ecke
);

const map = L.map("karte", {
    minZoom: 10,
    maxZoom: 18,

    // Erlaubt Zwischenzoomstufen
    zoomSnap: 0.5,
    zoomDelta: 0.25,

    // Mausradzoom langsamer und weicher
    wheelPxPerZoomLevel: 180,

    // Animationen aktivieren
    zoomAnimation: true,
    fadeAnimation: true,
    markerZoomAnimation: true,

    // Bewegbaren Kartenbereich begrenzen
    maxBounds: mapBounds,
    maxBoundsViscosity: 1.0

}).setView([49.4875, 8.4660], 12);

//=====================================================
// KARTENHINTERGRÜNDE
//=====================================================
//
// Wir speichern den Kartenhintergrund in einer Variablen,
// damit wir ihn später beim Moduswechsel austauschen können.
//
// Normalmodus:
// - Karte mit Beschriftungen
//
// Quizmodus:
// - Karte ohne Beschriftungen, damit keine Stations-/Ortsnamen verraten werden

// Wird erst in updateBaseMap() mit der passenden Karte belegt.
// Vorher wurde hier schon eine Karte geladen und direkt wieder
// entfernt – das war doppelte Arbeit.
let baseMapLayer = null;


//=====================================================
// PROJEKTZUSTAND
//=====================================================

// "normal" = normales Anzeigenetz
// "quiz" = Quizmodus
let gameMode = "normal";

// Speichert, für welche Linien die Abschluss-Animation
// bereits abgespielt wurde.
// Dadurch pulsiert eine fertige Linie nicht bei jedem updateMap() erneut.
const completedLineAnimations = new Set();

// Speichert die Reihenfolge der im Quiz gefundenen Stationen.
// Neu gefundene Stationen werden vorne eingefügt,
// damit die neueste Station oben steht.
const foundStationHistory = [];

// Speichert das aktuell sichtbare Popup einer gefundenen Quiz-Station
let quizFoundPopup = null;

// Speichert das Popup, das nach einer erfolgreichen Stationssuche erscheint.
// Es wird im Normalmodus über der gefundenen Station angezeigt
// und erst wieder geschlossen, wenn die Karte bewegt oder gezoomt wird.
let normalSearchPopup = null;

// Speichert den Timer, der die Meldung unter dem Suchfeld
// nach 2 Sekunden ausblendet.
// Wird gebraucht, um einen alten Timer abzubrechen,
// wenn schon vorher eine neue Meldung kommt.
let searchFeedbackTimer = null;


//-----------------------------------------------------
// ZEICHENEBENEN (PANES) FÜR SCHIENENLINIEN
//-----------------------------------------------------
//
// Eine "Pane" ist eine eigene Zeichenebene in Leaflet.
// Über zIndex wird festgelegt, welche Ebene oben liegt:
// höhere Zahl = weiter oben.
//
// Reihenfolge von unten nach oben:
//   Kartenkacheln (200)
//   S-Bahn        (380)  ← liegt unter der Tram
//   Straßenbahn   (390)
//   Radwege       (400, Leaflet-Standard "overlayPane")
//   Marker        (600)

// Ebene für S-Bahn-Linien
map.createPane("sbahnPane");
map.getPane("sbahnPane").style.zIndex = 380;

// Ebene für Straßenbahnlinien (über der S-Bahn)
map.createPane("tramPane");
map.getPane("tramPane").style.zIndex = 390;


//=====================================================
// LAYER
//=====================================================

// Alle Marker kommen später in diese Ebene.
const markerLayer = L.layerGroup().addTo(map);

// Alle Linien kommen später in diese Ebene.
const lineLayer = L.layerGroup().addTo(map);

// Alle Radwege kommen später in diese Ebene
const bikeLayer = L.layerGroup().addTo(map);





//-----------------------------------------------------
// AKTIVE FAHRRADWEG-KATEGORIEN
//-----------------------------------------------------
//
// Am Anfang sind alle Fahrradwegarten sichtbar.
// Klickt man später einen Filterbutton an,
// wird die jeweilige Kategorie ein- oder ausgeblendet.

const activeBikeWayTypes = new Set(Object.keys(bikeWayTypes));


//=====================================================
// LINIEN-HILFSFUNKTIONEN
//=====================================================
//
// Diese Funktionen holen Informationen über eine Linie.
// Dadurch müssen wir später nicht überall direkt auf transitLines zugreifen.

function getLineColor(line) {

    // Falls die Linie existiert, gib ihre Farbe zurück.
    if (transitLines[line]) {
        return transitLines[line].color;
    }

    // Fallback-Farbe, falls eine Linie noch nicht angelegt wurde.
    return "#999999";
}


function getLineType(line)
{

    // Falls die Linie existiert, gib ihren Typ zurück.
    if (transitLines[line]) {
        return transitLines[line].type;
    }

    // Standardmäßig behandeln wir unbekannte Linien als Straßenbahn.
    return "tram";
}


//=====================================================
// LINIENSYMBOL ERZEUGEN
//=====================================================
//
// Diese Funktion erzeugt ein kleines HTML-Symbol für eine Linie.
// Wichtig:
// Sie steht global, also außerhalb aller anderen Funktionen.
// Dadurch kann sie sowohl im Progress-Kreis als auch im Infofeld
// verwendet werden.

function createLineSymbolHTML(line) {

    const lineColor = getLineColor(line);
    const lineType = getLineType(line);

    //-------------------------------------------------
    // Symbolform abhängig vom Linientyp
    //-------------------------------------------------

    let typeClass = "line-symbol-tram";

    if (lineType === "sbahn") {
        typeClass = "line-symbol-sbahn";
    }

    //-------------------------------------------------
    // HTML für das Symbol zurückgeben
    //-------------------------------------------------

    // data-line merkt sich, zu welcher Linie das Symbol gehört.
    // Damit kann ein Klick darauf später den passenden
    // Linien-Steckbrief öffnen (siehe Klick-Handler am Infofeld).
    return `
        <span class="line-symbol ${typeClass}"
              data-line="${line}"
              style="--line-color: ${lineColor};">
            ${line}
        </span>
    `;
}


//=====================================================
// STATIONSDETAIL-LABELS
//=====================================================
//
// Hier wird festgelegt, wie technische Detailnamen
// im Infofeld angezeigt werden.
//
// Beispiel:
// gleise      → Anzahl Gleise
// bahnsteige  → Anzahl Bahnsteige

const stationDetailLabels = {
    bahnsteiggleise: "Bahnsteiggleise",
    aussenbahnsteige: "Außenbahnsteige",
    inselbahnsteige: "Inselbahnsteige",
    inselbahnsteigkanten: "Inselbahnsteigkanten",
    getrennt: "Getrennte Haltestelle",
    doppelhaltestelle: "Doppelhaltestelle",
    anzeiger: "Anzeigerart"

    // Hinweis: Die benachbarten Stationen werden nicht mehr
    // von Hand eingetragen, sondern automatisch berechnet
    // (siehe Block "AUTOMATISCHE NACHBARSTATIONEN").
};

const anzeigerLabels = {
    analog: "Analog",
    digital_klein: "Digital klein",
    digital_gross: "Digital groß",
    digital_neu: "Digital neu"
};

const stationDetailOrder = [
    "bahnsteiggleise",
    "aussenbahnsteige",
    "inselbahnsteige",
    "inselbahnsteigkanten",
    "getrennt",
    "doppelhaltestelle",
    "anzeiger"
];



//=========================================================================================================
// HILFSFUNKTIONEN
//=====================================================

//-----------------------------------------------------
// MARKERGRÖẞE ABHÄNGIG VOM ZOOM
//-----------------------------------------------------
//
// Je weiter man rauszoomt, desto kleiner werden die Marker.
// Beim Reinzoomen werden sie wieder größer.

function getMarkerSizeForZoom() {

    const zoom = map.getZoom();

    if (zoom <= 10) {
        return 5;
    }

    if (zoom <= 11) {
        return 6;
    }

    if (zoom <= 12) {
        return 7;
    }

    if (zoom <= 13) {
        return 8;
    }

    return 9;
}


//=====================================================
// STATIONSMARKER (PERFORMANCE-VERSION)
//=====================================================
//
// Grundidee:
// - Jede Station bekommt genau EINEN Leaflet-Marker.
// - Innerhalb dieses Markers liegen die farbigen Liniensymbole
//   als kleines Raster (per CSS Grid, Abstände in Pixeln).
// - Die Marker werden nur EINMAL beim Start erzeugt.
// - Danach ändern wir nur noch CSS-Klassen bzw. CSS-Variablen:
//     * Zoom      → CSS-Variable --marker-size am Kartencontainer
//     * Entdeckt  → CSS-Klasse "discovered" am Marker
//     * Quizmodus → CSS-Klasse "quiz-active" am <body> (gibt es schon)
//
// Dadurch muss beim Zoomen oder Verschieben nichts neu gebaut werden.


//-----------------------------------------------------
// SPEICHER FÜR ALLE STATIONSMARKER
//-----------------------------------------------------
//
// Ordnet jeder Station (dem Objekt aus tramStations)
// ihren Leaflet-Marker zu.
// So finden wir später z. B. nach einer richtigen Quiz-Antwort
// sofort den passenden Marker, ohne alles neu zu zeichnen.

const stationMarkers = new Map();


//-----------------------------------------------------
// FARBSEGMENTE FÜR EIN ÜBERSICHTSSYMBOL
//-----------------------------------------------------
//
// Erzeugt einen CSS-Farbverlauf, der ein Symbol wie
// ein Tortendiagramm in gleich große Stücke aufteilt –
// ein Stück pro Linie, in der jeweiligen Linienfarbe.
//
// lines = Liste von Liniennamen, z. B. ["1", "3", "4"]
//
// Bei nur einer Linie entsteht einfach eine volle Farbfläche.
//
// Beispiel für 3 Linien (rot, grün, blau):
// conic-gradient(rot 0% 33.33%, grün 33.33% 66.67%, blau 66.67% 100%)

function createSegmentGradient(lines) {

    // Größe eines Stücks in Prozent
    const step = 100 / lines.length;

    const segments = lines.map(function (line, index) {

        // Anfang und Ende dieses Stücks in Prozent
        const start = (index * step).toFixed(2);
        const end = ((index + 1) * step).toFixed(2);

        // "Farbe Start% Ende%" → harte Kante, kein Übergang
        return `${getLineColor(line)} ${start}% ${end}%`;
    });

    return `conic-gradient(${segments.join(", ")})`;
}


//-----------------------------------------------------
// EIN ÜBERSICHTSSYMBOL ERZEUGEN
//-----------------------------------------------------
//
// Erzeugt das HTML für EIN Symbol der Übersicht:
// - Quadrat für Straßenbahn
// - Kreis für S-Bahn
//
// lines     = Linien dieses Verkehrsmittels an der Station
// shapeType = "tram" oder "sbahn"
//
// Gibt einen leeren Text zurück, wenn die Liste leer ist
// (z. B. Station ohne S-Bahn → kein Kreis).

function createOverviewSymbolHTML(lines, shapeType) {

    if (lines.length === 0) {
        return "";
    }

    // Form: Quadrat oder Kreis
    let shapeClass = "overview-symbol-tram";

    if (shapeType === "sbahn") {
        shapeClass = "overview-symbol-sbahn";
    }

    // Symbole mit mehreren Linien werden etwas größer,
    // damit die einzelnen Farbsegmente erkennbar bleiben
    let sizeClass = "";

    if (lines.length > 1) {
        sizeClass = "overview-symbol-multi";
    }

    return `
        <div class="overview-symbol ${shapeClass} ${sizeClass}"
             style="background: ${createSegmentGradient(lines)};"></div>
    `;
}


//-----------------------------------------------------
// ICON FÜR EINE STATION ERZEUGEN
//-----------------------------------------------------
//
// Aufbau des Markers:
//
// <div class="station-marker">              ← Hitbox (anklickbar)
//
//    <div class="station-overview">         ← ÜBERSICHT (herausgezoomt)
//       <div class="overview-symbol ...">   ← Quadrat: alle Tramlinien
//       <div class="overview-symbol ...">   ← Kreis: alle S-Bahn-Linien
//    </div>
//
//    <div class="station-marker-grid">      ← DETAIL (hineingezoomt)
//       <span class="line-dot ...">         ← ein Symbol pro Linie
//    </div>
//
// </div>
//
// Beide Darstellungen sind IMMER im Marker vorhanden.
// Welche sichtbar ist, entscheidet nur das CSS anhand
// der Klasse "zoom-detail" am Kartencontainer.
// → Beim Zoomen muss nichts neu gebaut werden.

function createStationIcon(station) {

    const lineCount = station.lines.length;


    //-------------------------------------------------
    // Linien nach Verkehrsmittel aufteilen
    //-------------------------------------------------

    const tramLinesAtStation = station.lines.filter(function (line) {
        return getLineType(line) === "tram";
    });

    const sbahnLinesAtStation = station.lines.filter(function (line) {
        return getLineType(line) === "sbahn";
    });


    //-------------------------------------------------
    // Größe des anklickbaren Bereichs (Hitbox)
    //-------------------------------------------------
    //
    // Stationen mit vielen Linien bekommen eine größere Fläche,
    // damit das ganze Raster gut anklickbar ist.

    let hitboxSize = 28;

    if (lineCount >= 3) {
        hitboxSize = 36;
    }

    if (lineCount >= 5) {
        hitboxSize = 44;
    }

    if (lineCount >= 8) {
        hitboxSize = 54;
    }


    //-------------------------------------------------
    // ÜBERSICHT: höchstens zwei Symbole
    //-------------------------------------------------
    //
    // Links das Quadrat für die Tram, rechts der Kreis
    // für die S-Bahn. Fehlt ein Verkehrsmittel, entfällt
    // das jeweilige Symbol einfach.

    const overviewHTML = `
        <div class="station-overview">
            ${createOverviewSymbolHTML(tramLinesAtStation, "tram")}
            ${createOverviewSymbolHTML(sbahnLinesAtStation, "sbahn")}
        </div>
    `;


    //-------------------------------------------------
    // DETAIL: Raster mit einem Symbol pro Linie
    //-------------------------------------------------

    // Möglichst quadratisches Raster:
    // 1 Linie → 1 Spalte, 4 → 2, 9 → 3, 15 → 4
    const columns = Math.ceil(Math.sqrt(lineCount));

    // Straßenbahn → Quadrat, S-Bahn → Kreis
    // Die Farbe wird über die CSS-Variable --line-color übergeben.
    const dotsHTML = station.lines.map(function (line) {

        let shapeClass = "line-dot-tram";

        if (getLineType(line) === "sbahn") {
            shapeClass = "line-dot-sbahn";
        }

        return `
            <span class="line-dot ${shapeClass}"
                  style="--line-color: ${getLineColor(line)};"></span>
        `;
    }).join("");

    const gridHTML = `
        <div class="station-marker-grid"
             style="--columns: ${columns};">
            ${dotsHTML}
        </div>
    `;


    //-------------------------------------------------
    // Leaflet-Icon zurückgeben
    //-------------------------------------------------

    return L.divIcon({

        // Diese Klasse bekommt das äußere Marker-Element.
        // Wichtig: nicht leer lassen, sonst setzt Leaflet
        // seine eigene Standardklasse mit weißem Kasten.
        className: "station-marker",

        // Beide Darstellungen hintereinander einfügen
        html: overviewHTML + gridHTML,

        // Größe der Hitbox, Inhalt wird per CSS zentriert
        iconSize: [hitboxSize, hitboxSize],

        // Mitte der Hitbox liegt genau auf der Station
        iconAnchor: [hitboxSize / 2, hitboxSize / 2],

        // Tooltip erscheint am oberen Rand der Hitbox
        tooltipAnchor: [0, -hitboxSize / 2]
    });
}


//-----------------------------------------------------
// TOOLTIP-INHALT FÜR EINE STATION
//-----------------------------------------------------
//
// Der Tooltip ist das kleine Etikett, das beim Hovern
// über einer Station erscheint.
//
// Diese Funktion wird bei jedem Hovern neu aufgerufen →
// passt sich automatisch an Modus und Quizstand an.
//
// - Quiz + noch nicht erraten: nur Hinweistext,
//   damit weder Name noch Liniennummern verraten werden
// - sonst: Stationsname + Liniensymbole darunter

function getStationTooltipText(station) {

    if (gameMode === "quiz" && station.discovered === false) {
        return "Noch nicht erraten";
    }

    // Liniensymbole wie im Infofeld erzeugen
    const lineSymbolsHTML = station.lines
        .map(function (line) {
            return createLineSymbolHTML(line);
        })
        .join("");

    return `
        <div class="tooltip-station-name">${station.name}</div>
        <div class="tooltip-line-symbols">
            ${lineSymbolsHTML}
        </div>
    `;
}


//-----------------------------------------------------
// ALLE STATIONSMARKER EINMALIG ERZEUGEN
//-----------------------------------------------------
//
// Wird nur EINMAL beim Programmstart aufgerufen.
// Später werden die Marker nur noch aktualisiert,
// nicht neu erzeugt.

function createAllStationMarkers() {

    // Sicherheitsprüfung:
    // Falls die Marker schon existieren, nichts doppelt anlegen.
    if (stationMarkers.size > 0) {
        return;
    }

    tramStations.forEach(function (station) {

        const marker = L.marker([station.lat, station.lng], {
            icon: createStationIcon(station),

            // Leaflet soll die Marker beim Hover nicht
            // automatisch nach vorne holen (spart Arbeit)
            riseOnHover: false
        }).addTo(markerLayer);


        //-------------------------------------------------
        // HOVER: Tooltip mit Stationsnamen
        //-------------------------------------------------
        //
        // Ein Tooltip ist leichter als ein Popup und öffnet/schließt
        // sich beim Hovern automatisch – dafür brauchen wir keine
        // eigenen mouseover/mouseout-Events mehr.
        //
        // Statt eines festen Textes übergeben wir eine Funktion.
        // Leaflet ruft sie bei jedem Öffnen auf → Text ist immer aktuell.

                marker.bindTooltip(function () {
            return getStationTooltipText(station);
        }, {
            direction: "top",

            // Eigene CSS-Klasse für Stations-Tooltips.
            // Damit können wir sie gezielt gestalten
            // (z. B. feste Breite), ohne andere Tooltips
            // von Leaflet zu verändern.
            className: "station-tooltip"
        });


        //-------------------------------------------------
        // KLICK: Infos im rechten Panel anzeigen
        //-------------------------------------------------

        marker.on("click", function () {

            // Im Quiz dürfen unentdeckte Stationen
            // keine Infos verraten
            if (gameMode === "quiz" && station.discovered === false) {
                return;
            }

            showStationInInfoPanel(station);
        });


        // Marker merken, damit wir ihn später wiederfinden
        stationMarkers.set(station, marker);
    });
}


//-----------------------------------------------------
// EINEN EINZELNEN MARKER AKTUALISIEREN
//-----------------------------------------------------
//
// Setzt oder entfernt die CSS-Klasse "discovered".
// Das ist sehr schnell, weil nur eine Klasse am
// bestehenden Element geändert wird.

function refreshStationMarker(station) {

    const marker = stationMarkers.get(station);

    if (!marker) {
        return;
    }

    // Das echte HTML-Element des Markers auf der Karte
    const element = marker.getElement();

    if (!element) {
        return;
    }

    // toggle(klasse, bedingung):
    // true  → Klasse wird gesetzt
    // false → Klasse wird entfernt
    element.classList.toggle("discovered", station.discovered === true);
}


//-----------------------------------------------------
// ZOOMSTUFE FÜR DIE DETAILANSICHT
//-----------------------------------------------------
//
// Ab dieser Zoomstufe wird das volle Raster aller
// Liniensymbole gezeigt. Darunter erscheint die
// Übersicht (Quadrat für Tram, Kreis für S-Bahn).
//
// Größere Zahl = Raster erscheint erst später beim Reinzoomen.

const DETAIL_ZOOM_LEVEL = 14;


//-----------------------------------------------------
// MARKER AN DEN ZOOM ANPASSEN
//-----------------------------------------------------
//
// Wird beim Start und nach jedem Zoom aufgerufen.
// Es wird KEIN Marker neu erzeugt, nur der Kartencontainer
// wird angepasst:
//
// 1. CSS-Variable --marker-size
//    → bestimmt die Größe aller Symbole
//
// 2. CSS-Klasse "zoom-detail"
//    → gesetzt:       volles Raster aller Linien
//    → nicht gesetzt: Übersicht mit Farbsegmenten

function updateMarkerSize() {

    const container = map.getContainer();

    //-------------------------------------------------
    // 1. Größe der Symbole
    //-------------------------------------------------

    const size = getMarkerSizeForZoom();

    container.style.setProperty("--marker-size", size + "px");

    //-------------------------------------------------
    // 2. Detailansicht an- oder ausschalten
    //-------------------------------------------------
    //
    // toggle(klasse, bedingung):
    // true  → Klasse wird gesetzt
    // false → Klasse wird entfernt

    const showDetails = map.getZoom() >= DETAIL_ZOOM_LEVEL;

    container.classList.toggle("zoom-detail", showDetails);
}





//-----------------------------------------------------
// PRÜFEN, OB STATIONSINFOS ANGEZEIGT WERDEN DÜRFEN
//-----------------------------------------------------
//
// Im Normalmodus dürfen Infos immer angezeigt werden.
// Im Quizmodus nur dann, wenn die Station bereits erraten wurde.

function canShowStationInfo(station) {
    return gameMode === "normal" || station.discovered === true;
}

//=====================================================
// 🚋 LINIEN-STECKBRIEFE
//=====================================================
//
// Zeigt im Infofeld:
// - eine Übersicht aller Linien (Linien-Modus)
// - einen Steckbrief pro Linie mit automatisch
//   berechneten Kennzahlen und optionalen Zusatzinfos
//
// Beim Öffnen eines Steckbriefs fliegt die Karte zur Linie
// und die Linie "poppt" kurz auf.


//-----------------------------------------------------
// ANZEIGENAMEN FÜR DIE HANDGEPFLEGTEN ZUSATZINFOS
//-----------------------------------------------------
//
// Gleiches Prinzip wie bei den Stationsdetails:
// links der Schlüssel aus lines.js (info: { … }),
// rechts der Text im Steckbrief.
// Die Reihenfolge der Anzeige bestimmt lineInfoOrder.

const lineInfoLabels = {
    laufweg: "Laufweg",
    betreiber: "Betreiber",
    takt: "Takt",
    fahrzeit: "Fahrzeit",
    eroeffnet: "Eröffnet"
};

const lineInfoOrder = [
    "laufweg",
    "betreiber",
    "takt",
    "fahrzeit",
    "eroeffnet"
];


//-----------------------------------------------------
// EINSTELLUNGEN FÜR DIE HERVORHEBUNG
//-----------------------------------------------------

// Dauer des Kartenflugs zur Linie (Sekunden)
const LINE_FOCUS_FLY_SECONDS = 0.8;

// Dauer des Aufpoppens (ms)
const LINE_POP_DURATION_MS = 900;

// Wie viel dicker die Linie beim Aufpoppen kurz wird
const LINE_POP_SCALE = 2.6;


//-----------------------------------------------------
// ABSTAND ZWISCHEN ZWEI PUNKTEN IN METERN
//-----------------------------------------------------
//
// Haversine-Formel: berechnet die Entfernung zwischen
// zwei Koordinaten auf der Erdkugel.
// a, b = [lat, lng]

function getDistanceMeters(a, b) {

    const R = 6371000; // Erdradius in Metern
    const toRad = Math.PI / 180;

    const dLat = (b[0] - a[0]) * toRad;
    const dLng = (b[1] - a[1]) * toRad;

    const h =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(a[0] * toRad) * Math.cos(b[0] * toRad) *
        Math.sin(dLng / 2) ** 2;

    return 2 * R * Math.asin(Math.sqrt(h));
}


//-----------------------------------------------------
// STRECKENLÄNGE EINER LINIE IN KM
//-----------------------------------------------------
//
// Summiert die Abstände aller aufeinanderfolgenden
// Gleispunkte aus tracks.js.
// Gibt null zurück, wenn die Linie (noch) keinen
// Gleisverlauf hat.

function getLineLengthKm(line) {

    const coords = tramTrackPoints[line];

    if (!coords || coords.length < 2) {
        return null;
    }

    let meters = 0;

    for (let i = 1; i < coords.length; i++) {
        meters += getDistanceMeters(coords[i - 1], coords[i]);
    }

    return meters / 1000;
}

//-----------------------------------------------------
// MAXIMALER ABSTAND EINER STATION ZUM GLEIS
//-----------------------------------------------------
//
// Liegt eine Station weiter als diesen Wert vom gezeichneten
// Gleisverlauf entfernt, wird sie für die Abstandsberechnung
// ignoriert – z. B. weil dieser Teil der Linie noch gar nicht
// eingezeichnet ist.

const MAX_STATION_TRACK_DISTANCE_METERS = 300;


//-----------------------------------------------------
// POSITION EINER STATION ENTLANG DER STRECKE
//-----------------------------------------------------
//
// Sucht den Punkt auf dem Gleisverlauf, der der Station
// am nächsten liegt, und gibt zurück:
//
// - chainage: wie viele Meter dieser Punkt vom Anfang
//             der Linie entfernt ist ("Streckenkilometer")
// - distance: wie weit die Station vom Gleis entfernt liegt
//
// Vorgehen:
// 1. Jedes Gleisstück (Punkt i → Punkt i+1) einzeln prüfen
// 2. Auf dem Stück den nächsten Punkt zur Station bestimmen
//    (gleiche Methode wie bei den Gleisverschiebungen)
// 3. Das Stück mit dem kleinsten Abstand gewinnt
// 4. Streckenposition = Länge aller Stücke davor
//                       + Anteil des aktuellen Stücks

function projectStationOnTrack(station, coords) {

    // Längengrade sind hier kürzer als Breitengrade.
    // Für ein "flaches" Koordinatensystem in Metern werden
    // sie mit cos(Breitengrad) gestaucht.
    const R = 6371000;
    const toRad = Math.PI / 180;
    const scale = Math.cos(station.lat * toRad);

    // Punkt [lat, lng] → [x, y] in Metern
    function toXY(point) {
        return [
            point[1] * toRad * R * scale,
            point[0] * toRad * R
        ];
    }

    const p = toXY([station.lat, station.lng]);

    let best = null;

    // Bisher zurückgelegte Strecke bis zum Anfang des
    // aktuellen Gleisstücks
    let lengthBefore = 0;

    for (let i = 0; i < coords.length - 1; i++) {

        const a = toXY(coords[i]);
        const b = toXY(coords[i + 1]);

        const dx = b[0] - a[0];
        const dy = b[1] - a[1];
        const segmentLength = Math.hypot(dx, dy);

        // t = wo auf dem Stück der nächste Punkt liegt
        // (0 = am Anfang, 1 = am Ende)
        let t = 0;

        if (segmentLength > 0) {
            t = ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / (segmentLength ** 2);
            t = Math.max(0, Math.min(1, t));
        }

        // Nächster Punkt auf dem Stück und Abstand dorthin
        const x = a[0] + t * dx;
        const y = a[1] + t * dy;
        const distance = Math.hypot(p[0] - x, p[1] - y);

        if (best === null || distance < best.distance) {
            best = {
                distance: distance,
                chainage: lengthBefore + t * segmentLength
            };
        }

        lengthBefore += segmentLength;
    }

    return best;
}


//-----------------------------------------------------
// HALTESTELLENABSTÄNDE EINER LINIE
//-----------------------------------------------------
//
// Berechnet Durchschnitt, kürzesten und längsten Abstand
// zwischen zwei aufeinanderfolgenden Stationen.
//
// Rückgabe:
// {
//     method:  "track" | "ring" | "estimate",
//     average: Meter,
//     min:     { meters, from, to }   ← nur bei track/ring
//     max:     { meters, from, to }   ← nur bei track/ring
// }
// oder null, wenn nichts berechenbar ist.
//
// from / to = Station-Objekte an beiden Enden des Abschnitts
//
// Vorgehen ("track" bzw. "ring"):
// 1. Jede Station auf den Gleisverlauf projizieren
//    (siehe projectStationOnTrack)
// 2. Stationen zu weit weg vom Gleis ignorieren
// 3. Nach Streckenposition sortieren = Fahrtreihenfolge
// 4. Abstand zwischen jeder Station und der nächsten berechnen
// 5. Bei einer Ringlinie zusätzlich: letzte → erste Station
// 6. Durchschnitt, Minimum und Maximum bestimmen
//
// "estimate" (Rückfall ohne brauchbaren Gleisverlauf):
//   Streckenlänge ÷ (Anzahl Stationen − 1), ohne Min/Max

function getStationSpacingStats(line) {

    const stationsOfLine = stationsByLine.get(line) || [];
    const coords = tramTrackPoints[line];

    //-------------------------------------------------
    // Variante 1: entlang des Gleisverlaufs
    //-------------------------------------------------

    if (coords && coords.length >= 2) {

        // Jede Station mit ihrer Streckenposition versehen
        const placed = stationsOfLine
            .map(function (station) {
                const result = projectStationOnTrack(station, coords);
                return {
                    station: station,
                    chainage: result ? result.chainage : null,
                    distance: result ? result.distance : Infinity
                };
            })

            // Nur Stationen nah genug am Gleis
            .filter(function (entry) {
                return entry.distance <= MAX_STATION_TRACK_DISTANCE_METERS;
            })

            // In Fahrtreihenfolge sortieren
            .sort(function (a, b) {
                return a.chainage - b.chainage;
            });

        if (placed.length >= 2) {

            //---------------------------------------------
            // Ringlinie erkennen
            //---------------------------------------------
            //
            // Liegen erster und letzter Gleispunkt fast an
            // derselben Stelle (< 50 m), ist die Linie ein Ring.

            const isRing =
                coords.length >= 3 &&
                getDistanceMeters(coords[0], coords[coords.length - 1]) < 50;

            //---------------------------------------------
            // Alle Abschnitte zwischen benachbarten Stationen
            //---------------------------------------------

            const gaps = [];

            for (let i = 1; i < placed.length; i++) {
                gaps.push({
                    meters: placed[i].chainage - placed[i - 1].chainage,
                    from: placed[i - 1].station,
                    to: placed[i].station
                });
            }

            // Beim Ring: Schlussstück von der letzten
            // zurück zur ersten Station
            if (isRing) {

                // Gesamtlänge des Rings in Metern
                const ringLength = getLineLengthKm(line) * 1000;

                const last = placed[placed.length - 1];
                const first = placed[0];

                gaps.push({
                    meters: ringLength - last.chainage + first.chainage,
                    from: last.station,
                    to: first.station
                });
            }

            //---------------------------------------------
            // Sehr kleine Abstände aussortieren
            //---------------------------------------------
            //
            // Zwei Stationen fast an derselben Stelle
            // (z. B. doppelt eingetragen) würden sonst als
            // "kürzester Abstand: 0 m" erscheinen.

            const validGaps = gaps.filter(function (gap) {
                return gap.meters >= 1;
            });

            if (validGaps.length > 0) {

                // Kürzesten und längsten Abschnitt suchen
                let min = validGaps[0];
                let max = validGaps[0];
                let sum = 0;

                validGaps.forEach(function (gap) {
                    if (gap.meters < min.meters) min = gap;
                    if (gap.meters > max.meters) max = gap;
                    sum += gap.meters;
                });

                return {
                    method: isRing ? "ring" : "track",
                    average: sum / validGaps.length,
                    min: min,
                    max: max
                };
            }
        }
    }

    //-------------------------------------------------
    // Variante 2: einfache Näherung als Rückfall
    //-------------------------------------------------

    const lengthKm = getLineLengthKm(line);

    if (lengthKm !== null && stationsOfLine.length >= 2) {
        return {
            method: "estimate",
            average: (lengthKm * 1000) / (stationsOfLine.length - 1),
            min: null,
            max: null
        };
    }

    return null;
}


//-----------------------------------------------------
// ABSTAND ALS TEXT FORMATIEREN
//-----------------------------------------------------
//
// Tram:   auf 10 m gerundet, z. B. "480 m"
// S-Bahn: in km mit einer Nachkommastelle, z. B. "2,4 km"

function formatSpacing(meters, isSbahn) {

    if (isSbahn) {
        return formatNumber(meters / 1000, 1) + " km";
    }

    return Math.round(meters / 10) * 10 + " m";
}


//-----------------------------------------------------
// UMSTEIGEMÖGLICHKEITEN EINER LINIE
//-----------------------------------------------------
//
// Sammelt alle anderen Linien, die an mindestens einer
// Station dieser Linie halten.
// Ergebnis ist sortiert: erst Tram, dann S-Bahn,
// jeweils in der Reihenfolge aus lines.js.

function getConnectingLines(line) {

    const found = new Set();

    (stationsByLine.get(line) || []).forEach(function (station) {
        station.lines.forEach(function (otherLine) {
            if (otherLine !== line) {
                found.add(otherLine);
            }
        });
    });

    // In der Reihenfolge von transitLines zurückgeben
    return Object.keys(transitLines).filter(function (l) {
        return found.has(l);
    });
}


//-----------------------------------------------------
// ZAHL HÜBSCH FORMATIEREN
//-----------------------------------------------------
//
// Deutsches Komma, feste Anzahl Nachkommastellen.
// Beispiel: formatNumber(12.345, 1) → "12,3"

function formatNumber(value, digits) {
    return value.toLocaleString("de-DE", {
        minimumFractionDigits: digits,
        maximumFractionDigits: digits
    });
}


//-----------------------------------------------------
// EINE ZEILE IM STECKBRIEF
//-----------------------------------------------------
//
// Gleiche Optik wie die Stationsdaten
// (station-detail-row aus style.css).

function createLineInfoRowHTML(label, value) {
    return `
        <div class="station-detail-row">
            <span class="station-detail-label">${label}</span>
            <span class="station-detail-value">${value}</span>
        </div>
    `;
}


//-----------------------------------------------------
// ÜBERSICHT ALLER LINIEN
//-----------------------------------------------------
//
// Wird im Linien-Modus angezeigt.
// Jedes Liniensymbol ist anklickbar und öffnet
// den passenden Steckbrief.

function showLineOverview() {

    // Hilfsfunktion: alle Symbole eines Linientyps
    function symbolsOfType(type) {
        return Object.keys(transitLines)
            .filter(function (line) {
                return getLineType(line) === type;
            })
            .map(function (line) {
                return createLineSymbolHTML(line);
            })
            .join("");
    }

    document.getElementById("info").innerHTML = `
        <div class="station-info-card">

            <h2>Linien</h2>
            <p class="line-overview-hint">
                Linie anklicken, um den Steckbrief zu öffnen.
            </p>

            <div class="station-info-section">
                <h3 class="section-tram">Straßenbahn</h3>
                <div class="line-overview-grid">
                    ${symbolsOfType("tram")}
                </div>
            </div>

            <div class="station-info-section">
                <h3 class="section-sbahn">S-Bahn</h3>
                <div class="line-overview-grid">
                    ${symbolsOfType("sbahn")}
                </div>
            </div>

        </div>
    `;
}


//-----------------------------------------------------
// STECKBRIEF EINER LINIE ANZEIGEN
//-----------------------------------------------------
//
// Aufbau:
// 1. Kopf mit großem Liniensymbol und Typ
// 2. Kennzahlen (automatisch berechnet)
// 3. Zusatzinfos aus lines.js (falls vorhanden)
// 4. Umsteigemöglichkeiten (anklickbare Symbole)
//
// Danach: Karte fliegt zur Linie, Linie poppt auf.

function showLineInInfoPanel(line) {

    const lineData = transitLines[line];

    // Unbekannte Linie → nichts tun
    if (!lineData) {
        return;
    }

    const isSbahn = getLineType(line) === "sbahn";
    const typeLabel = isSbahn ? "S-Bahn" : "Straßenbahn";


    //-------------------------------------------------
    // 2. Kennzahlen berechnen
    //-------------------------------------------------

    const stationCount = (stationsByLine.get(line) || []).length;
    const lengthKm = getLineLengthKm(line);

    const factRows = [];

    factRows.push(createLineInfoRowHTML("Stationen", stationCount));

    if (lengthKm !== null) {

        factRows.push(createLineInfoRowHTML(
            "Streckenlänge",
            formatNumber(lengthKm, 1) + " km"
        ));

                //---------------------------------------------
        // Haltestellenabstände: Ø, kürzester, längster
        //---------------------------------------------
        //
        // Berechnung siehe getStationSpacingStats().
        // Min/Max gibt es nur, wenn die Stationen auf den
        // Gleisverlauf projiziert werden konnten.

        const spacing = getStationSpacingStats(line);

        if (spacing !== null) {

            // Durchschnitt
            factRows.push(createLineInfoRowHTML(
                "Ø Haltestellenabstand",
                formatSpacing(spacing.average, isSbahn)
            ));

            // Hilfsfunktion: Wert + Stationspaar darunter
            function gapText(gap) {
                return `
                    ${formatSpacing(gap.meters, isSbahn)}
                    <span class="spacing-pair">
                        ${gap.from.name} – ${gap.to.name}
                    </span>
                `;
            }

            // Kürzester Abstand
            if (spacing.min) {
                factRows.push(createLineInfoRowHTML(
                    "Kürzester Abstand",
                    gapText(spacing.min)
                ));
            }

            // Längster Abstand
            if (spacing.max) {
                factRows.push(createLineInfoRowHTML(
                    "Längster Abstand",
                    gapText(spacing.max)
                ));
            }
        }

    } else {
        factRows.push(createLineInfoRowHTML("Streckenlänge", "noch nicht eingezeichnet"));
    }


    //-------------------------------------------------
    // 3. Handgepflegte Zusatzinfos
    //-------------------------------------------------

    const info = lineData.info || {};

    const infoRows = lineInfoOrder
        .filter(function (key) {
            return info[key] !== undefined;
        })
        .map(function (key) {
            return createLineInfoRowHTML(lineInfoLabels[key] || key, info[key]);
        })
        .join("");

    const infoSectionHTML = infoRows === "" ? "" : `
        <div class="station-info-section">
            <h3>Informationen</h3>
            <div class="station-detail-list">${infoRows}</div>
        </div>
    `;


    //-------------------------------------------------
    // 4. Umsteigemöglichkeiten
    //-------------------------------------------------

    const connecting = getConnectingLines(line);

    const connectingSectionHTML = connecting.length === 0 ? "" : `
        <div class="station-info-section">
            <h3>Umsteigemöglichkeiten</h3>
            <div class="station-line-symbols">
                ${connecting.map(createLineSymbolHTML).join("")}
            </div>
        </div>
    `;


    //-------------------------------------------------
    // Alles ins Infofeld schreiben
    //-------------------------------------------------

    document.getElementById("info").innerHTML = `
        <div class="station-info-card">

            <button class="line-back-button" type="button">
                ← Alle Linien
            </button>

            <div class="line-card-header">
                <span class="line-card-symbol">${createLineSymbolHTML(line)}</span>
                <span class="line-card-type">${typeLabel}</span>
            </div>

            <div class="station-info-section">
                <h3>Kennzahlen</h3>
                <div class="station-detail-list">${factRows.join("")}</div>
            </div>

            ${infoSectionHTML}
            ${connectingSectionHTML}

        </div>
    `;


    //-------------------------------------------------
    // Karte zur Linie bewegen und Linie aufpoppen lassen
    //-------------------------------------------------

    focusLineOnMap(line);
}


//-----------------------------------------------------
// KARTE ZUR LINIE BEWEGEN
//-----------------------------------------------------
//
// Fliegt so, dass die ganze Linie sichtbar ist,
// und lässt sie danach kurz aufpoppen.
// getBoundsForLines() stammt aus der Abschluss-Animation.

function focusLineOnMap(line) {

    map.flyToBounds(getBoundsForLines([line]), {
        padding: [40, 40],
        maxZoom: 15,
        duration: LINE_FOCUS_FLY_SECONDS
    });

    // Erst nach dem Flug aufpoppen, sonst sieht man es nicht
    setTimeout(function () {
        popLine(line);
    }, LINE_FOCUS_FLY_SECONDS * 1000 + 100);
}


//-----------------------------------------------------
// LINIE KURZ AUFPOPPEN LASSEN
//-----------------------------------------------------
//
// Die Linie wird für einen Moment deutlich dicker und
// leuchtet in ihrer eigenen Farbe – danach ist alles
// wieder genau wie vorher. Andere Linien bleiben unverändert.

function popLine(line) {

    const polyline = linePolylines.get(line);

    // Linie ohne Gleisverlauf → nichts zum Aufpoppen
    if (!polyline) {
        return;
    }

    const path = polyline.getElement();

    if (!path) {
        return;
    }

    // Ausgangsdicke der Linie (aus railLineStyles)
    const baseWeight = polyline.options.weight;

    // Linie innerhalb ihrer Ebene nach vorne holen,
    // damit sie beim Aufpoppen nicht verdeckt wird
    polyline.bringToFront();

    // Leuchtfarbe = Linienfarbe (wird im CSS verwendet)
    path.style.setProperty("--glow-color", getLineColor(line));
    path.classList.add("line-pop");

    // Dicke: normal → dick → normal
    const animation = path.animate(
        [
            { strokeWidth: baseWeight },
            { strokeWidth: baseWeight * LINE_POP_SCALE, offset: 0.35 },
            { strokeWidth: baseWeight }
        ],
        {
            duration: LINE_POP_DURATION_MS,
            easing: "ease-out"
        }
    );

    // Danach Leuchten wieder entfernen
    animation.onfinish = function () {
        path.classList.remove("line-pop");
    };
}


//-----------------------------------------------------
// EINZELNE DETAILZEILEN ERZEUGEN
//-----------------------------------------------------
//
// Wandelt ein Objekt mit Details (z. B. { bahnsteiggleise: 2,
// getrennt: false }) in HTML-Zeilen um.
//
// - Reihenfolge kommt aus stationDetailOrder
// - "tram" und "sbahn" werden hier übersprungen,
//   die bekommen eigene Abschnitte
// - "benachbart" wird ebenfalls übersprungen: Falls in stations.js
//   noch alte, händische Nachbar-Einträge stehen, werden sie so
//   einfach ignoriert (die Nachbarn kommen jetzt automatisch)
// - true/false wird zu "Ja"/"Nein"
// - Anzeigerart wird übersetzt (z. B. digital_neu → "Digital neu")
//
// Gibt einen leeren Text zurück, wenn keine Zeile entsteht.

function createDetailRowsHTML(details) {

    const rows = [];

    stationDetailOrder.forEach(function (key) {

        // Diese Schlüssel haben eigene Abschnitte
        if (key === "benachbart" || key === "tram" || key === "sbahn") {
            return;
        }

        const value = details[key];

        // Nicht eingetragen → keine Zeile
        if (value === undefined) {
            return;
        }

        const label = stationDetailLabels[key] || key;

        //---------------------------------------------
        // Wert für die Anzeige aufbereiten
        //---------------------------------------------

        let displayValue = value;

        // Anzeigerart übersetzen
        if (key === "anzeiger") {
            displayValue = anzeigerLabels[value] || value;
        }

        // Ja/Nein statt true/false
        if (value === true) {
            displayValue = "Ja";
        }

        if (value === false) {
            displayValue = "Nein";
        }

        rows.push(`
            <div class="station-detail-row">
                <span class="station-detail-label">${label}</span>
                <span class="station-detail-value">${displayValue}</span>
            </div>
        `);
    });

    return rows.join("");
}


//-----------------------------------------------------
// EINEN ABSCHNITT MIT DETAILZEILEN ERZEUGEN
//-----------------------------------------------------
//
// title   = Überschrift, z. B. "Stationsdaten – S-Bahn"
// details = Objekt mit den Werten
//
// Leere Abschnitte (keine einzige Zeile) werden
// gar nicht erst angezeigt.

function createDetailSectionHTML(title, details) {

    if (!details) {
        return "";
    }

    const rowsHTML = createDetailRowsHTML(details);

    if (rowsHTML === "") {
        return "";
    }

    return `
        <div class="station-info-section">
            <h3>${title}</h3>
            <div class="station-detail-list">
                ${rowsHTML}
            </div>
        </div>
    `;
}


//-----------------------------------------------------
// STATIONSDETAILS ALS LISTE ERZEUGEN
//-----------------------------------------------------
//
// Baut das komplette Detail-HTML einer Station:
//
// 1. Stationsdaten              (gemeinsame Angaben)
// 2. Stationsdaten – Straßenbahn (Block details.tram)
// 3. Stationsdaten – S-Bahn      (Block details.sbahn)
//
// Die benachbarten Stationen sind NICHT mehr Teil dieser Funktion.
// Sie werden automatisch berechnet, siehe createAutoNeighborsHTML().
//
// Stationen ohne tram/sbahn-Block funktionieren wie bisher:
// Dann landet alles im Abschnitt "Stationsdaten".

function createStationDetailsList(station) {

    const details = station.details;

    if (!details) {
        return "";
    }

    //-------------------------------------------------
    // 1.–3. Detail-Abschnitte
    //-------------------------------------------------

    const generalHTML = createDetailSectionHTML("Stationsdaten", details);
    const tramHTML    = createDetailSectionHTML("Stationsdaten – Straßenbahn", details.tram);
    const sbahnHTML   = createDetailSectionHTML("Stationsdaten – S-Bahn", details.sbahn);


    //-------------------------------------------------
    // Alles zusammensetzen
    //-------------------------------------------------

    // Die Nachbarstationen hängt showStationInInfoPanel()
    // separat an (createAutoNeighborsHTML).
    return generalHTML + tramHTML + sbahnHTML;
};

//=====================================================
// AUTOMATISCHE NACHBARSTATIONEN
//=====================================================
//
// Was macht dieser Block?
// Für jede Station werden automatisch die Stationen davor und
// danach auf jeder ihrer Linien gesucht. Dazu kommt die Entfernung
// entlang der Strecke (nicht die Luftlinie).
//
// So funktioniert es:
// 1. Jede Station einer Linie wird auf den Linienverlauf aus
//    tramTrackPoints "projiziert", also auf den nächstgelegenen
//    Punkt der Linie geschoben.
// 2. Dadurch bekommt jede Station einen "Streckenkilometer"
//    (wie weit sie vom Linienanfang entfernt ist).
// 3. Die Stationen werden danach sortiert. Die Nachbarn sind dann
//    einfach die Station davor und die Station danach.
// 4. Die Entfernung ist die Differenz der Streckenkilometer.
//
// Es muss nichts von Hand in stations.js eingetragen werden.
// Neue Stationen oder geänderte Linien werden automatisch berücksichtigt.


//-----------------------------------------------------
// EINSTELLUNGEN
//-----------------------------------------------------

// Liegen Anfangs- und Endpunkt einer Linie näher als diese
// Meterzahl beieinander, wird die Linie als Ring behandelt.
// Dann ist die letzte Station Nachbar der ersten.
const NEIGHBOR_RING_TOLERANCE_METERS = 50;


//-----------------------------------------------------
// ZWISCHENSPEICHER (CACHE)
//-----------------------------------------------------
//
// Die sortierte Stationsliste jeder Linie wird nur einmal berechnet,
// nämlich beim ersten Anklicken einer Station dieser Linie.
// Danach wird sie aus dem Speicher geholt. Das spart Rechenzeit.

const orderedStationsCache = new Map();


//-----------------------------------------------------
// STATIONEN EINER LINIE IN FAHRTREIHENFOLGE SORTIEREN
//-----------------------------------------------------
//
// Rückgabe: { list, totalLength, isRing }
// - list: Stationen sortiert vom Linienanfang zum Linienende,
//         jeweils mit ihrem Streckenkilometer (chainage)
// - totalLength: Gesamtlänge der Linie in Metern
// - isRing: true, wenn die Linie ein geschlossener Ring ist
//
// Gibt null zurück, wenn die Linie (noch) keinen Verlauf hat.

function getOrderedStationsOfLine(line) {

    // Schon einmal berechnet? Dann direkt zurückgeben.
    if (orderedStationsCache.has(line)) {
        return orderedStationsCache.get(line);
    }

    // Nur gültige Punkte verwenden. Ein fehlendes Komma in
    // tracks.js würde sonst einen kaputten Punkt erzeugen.
    const rawPoints = tramTrackPoints[line] || [];
    const points = rawPoints.filter(function (point) {
        return Array.isArray(point) &&
            typeof point[0] === "number" &&
            typeof point[1] === "number";
    });

    // Ohne Linienverlauf keine Nachbarn
    if (points.length < 2) {
        orderedStationsCache.set(line, null);
        return null;
    }

    // Alle Stationen dieser Linie auf den Verlauf projizieren.
    // WICHTIG: Hier wird dieselbe Funktion benutzt wie im
    // Linien-Steckbrief (projectStationOnTrack). Dadurch zeigen
    // Steckbrief und Nachbarstationen immer exakt dieselben Werte.
    const list = tramStations
        .filter(function (station) {
            return station.lines.includes(line);
        })
        .map(function (station) {
            const projection = projectStationOnTrack(station, points);

            return {
                station: station,
                chainage: projection.chainage,
                offset: projection.distance
            };
        })
        // Stationen weit weg von der Linie aussortieren.
        // Gleicher Grenzwert wie im Steckbrief (300 m).
        .filter(function (entry) {
            return entry.offset <= MAX_STATION_TRACK_DISTANCE_METERS;
        })
        // Vom Linienanfang zum Linienende sortieren
        .sort(function (a, b) {
            return a.chainage - b.chainage;
        });

    // Ring erkennen: Anfangs- und Endpunkt fast am selben Ort?
    // (gleiche Regel wie im Steckbrief)
    const isRing =
        points.length >= 3 &&
        getDistanceMeters(points[0], points[points.length - 1]) < NEIGHBOR_RING_TOLERANCE_METERS;

    // Gesamtlänge in Metern (wird nur beim Ring gebraucht,
    // für den Abschnitt über den Anfangspunkt hinweg)
    const totalLength = getLineLengthKm(line) * 1000;

    const result = {
        list: list,
        totalLength: totalLength,
        isRing: isRing
    };

    orderedStationsCache.set(line, result);
    return result;
}


//-----------------------------------------------------
// NACHBARN EINER STATION AUF EINER LINIE FINDEN
//-----------------------------------------------------
//
// direction = -1 sucht die Station davor,
// direction = +1 sucht die Station danach.
//
// Stationen mit demselben Namen (z. B. zwei Bahnsteige derselben
// Haltestelle) werden übersprungen.
//
// Rückgabe: { station, distance } oder null (Endhaltestelle)

function findNeighborOnLine(ordered, index, direction) {

    const list = ordered.list;
    const current = list[index];

    let i = index + direction;

    // Höchstens einmal um die ganze Liste laufen
    for (let steps = 0; steps < list.length - 1; steps++) {

        // Am Listenende: bei einem Ring wieder vorne bzw. hinten weiter,
        // sonst gibt es in diese Richtung keinen Nachbarn.
        if (i < 0 || i >= list.length) {
            if (!ordered.isRing) {
                return null;
            }
            i = (i + list.length) % list.length;
        }

        const candidate = list[i];

        if (candidate.station.name !== current.station.name) {

            // Entfernung entlang der Strecke
            let distance = Math.abs(candidate.chainage - current.chainage);

            // Beim Ring über den Anfangspunkt hinweg gerechnet
            const wrapsAround = (direction === 1 && i < index) ||
                (direction === -1 && i > index);

            if (ordered.isRing && wrapsAround) {
                distance = ordered.totalLength - distance;
            }

            return {
                station: candidate.station,
                distance: distance
            };
        }

        i += direction;
    }

    return null;
}


//-----------------------------------------------------
// ALLE NACHBARN EINER STATION SAMMELN
//-----------------------------------------------------
//
// Geht alle Linien der Station durch und sammelt die Nachbarn.
// Gleiche Nachbarn auf mehreren Linien werden zusammengefasst,
// z. B. "Paradeplatz – 350 m – Linien 1, 3, 4".
//
// Rückgabe: { tram: [...], sbahn: [...] }
// Jeder Eintrag: { name, distance, lines: [...] }

function getAutoNeighbors(station) {

    const groups = {
        tram: new Map(),
        sbahn: new Map()
    };

    station.lines.forEach(function (line) {

        const ordered = getOrderedStationsOfLine(line);
        if (!ordered) {
            return;
        }

        // Position der angeklickten Station in der sortierten Liste
        const index = ordered.list.findIndex(function (entry) {
            return entry.station === station;
        });

        // Station liegt zu weit von der Linie weg → keine Nachbarn
        if (index === -1) {
            return;
        }

        // Straßenbahn oder S-Bahn?
        // Doppelt abgesichert: Entweder steht in lines.js type "sbahn"
        // (Groß-/Kleinschreibung und Bindestrich egal), oder der
        // Linienname beginnt mit "S" und einer Zahl (S1, S2, S33 ...).
        const lineTypeText = String(getLineType(line)).toLowerCase().replace("-", "");
        const isSbahnLine = lineTypeText === "sbahn" || /^S\d/.test(line);
        const type = isSbahnLine ? "sbahn" : "tram";

        [-1, 1].forEach(function (direction) {

            const neighbor = findNeighborOnLine(ordered, index, direction);
            if (!neighbor) {
                return;
            }

            const key = neighbor.station.name;
            const existing = groups[type].get(key);

            if (existing) {
                // Nachbar schon bekannt → Linie ergänzen.
                // Als Entfernung gilt die kürzeste aller Linien.
                if (!existing.lines.includes(line)) {
                    existing.lines.push(line);
                }
                existing.distance = Math.min(existing.distance, neighbor.distance);
            } else {
                groups[type].set(key, {
                    name: key,
                    distance: neighbor.distance,
                    lines: [line]
                });
            }
        });
    });

    // Maps in Listen umwandeln, nächster Nachbar zuerst
    function toSortedArray(map) {
        return Array.from(map.values()).sort(function (a, b) {
            return a.distance - b.distance;
        });
    }

    return {
        tram: toSortedArray(groups.tram),
        sbahn: toSortedArray(groups.sbahn)
    };
}


//-----------------------------------------------------
// ENTFERNUNG HÜBSCH FORMATIEREN
//-----------------------------------------------------
//
// Straßenbahn: auf 10 m gerundet, z. B. "350 m"
// S-Bahn:      in Kilometern mit einer Nachkommastelle, z. B. "4,2 km"

function formatAutoNeighborDistance(meters, isSbahn) {

    if (isSbahn) {
        return (meters / 1000).toFixed(1).replace(".", ",") + " km";
    }

    return Math.round(meters / 10) * 10 + " m";
}


//-----------------------------------------------------
// HTML FÜR DAS INFOFELD ERZEUGEN
//-----------------------------------------------------
//
// Erzeugt einen Abschnitt "Nachbarstationen" mit je einer
// Unterliste für Straßenbahn und S-Bahn.
// Gibt einen leeren Text zurück, wenn keine Nachbarn gefunden wurden.

function createAutoNeighborsHTML(station) {

    const neighbors = getAutoNeighbors(station);

    // Eine Unterliste (Straßenbahn oder S-Bahn) bauen
    function createGroupHTML(title, items, isSbahn) {

        if (items.length === 0) {
            return "";
        }

        const rowsHTML = items.map(function (item) {

            // Kleine Liniensymbole, über die man zum Nachbarn kommt
            const lineSymbols = item.lines
                .map(function (line) {
                    return createLineSymbolHTML(line);
                })
                .join("");

            return `
                <div class="auto-neighbor-item">
                    <span class="auto-neighbor-name">${item.name}</span>
                    <span class="auto-neighbor-lines">${lineSymbols}</span>
                    <span class="auto-neighbor-distance">
                        ${formatAutoNeighborDistance(item.distance, isSbahn)}
                    </span>
                </div>
            `;
        }).join("");

        return `
            <div class="auto-neighbor-group">
                <h4>${title}</h4>
                ${rowsHTML}
            </div>
        `;
    }

    const tramHTML = createGroupHTML("Straßenbahn", neighbors.tram, false);
    const sbahnHTML = createGroupHTML("S-Bahn", neighbors.sbahn, true);

    // Keine Nachbarn gefunden → Abschnitt ganz weglassen
    if (tramHTML === "" && sbahnHTML === "") {
        return "";
    }

    return `
        <div class="station-info-section auto-neighbors">
            <h3>Nachbarstationen</h3>
            ${tramHTML}
            ${sbahnHTML}
        </div>
    `;
}

//-----------------------------------------------------
// PRÜFFUNKTION: NACHBARN EINER STATION UNTERSUCHEN
//-----------------------------------------------------
//
// Nur zur Fehlersuche. Aufruf in der Browser-Konsole (F12), z. B.:
//     debugAutoNeighbors("MA Hauptbahnhof")
//
// Zeigt für jede Linie der Station eine Tabelle:
// - typ:             was getLineType liefert (S-Bahn sollte "sbahn" sein)
// - punkte:          Anzahl Punkte in tracks.js (0 = Linie nicht gezeichnet)
// - abstandZurLinie: wie weit die Station neben der Linie liegt
// - inListe:         ob die Station für die Nachbarsuche verwendet wird
// - davor / danach:  gefundene Nachbarn auf dieser Linie

function debugAutoNeighbors(stationName) {

    // Station anhand des Namens suchen
    const station = tramStations.find(function (s) {
        return s.name === stationName;
    });

    if (!station) {
        console.warn("Station nicht gefunden:", stationName);
        return;
    }

    const rows = station.lines.map(function (line) {

        const points = tramTrackPoints[line] || [];
        const ordered = getOrderedStationsOfLine(line);

        // Abstand der Station zur Linie (nur wenn die Linie gezeichnet ist)
        let offset = "-";
        if (points.length >= 2) {
            // Gleiche Berechnung wie Steckbrief und Nachbarstationen
            offset = Math.round(projectStationOnTrack(station, points).distance) + " m";
        }

        // Position der Station in der sortierten Liste (-1 = nicht drin)
        const index = ordered
            ? ordered.list.findIndex(function (e) { return e.station === station; })
            : -1;

        const before = index >= 0 ? findNeighborOnLine(ordered, index, -1) : null;
        const after = index >= 0 ? findNeighborOnLine(ordered, index, 1) : null;

        return {
            linie: line,
            typ: getLineType(line),
            punkte: points.length,
            abstandZurLinie: offset,
            inListe: index >= 0,
            davor: before ? before.station.name : "-",
            danach: after ? after.station.name : "-"
        };
    });

    console.table(rows);
}

//-----------------------------------------------------
// INFOFELD FÜR EINE STATION ANZEIGEN
//-----------------------------------------------------
//
// Wird beim Klick auf einen Marker und nach einer
// erfolgreichen Suche aufgerufen.
//
// - Normalmodus: Name, Liniensymbole und alle Stationsdaten
//   (aufgeteilt in Tram / S-Bahn, siehe createStationDetailsList)
// - Quizmodus:   nur Name und Liniensymbole

function showStationInInfoPanel(station) {

    // Liniensymbole aller Linien dieser Station
    const lineSymbolsHTML = station.lines
        .map(function (line) {
            return createLineSymbolHTML(line);
        })
        .join("");


    //-------------------------------------------------
    // NORMALMODUS
    //-------------------------------------------------

    // Im Normal- UND im Linien-Modus die vollständigen
    // Stationsinfos zeigen – nur das Quiz bekommt die Kurzform
    if (gameMode !== "quiz") {

        document.getElementById("info").innerHTML = `
            <div class="station-info-card">

                <h2>${station.name}</h2>

                <div class="station-info-section">
                    <h3>Linien</h3>

                    <div class="station-line-symbols">
                        ${lineSymbolsHTML}
                    </div>
                </div>

                ${createStationDetailsList(station)}

                <!-- Automatisch berechnete Nachbarstationen mit Entfernung -->
                ${createAutoNeighborsHTML(station)}

            </div>
        `;

        return;
    }


    //-------------------------------------------------
    // QUIZMODUS
    //-------------------------------------------------

    document.getElementById("info").innerHTML = `
        <h2>${station.name}</h2>

        <div class="station-line-symbols">
            ${lineSymbolsHTML}
        </div>

        <p>Station erraten.</p>
    `;
};

//-----------------------------------------------------
// GEZEICHNETE LINIEN MERKEN
//-----------------------------------------------------
//
// Ordnet jedem Liniennamen sein Leaflet-Linienobjekt zu,
// z. B. linePolylines.get("1").
// Wird gebraucht, um eine einzelne Linie später kurz
// aufpoppen zu lassen, ohne alle Linien neu zu zeichnen.

const linePolylines = new Map();


//-----------------------------------------------------
// DARSTELLUNG DER SCHIENENLINIEN
//-----------------------------------------------------
//
// Hier wird pro Linientyp festgelegt:
// - weight = Linienstärke in Pixeln
// - pane   = Zeichenebene (bestimmt, was oben liegt)
//
// Die Transparenz der S-Bahn ist nicht hier eingestellt,
// sondern in style.css (Block "S-BAHN-TRANSPARENZ").

const railLineStyles = {
    tram: {
        weight: 3,
        pane: "tramPane"
    },

    sbahn: {
        weight: 4,
        pane: "sbahnPane"
    }
};


//-----------------------------------------------------
// LINIE ZEICHNEN
//-----------------------------------------------------
//
// Zeichnet den Gleisverlauf einer Linie.
// Stärke und Zeichenebene richten sich nach dem Linientyp
// (Straßenbahn oder S-Bahn), siehe railLineStyles.

function drawTramLine(lineName) {

    const coords = tramTrackPoints[lineName];

    // Linie hat (noch) keinen Gleisverlauf → nichts zeichnen
    if (!coords) return;

    // Passenden Stil zum Linientyp holen.
    // Unbekannte Typen werden wie Straßenbahn behandelt.
    const lineType = getLineType(lineName);
    const style = railLineStyles[lineType] || railLineStyles.tram;

        const polyline = L.polyline(coords, {
        color: getLineColor(lineName),
        weight: style.weight,
        opacity: 1,

        // Zeichenebene: S-Bahn unten, Tram oben
        pane: style.pane
    }).addTo(lineLayer);

    // Linie merken (für die Hervorhebung im Linien-Steckbrief)
    linePolylines.set(lineName, polyline);
}



//-----------------------------------------------------
// FAHRRADWEGE ZEICHNEN
//-----------------------------------------------------
//
// Zeichnet alle Fahrradweg-Abschnitte.
// Die Farbe richtet sich nach der Ausbauart des Weges.

function drawBikeSegments() {

    bikeSegments.forEach(function (segment) {

        // Wenn die Fahrradwegart ausgeblendet ist, wird der Abschnitt übersprungen
        if (!activeBikeWayTypes.has(segment.type)) {
            return;
        }

        const typeData = bikeWayTypes[segment.type];

        // Falls eine unbekannte Kategorie eingetragen wurde, wird nichts gezeichnet
        if (!typeData) {
            return;
        }

        const bikeLine = L.polyline(segment.points, {
    color: typeData.color,
    weight: 4,
    opacity: 0.9,
    dashArray: "8, 6"
}).addTo(bikeLayer);

bikeLine.bindPopup(`
    <strong>${segment.name}</strong><br>
    ${typeData.label}
`);
    });
}


//-----------------------------------------------------
// FAHRRADWEG-FILTER UMSCHALTEN
//-----------------------------------------------------

function toggleBikeWayType(type) {

    if (activeBikeWayTypes.has(type)) {
        activeBikeWayTypes.delete(type);
    } else {
        activeBikeWayTypes.add(type);
    }

    updateBikeFilterButtons();

    // Nur Fahrradwege neu zeichnen, nicht die ganze Karte.
    updateBikeLayerOnly();
}


//-----------------------------------------------------
// FAHRRADWEG-FILTERBUTTONS ERZEUGEN
//-----------------------------------------------------

function updateBikeFilterButtons() {

    const container = document.getElementById("bikeFilterButtons");

    if (!container) {
        return;
    }

    container.innerHTML = "";

    Object.keys(bikeWayTypes).forEach(function (type) {

        const typeData = bikeWayTypes[type];
        const isActive = activeBikeWayTypes.has(type);

        const button = document.createElement("button");

        button.className = "bike-filter-button";

        if (isActive) {
            button.classList.add("active");
        }

        button.innerHTML = `
            <span class="bike-filter-dot"
                  style="background: ${typeData.color};"></span>
            ${typeData.label}
        `;

        button.addEventListener("click", function () {
            toggleBikeWayType(type);
        });

        container.appendChild(button);
    });
}


//-----------------------------------------------------
// GLEICHGESETZTE BEGRIFFE FÜR DIE SUCHE
//-----------------------------------------------------
//
// Links:  ausgeschriebene Form
// Rechts: Kurzform, auf die bei der Suche vereinheitlicht wird
//
// Beispiel: Aus "Mannheim Hauptbahnhof" wird intern "ma hbf",
// genau wie aus "MA Hbf". Beide Eingaben finden also
// dieselbe Station.
//
// Neue Gleichsetzungen einfach hier ergänzen.
// Wichtig: alles kleingeschrieben und mit ae/oe/ue/ss
// statt Umlauten (so wie nach dem Normalisieren).

const searchSynonyms = {
    hauptbahnhof: "hbf",
    bahnhof: "bf",
    heidelberg: "hd",
    ludwigshafen: "lu",
    karlsruhe: "ka",
    mannheim: "ma"
};


//-----------------------------------------------------
// EIN EINZELNES WORT VEREINHEITLICHEN
//-----------------------------------------------------
//
// Prüft, ob ein Wort eine der ausgeschriebenen Formen ist,
// und gibt dann die Kurzform zurück. Sonst bleibt das Wort,
// wie es ist.
//
// Kleine Tippfehler werden toleriert, aber nur bei langen
// Wörtern (ab 7 Buchstaben) und höchstens 1 Fehler.
// So wird "hauptbanhof" noch erkannt, ein kurzes Wort wie
// "bahn" aber nicht versehentlich zu "bf".

function applySearchSynonym(word) {

    // 1. Exakter Treffer → direkt ersetzen
    if (searchSynonyms[word]) {
        return searchSynonyms[word];
    }

    // 2. Kleiner Tippfehler in einer langen Form?
    for (const longForm in searchSynonyms) {

        if (longForm.length < 7) {
            continue;
        }

        // Längen zu unterschiedlich → kann nicht passen
        if (Math.abs(longForm.length - word.length) > 1) {
            continue;
        }

        if (getLevenshteinDistance(word, longForm) <= 1) {
            return searchSynonyms[longForm];
        }
    }

    // 3. Kein Treffer → Wort unverändert lassen
    return word;
}


//-----------------------------------------------------
// SUCHTEXT NORMALISIEREN
//-----------------------------------------------------
//
// Macht Eingaben und Stationsnamen vergleichbar:
// - Groß/Kleinschreibung wird ignoriert
// - Umlaute werden vereinheitlicht (ö → oe usw.)
// - Gleichgesetzte Begriffe werden auf ihre Kurzform
//   gebracht (Hauptbahnhof → hbf, Mannheim → ma, …)
// - Leerzeichen, Bindestriche usw. werden entfernt
//
// Dadurch finden z. B. alle diese Eingaben dieselbe Station:
// "MA Hauptbahnhof", "Mannheim Hbf", "mannheim hauptbahnhof"

function normalizeSearchText(text) {

    //-------------------------------------------------
    // 1. Kleinschreibung und Umlaute
    //-------------------------------------------------

    const simplified = text
        .toLowerCase()
        .trim()
        .replaceAll("ä", "ae")
        .replaceAll("ö", "oe")
        .replaceAll("ü", "ue")
        .replaceAll("ß", "ss");

    //-------------------------------------------------
    // 2. In einzelne Wörter zerlegen
    //-------------------------------------------------
    //
    // Alles, was kein Buchstabe oder keine Ziffer ist
    // (Leerzeichen, Bindestrich, Schrägstrich, Klammer …),
    // gilt als Trennzeichen.
    // filter entfernt leere Einträge, z. B. bei "  ".

    const words = simplified
        .split(/[^a-z0-9]+/)
        .filter(function (word) {
            return word !== "";
        });

    //-------------------------------------------------
    // 3. Jedes Wort vereinheitlichen und
    //    ohne Trennzeichen wieder zusammensetzen
    //-------------------------------------------------
    //
    // Erst JETZT werden die Leerzeichen entfernt. Vorher
    // geht es nicht, weil sonst nicht mehr erkennbar wäre,
    // wo ein Wort anfängt und aufhört.

    return words
        .map(function (word) {
            return applySearchSynonym(word);
        })
        .join("");
}


//-----------------------------------------------------
// ERLAUBTE TIPPFEHLER JE NACH NAMENSLÄNGE
//-----------------------------------------------------
//
// Kurze Namen müssen genau stimmen, lange dürfen
// ein paar Fehler enthalten.
//
// Warum?
// Bei "Binau" wären 2 Fehler schon fast die halbe Antwort.
// Bei "Bensheimer Straße" sind 2 Fehler dagegen ein
// normaler Tippfehler.
//
// Im QUIZMODUS gelten strengere Grenzen als bei der
// normalen Suche: Beim Raten soll man den Namen schon
// ziemlich genau kennen. Bei der normalen Suche darf
// man dagegen großzügiger sein.
//
// Groß- und Kleinschreibung spielt in beiden Modi KEINE
// Rolle, weil normalizeSearchText() vorher alles klein
// schreibt. Das zählt also nie als Fehler.
//
// name = bereits normalisierter Stationsname
//        (siehe normalizeSearchText)

// Grenzen für den Quizmodus
// - bis QUIZ_EXACT_MAX_LENGTH Zeichen: kein Fehler erlaubt
// - bis QUIZ_ONE_ERROR_MAX_LENGTH Zeichen: ein Fehler erlaubt
// - darüber: zwei Fehler erlaubt
const QUIZ_EXACT_MAX_LENGTH = 7;
const QUIZ_ONE_ERROR_MAX_LENGTH = 15;

function getAllowedSearchDistance(name) {

    //-------------------------------------------------
    // QUIZMODUS: strenger
    //-------------------------------------------------

    if (gameMode === "quiz") {

        // Kurze Namen (z. B. "Schloss", "Binau"): exakt
        if (name.length <= QUIZ_EXACT_MAX_LENGTH) {
            return 0;
        }

        // Mittlere Namen (z. B. "Paradeplatz"): ein Fehler
        if (name.length <= QUIZ_ONE_ERROR_MAX_LENGTH) {
            return 1;
        }

        // Sehr lange Namen (z. B. "Bürgermeister-Fuchs-Straße"): zwei Fehler
        return 2;
    }


    //-------------------------------------------------
    // NORMALE SUCHE: wie bisher
    //-------------------------------------------------

    // Sehr kurze Namen: kein Fehler erlaubt
    if (name.length <= 5) {
        return 0;
    }

    // Mittlere Namen: ein Fehler erlaubt
    if (name.length <= 9) {
        return 1;
    }

    // Lange Namen: zwei Fehler erlaubt
    return 2;
}


//-----------------------------------------------------
// TEXTABSTAND BERECHNEN (MIT BUCHSTABENDREHERN)
//-----------------------------------------------------
//
// Berechnet, wie viele Änderungen nötig sind, um
// Text a in Text b umzuwandeln.
//
// Als EINE Änderung zählt:
// - ein Zeichen ersetzen      (Haus → Maus)
// - ein Zeichen einfügen      (Hus  → Haus)
// - ein Zeichen löschen       (Hauss → Haus)
// - zwei Nachbarn vertauschen (Hasu → Haus)   ← neu
//
// Ohne die letzte Regel würde ein Buchstabendreher
// als ZWEI Fehler zählen und kurze Namen wären kaum
// noch mit Tippfehler zu finden.
//
// Ergebnis:
// 0 = exakt gleich, 1 = ein Fehler, 2 = zwei Fehler usw.

function getLevenshteinDistance(a, b) {

    const matrix = [];

    //-------------------------------------------------
    // Erste Spalte vorbereiten
    //-------------------------------------------------
    for (let i = 0; i <= b.length; i++) {
        matrix[i] = [i];
    }

    //-------------------------------------------------
    // Erste Zeile vorbereiten
    //-------------------------------------------------
    for (let j = 0; j <= a.length; j++) {
        matrix[0][j] = j;
    }

    //-------------------------------------------------
    // Matrix ausfüllen
    //-------------------------------------------------
    for (let i = 1; i <= b.length; i++) {

        for (let j = 1; j <= a.length; j++) {

            // Kosten 0, wenn die Zeichen gleich sind, sonst 1
            const cost = b.charAt(i - 1) === a.charAt(j - 1) ? 0 : 1;

            matrix[i][j] = Math.min(
                matrix[i - 1][j - 1] + cost, // Zeichen ersetzen (oder gleich)
                matrix[i][j - 1] + 1,        // Zeichen einfügen
                matrix[i - 1][j] + 1         // Zeichen löschen
            );

            //---------------------------------------------
            // Buchstabendreher erkennen
            //---------------------------------------------
            //
            // Wenn die beiden aktuellen Zeichen genau
            // vertauscht zu den beiden vorherigen sind,
            // zählt das nur als ein Fehler.
            //
            // Beispiel: "ie" in "Riehen" statt "ei" in "Reihen"

            if (
                i > 1 &&
                j > 1 &&
                b.charAt(i - 1) === a.charAt(j - 2) &&
                b.charAt(i - 2) === a.charAt(j - 1)
            ) {
                matrix[i][j] = Math.min(
                    matrix[i][j],
                    matrix[i - 2][j - 2] + 1
                );
            }
        }
    }

    return matrix[b.length][a.length];
}


//-----------------------------------------------------
// BESTE PASSENDE STATION FINDEN
//-----------------------------------------------------
//
// Diese Funktion sucht zuerst nach einer exakten Übereinstimmung.
// Falls keine gefunden wird, sucht sie nach der ähnlichsten Station.
// Bis zu MAX_SEARCH_DISTANCE Zeichen Abweichung sind erlaubt.

function findMatchingStation(input) {

    const normalizedInput = normalizeSearchText(input);

    //-------------------------------------------------
    // Leere Eingabe abbrechen
    //-------------------------------------------------
    if (normalizedInput === "") {
        return {
            status: "not-found",
            station: null
        };
    }


    //-------------------------------------------------
    // 1. Exakte Übereinstimmung suchen
    //-------------------------------------------------

    const exactMatch = tramStations.find(function (station) {
        return normalizeSearchText(station.name) === normalizedInput;
    });

    if (exactMatch) {
        return {
            status: "found",
            station: exactMatch
        };
    }


        //-------------------------------------------------
    // 2. Ähnlichste Station suchen
    //-------------------------------------------------
    //
    // Für jede Station wird geprüft:
    // - Wie viele Fehler hat die Eingabe gegenüber dem Namen?
    // - Wie viele Fehler sind bei DIESEM Namen erlaubt?
    //
    // Nur Stationen innerhalb ihrer Toleranz kommen infrage.
    // Unter diesen gewinnt die mit den wenigsten Fehlern.

    let bestDistance = Infinity;
    let bestMatches = [];

    tramStations.forEach(function (station) {

        const stationName = normalizeSearchText(station.name);
        const allowedDistance = getAllowedSearchDistance(stationName);

        //---------------------------------------------
        // Schnelle Vorprüfung
        //---------------------------------------------
        //
        // Wenn sich die Längen stärker unterscheiden als
        // erlaubt, kann es kein Treffer sein.
        // Dann sparen wir uns die aufwendige Berechnung.

        if (Math.abs(stationName.length - normalizedInput.length) > allowedDistance) {
            return;
        }

        const distance = getLevenshteinDistance(normalizedInput, stationName);

        // Zu viele Fehler für diesen Namen → kein Kandidat
        if (distance > allowedDistance) {
            return;
        }

        //---------------------------------------------
        // Besten Treffer merken
        //---------------------------------------------

        if (distance < bestDistance) {

            // Neuer bester Treffer → Liste neu beginnen
            bestDistance = distance;
            bestMatches = [station];

        } else if (distance === bestDistance) {

            // Genauso gut wie der bisher beste → dazunehmen
            bestMatches.push(station);
        }
    });


    //-------------------------------------------------
    // 3. Ergebnis auswerten
    //-------------------------------------------------

    // Genau ein bester Treffer → eindeutig gefunden
    if (bestMatches.length === 1) {
        return {
            status: "found",
            station: bestMatches[0]
        };
    }

    // Mehrere gleich gute Treffer → nicht eindeutig
    if (bestMatches.length > 1) {
        return {
            status: "ambiguous",
            stations: bestMatches
        };
    }


    //-------------------------------------------------
    // Kein passender Treffer gefunden
    //-------------------------------------------------

    return {
        status: "not-found",
        station: null
    };
}


//-----------------------------------------------------
// SUCH-FEEDBACK ANZEIGEN
//-----------------------------------------------------
//
// Zeigt für 2 Sekunden eine Meldung unter dem Suchfeld.
//
// type:
// "error"   = rote Meldung
// "success" = grüne Meldung
//
// Kommt eine neue Meldung, bevor die alte verschwunden ist,
// wird der alte Timer abgebrochen. So bleibt jede Meldung
// volle 2 Sekunden sichtbar.

function showSearchFeedback(message, type) {

    const feedback = document.getElementById("searchFeedback");

    //-------------------------------------------------
    // Laufenden Timer abbrechen (falls vorhanden)
    //-------------------------------------------------
    //
    // clearTimeout stoppt einen Timer, bevor er abläuft.
    // Ist gerade keiner aktiv (null), passiert einfach nichts.

    clearTimeout(searchFeedbackTimer);

    //-------------------------------------------------
    // Text und Farbe setzen
    //-------------------------------------------------

    feedback.textContent = message;
    feedback.className = "";

    if (type === "error") {
        feedback.classList.add("feedback-error");
    }

    if (type === "success") {
        feedback.classList.add("feedback-success");
    }

    feedback.style.display = "block";

    //-------------------------------------------------
    // Neuen Timer starten und merken
    //-------------------------------------------------
    //
    // setTimeout gibt eine Nummer zurück, mit der man den
    // Timer später wieder abbrechen kann. Die speichern wir.

    searchFeedbackTimer = setTimeout(function () {
        feedback.style.display = "none";
    }, 2000);
}

//-----------------------------------------------------
// SUCHFELD RÜTTELN LASSEN
//-----------------------------------------------------
//
// Wird bei falscher Eingabe verwendet.

function shakeSearchInput() {

    const input = document.getElementById("stationseingabe");

    // Klasse kurz entfernen, damit die Animation
    // auch bei mehreren falschen Eingaben hintereinander erneut startet.
    input.classList.remove("input-shake");

    void input.offsetWidth;

    input.classList.add("input-shake");

    setTimeout(function () {
        input.classList.remove("input-shake");
    }, 350);
}


//-----------------------------------------------------
// GEFUNDENE STATION ZUM VERLAUF HINZUFÜGEN
//-----------------------------------------------------
//
// Neu gefundene Stationen werden vorne eingefügt.
// Dadurch steht die neueste gefundene Station oben.

function addStationToFoundHistory(station) {

    //-------------------------------------------------
    // Sicherheitsprüfung:
    // Station nicht doppelt in den Verlauf aufnehmen
    //-------------------------------------------------

    const alreadyInHistory = foundStationHistory.some(function (historyStation) {
        return historyStation.name === station.name;
    });

    if (alreadyInHistory) {
        return;
    }

    //-------------------------------------------------
    // Neue Station vorne einfügen
    //-------------------------------------------------

    foundStationHistory.unshift(station);

    //-------------------------------------------------
    // Verlauf neu anzeigen
    //-------------------------------------------------

    updateFoundHistory();
}


//-----------------------------------------------------
// VERLAUF DER GEFUNDENEN STATIONEN AKTUALISIEREN
//-----------------------------------------------------
//
// Diese Funktion baut die Liste im rechten Bereich neu auf.
// Ablauf:
// 1. HTML für alle Einträge erzeugen
// 2. HTML in die Liste schreiben
// 3. ERST DANACH nach oben scrollen,
//    damit die neueste Station sichtbar ist

function updateFoundHistory() {

    const historyList = document.getElementById("foundHistoryList");

    if (!historyList) {
        return;
    }

    //-------------------------------------------------
    // Falls noch nichts gefunden wurde
    //-------------------------------------------------

    if (foundStationHistory.length === 0) {
        historyList.innerHTML = `
            <p>Noch keine Station gefunden.</p>
        `;
        return;
    }

    //-------------------------------------------------
    // 1. Verlaufseinträge als HTML erzeugen
    //-------------------------------------------------
    //
    // .map() wandelt jede Station in einen HTML-Block um.
    // Hier wird NUR HTML erzeugt – kein Scrollen o. Ä.,
    // weil dieser Teil für jede Station einzeln läuft.

    const historyHTML = foundStationHistory.map(function (station) {

        const lineSymbolsHTML = station.lines
            .map(function (line) {
                return createLineSymbolHTML(line);
            })
            .join("");

        return `
            <div class="found-history-item">

                <div class="found-history-station-name">
                    ${station.name}
                </div>

                <div class="found-history-line-symbols">
                    ${lineSymbolsHTML}
                </div>

            </div>
        `;
    }).join("");

    //-------------------------------------------------
    // 2. Fertiges HTML in einem Schritt einfügen
    //-------------------------------------------------

    historyList.innerHTML = historyHTML;

    //-------------------------------------------------
    // 3. Nach oben scrollen
    //-------------------------------------------------
    //
    // Neue Stationen werden vorne eingefügt (unshift),
    // stehen also oben. Damit man sie sofort sieht,
    // wird die Liste ganz nach oben gescrollt –
    // genau einmal und erst, wenn der neue Inhalt drin ist.

    historyList.scrollTop = 0;
}



// Popup im Fall gefundener Station im Quizmodus

function showQuizFoundPopup(station) {

    // Falls schon ein altes Quiz-Popup offen ist, entfernen
    if (quizFoundPopup) {
        map.closePopup(quizFoundPopup);
    }

    quizFoundPopup = L.popup({
        closeButton: false,
        closeOnClick: false,
        autoClose: false,

        // Wichtig:
        // verhindert, dass Leaflet die Karte automatisch verschiebt
        // und dadurch das Popup sofort wieder geschlossen wird
        autoPan: false
    })
        .setLatLng([station.lat, station.lng])
        .setContent(station.name)
        .openOn(map);
}

function showNormalSearchPopup(station) {

    // Falls schon ein altes Such-Popup offen ist,
    // wird es zuerst entfernt.
    if (normalSearchPopup) {
        map.closePopup(normalSearchPopup);
    }

    normalSearchPopup = L.popup({
        closeButton: false,
        closeOnClick: false,
        autoClose: false,

        // Wichtig:
        // Die Karte soll nicht automatisch verschoben werden,
        // nur weil das Popup geöffnet wird.
        // Sonst könnte die Bewegungs-Logik das Popup sofort wieder schließen.
        autoPan: false
    })
        .setLatLng([station.lat, station.lng])
        .setContent(station.name)
        .openOn(map);
}


//=====================================================
// 🎉 ANIMATION: LINIE VOLLSTÄNDIG ERRATEN
//=====================================================
//
// Ablauf, wenn die letzte Station einer Linie erraten wird:
// 1. Kurz warten, damit man das Popup der Station sieht
// 2. Karte fliegt so, dass die ganze Linie sichtbar ist
// 3. Ein Lichtpuls läuft einmal die Strecke entlang
//
// Das Häkchen am Fortschrittskreis kommt über updateProgress().


//-----------------------------------------------------
// EINSTELLUNGEN
//-----------------------------------------------------

// Wartezeit, bevor die Karte losfliegt (ms).
// Solange bleibt das Popup mit dem Stationsnamen sichtbar.
const CELEBRATION_DELAY_MS = 1200;

// Dauer des Kartenflugs zur ganzen Linie (Sekunden)
const CELEBRATION_FLY_SECONDS = 1;

// Wie lange der Lichtpuls für die Strecke braucht (ms)
const LINE_PULSE_DURATION_MS = 1600;


//-----------------------------------------------------
// WELCHE LINIEN WURDEN GERADE FERTIG?
//-----------------------------------------------------
//
// Prüft für alle Linien der gerade erratenen Station:
// - Sind jetzt ALLE Stationen der Linie entdeckt?
// - Wurde die Linie vorher noch nicht gefeiert?
//
// WICHTIG: Muss VOR updateProgress() aufgerufen werden,
// weil updateProgress() die Linie in completedLineAnimations
// einträgt – danach würde sie hier nicht mehr als "neu" gelten.

function getNewlyCompletedLines(station) {

    return station.lines.filter(function (line) {

        // Schon gefeiert → nicht noch einmal
        if (completedLineAnimations.has(line)) {
            return false;
        }

        const stationsOfLine = stationsByLine.get(line) || [];

        // every() = true, wenn ALLE Stationen discovered sind
        return stationsOfLine.length > 0 &&
            stationsOfLine.every(function (s) {
                return s.discovered === true;
            });
    });
}


//-----------------------------------------------------
// KARTENAUSSCHNITT FÜR EINE ODER MEHRERE LINIEN
//-----------------------------------------------------
//
// Nimmt den Gleisverlauf, falls vorhanden.
// Linien ohne Gleisverlauf (z. B. S-Bahn) nutzen
// stattdessen die Koordinaten ihrer Stationen.

function getBoundsForLines(lines) {

    const points = [];

    lines.forEach(function (line) {

        const track = tramTrackPoints[line];

        if (track && track.length > 0) {
            track.forEach(function (point) {
                points.push(point);
            });
            return;
        }

        (stationsByLine.get(line) || []).forEach(function (station) {
            points.push([station.lat, station.lng]);
        });
    });

    return L.latLngBounds(points);
}


//-----------------------------------------------------
// LICHTPULS ENTLANG EINER LINIE
//-----------------------------------------------------
//
// Trick: Über die echte Linie wird eine zweite, weiße Linie
// gelegt, die nur aus EINEM kurzen Strich besteht
// (stroke-dasharray). Durch Verschieben des Strichs
// (stroke-dashoffset) wandert er von Anfang bis Ende.
// Danach wird die Hilfslinie wieder entfernt.

function playLinePulse(line) {

    const coords = tramTrackPoints[line];

    // Ohne Gleisverlauf gibt es nichts zum Entlanglaufen
    if (!coords || coords.length < 2) {
        return;
    }

    // Weiße Hilfslinie über die echte Linie legen
    const pulse = L.polyline(coords, {
        color: "#ffffff",
        weight: 7,
        opacity: 1,

        // Nicht anklickbar, soll nichts blockieren
        interactive: false,

        // CSS-Klasse für das Leuchten
        className: "line-complete-pulse"
    }).addTo(map);

    // Das echte SVG-Element der Linie
    const path = pulse.getElement();

    if (!path || !path.getTotalLength) {
        map.removeLayer(pulse);
        return;
    }

    //-------------------------------------------------
    // Strichlänge berechnen
    //-------------------------------------------------

    // Gesamtlänge der Linie in Pixeln
    const length = path.getTotalLength();

    // Länge des Lichtstreifens: höchstens 150px,
    // bei kurzen Linien ein Drittel der Gesamtlänge
    const dash = Math.min(150, length / 3);

    // Muster: "Strich, dann Lücke so lang wie die Linie"
    // → es ist immer nur EIN Strich sichtbar
    path.style.strokeDasharray = dash + " " + length;

    // Startposition: Strich liegt noch VOR dem Linienanfang
    path.style.strokeDashoffset = dash;

    // Leuchtfarbe = Linienfarbe
    path.style.setProperty("--glow-color", getLineColor(line));

    //-------------------------------------------------
    // Animation starten
    //-------------------------------------------------
    //
    // Von "vor dem Anfang" (dash) bis "hinter dem Ende" (-length)

    const animation = path.animate(
        [
            { strokeDashoffset: dash },
            { strokeDashoffset: -length }
        ],
        {
            duration: LINE_PULSE_DURATION_MS,
            easing: "ease-in-out"
        }
    );

    // Hilfslinie entfernen, sobald der Puls durch ist
    animation.onfinish = function () {
        if (map.hasLayer(pulse)) {
            map.removeLayer(pulse);
        }
    };

    // Zoomt man während des Pulses, stimmen die Pixel-
    // Längen nicht mehr → Animation sauber abbrechen
    map.once("zoomstart", function () {
        animation.cancel();

        if (map.hasLayer(pulse)) {
            map.removeLayer(pulse);
        }
    });
}


//-----------------------------------------------------
// ABSCHLUSS-ANIMATION STARTEN
//-----------------------------------------------------
//
// lines = Liste der gerade fertig gewordenen Linien
// (meist eine, an Umsteigestationen auch mehrere)

function celebrateCompletedLines(lines) {

    if (lines.length === 0) {
        return;
    }

    setTimeout(function () {

        // Inzwischen Modus gewechselt oder Quiz neu gestartet?
        // Dann nicht mehr feiern.
        if (gameMode !== "quiz") {
            return;
        }

        const stillComplete = lines.filter(function (line) {
            return completedLineAnimations.has(line);
        });

        if (stillComplete.length === 0) {
            return;
        }

        //---------------------------------------------
        // 1. Karte auf die ganze Linie fliegen
        //---------------------------------------------

        map.flyToBounds(getBoundsForLines(stillComplete), {
            padding: [50, 50],

            // Kurze Linien nicht zu nah heranzoomen
            maxZoom: 15,

            duration: CELEBRATION_FLY_SECONDS
        });

        //---------------------------------------------
        // 2. Nach dem Flug: Lichtpuls starten
        //---------------------------------------------
        //
        // Nutzer, die im System "Bewegung reduzieren"
        // eingestellt haben, bekommen keinen Puls.

        const reduceMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

        if (reduceMotion) {
            return;
        }

        setTimeout(function () {
            stillComplete.forEach(function (line) {
                playLinePulse(line);
            });
        }, CELEBRATION_FLY_SECONDS * 1000 + 100);

    }, CELEBRATION_DELAY_MS);
}


//-----------------------------------------------------
// SUCHE
//-----------------------------------------------------
//
// Funktioniert im Normalmodus und im Quizmodus.
// Im Quizmodus unterscheiden wir drei Fälle:
//
// 1. richtige neue Station
//    → Station wird aufgedeckt, Karte fliegt hin, Input wird geleert
//
// 2. falsche Eingabe
//    → Input wird geleert, rüttelt kurz,
//      rote Meldung "Falsche Eingabe" erscheint für 2 Sekunden
//
// 3. Station wurde bereits gefunden
//    → Input wird geleert,
//      grüne Meldung "Bereits gefunden" erscheint für 2 Sekunden

function searchStation() {

    const inputElement = document.getElementById("stationseingabe");

    const input = inputElement
        .value
        .trim();

    const searchResult = findMatchingStation(input);


    //-------------------------------------------------
    // FALL 1: KEINE STATION GEFUNDEN
    //-------------------------------------------------

    if (searchResult.status === "not-found") {

        // Eingabe NICHT löschen: Bei einer falschen Eingabe bleibt
        // der Text stehen, damit man einen Tippfehler direkt
        // korrigieren kann, statt alles neu zu schreiben.
        // focus() setzt den Cursor zurück ins Feld, so kann man
        // sofort weitertippen.
        inputElement.focus();

        if (gameMode === "quiz") {

            // Im Quizmodus soll eine falsche Eingabe
            // nicht das Infofeld verändern.
            // Stattdessen bekommt der Nutzer kurzes Feedback
            // direkt am Suchfeld.
            shakeSearchInput();
            showSearchFeedback("Falsche Eingabe", "error");

        } else {

            // Im Normalmodus darf die Fehlermeldung
            // klassisch im rechten Infofeld erscheinen.
            document.getElementById("info").innerHTML = `
                <h2>Keine Station gefunden</h2>
                <p>Bitte Eingabe prüfen.</p>
            `;
        }

        return;
    }


    //-------------------------------------------------
// FALL 2: MEHRERE ÄHNLICHE TREFFER
//-------------------------------------------------
//
// Die Eingabe passt ungefähr gleich gut zu mehreren Stationen
// (z. B. "Hauptbahnhof" → MA, LU und HD Hauptbahnhof).

if (searchResult.status === "ambiguous") {

    // Eingabe NICHT löschen: Bei einer nicht eindeutigen Eingabe
    // bleibt der Text stehen. So kann man ihn gezielt ergänzen,
    // z. B. "Hauptbahnhof" → "MA Hauptbahnhof".
    inputElement.focus();

    //---------------------------------------------
    // QUIZMODUS
    //---------------------------------------------
    //
    // Keine Vorschläge anzeigen, da diese
    // Stationsnamen verraten würden.
    // Stattdessen nur kurzes, neutrales Feedback
    // direkt unter dem Suchfeld.

    if (gameMode === "quiz") {
        shakeSearchInput();
        showSearchFeedback("Nicht eindeutig", "error");
        return;
    }

    //---------------------------------------------
    // NORMALMODUS
    //---------------------------------------------
    //
    // Hier dürfen Vorschläge angezeigt werden,
    // weil nichts erraten werden muss.

    const suggestions = searchResult.stations
        .map(function (station) {
            return station.name;
        })
        .join(", ");

    document.getElementById("info").innerHTML = `
        <h2>Eingabe nicht eindeutig</h2>
        <p>Meintest du vielleicht: ${suggestions}?</p>
    `;

    return;
}


    //-------------------------------------------------
    // FALL 3: STATION GEFUNDEN
    //-------------------------------------------------

    const foundStation = searchResult.station;


    //-------------------------------------------------
    // QUIZMODUS: STATION WURDE BEREITS GEFUNDEN
    //-------------------------------------------------

    if (gameMode === "quiz" && foundStation.discovered === true) {

        // Eingabefeld leeren
        inputElement.value = "";

        // Kurzes grünes Feedback anzeigen
        showSearchFeedback("Bereits gefunden", "success");

        return;
    }


    //-------------------------------------------------
    // QUIZMODUS: RICHTIGE NEUE STATION
    //-------------------------------------------------

    if (gameMode === "quiz") {

        // Station als gefunden markieren.
        // Dadurch weiß createTransitIcon() beim nächsten Marker-Update,
        // dass der Marker farbig gefüllt werden soll.
        foundStation.discovered = true;

        // Station in den Verlauf aufnehmen.
        // Die neueste gefundene Station steht oben.
        addStationToFoundHistory(foundStation);

        // Direkt zur gefundenen Station springen.
        // Keine Animation, dadurch weniger Renderaufwand als bei flyTo().
        map.setView([foundStation.lat, foundStation.lng], 15, {
            animate: false
        });

        // Nur den Marker DIESER Station einfärben,
        // statt alle Stationen durchzugehen.
        refreshStationMarker(foundStation);

        // Prüfen, ob mit dieser Station eine Linie fertig wurde.
        // Muss VOR updateProgress() passieren (siehe Funktion).
        const newlyCompletedLines = getNewlyCompletedLines(foundStation);

        // Fortschritt aktualisieren.
        updateProgress();

        // Popup SOFORT über der gefundenen Station anzeigen.
        showQuizFoundPopup(foundStation);

        // Falls eine Linie fertig wurde: Abschluss-Animation
        celebrateCompletedLines(newlyCompletedLines);

        // Eingabefeld leeren.
        inputElement.value = "";

        return;
    }


    //-------------------------------------------------
    // NORMALMODUS: STATION SUCHEN
    //-------------------------------------------------

    // Direkt zur gefundenen Station springen.
    map.setView([foundStation.lat, foundStation.lng], 13, {
        animate: false
    });

    // Informationen im rechten Sidepanel anzeigen.
    showStationInInfoPanel(foundStation);

    // Popup mit Stationsnamen über der Station anzeigen.
    showNormalSearchPopup(foundStation);

    // Eingabefeld leeren.
    inputElement.value = "";
}



//=====================================================
// SCHIENENLINIEN AKTUALISIEREN
//=====================================================
//
// Zeichnet nur die Schienenverläufe neu.

function updateRailLinesOnly() {

    lineLayer.clearLayers();

    // Gespeicherte Linien ebenfalls leeren,
    // sie werden gleich neu gezeichnet und neu eingetragen
    linePolylines.clear();

    Object.keys(tramTrackPoints).forEach(function (lineName) {
        drawTramLine(lineName);
    });
}


//=====================================================
// FAHRRADWEGE AKTUALISIEREN
//=====================================================
//
// Zeichnet nur die Fahrradwege neu.
// Wird später auch von den Fahrradweg-Filtern benutzt.

function updateBikeLayerOnly() {

    bikeLayer.clearLayers();

    drawBikeSegments();
}


//=====================================================
// MARKER AKTUALISIEREN
//=====================================================
//
// Früher: alle Marker gelöscht und neu erzeugt.
// Jetzt: nur der "entdeckt"-Zustand jedes Markers wird
// per CSS-Klasse aktualisiert. Die Marker selbst bleiben bestehen.
//
// Wird z. B. beim Moduswechsel und beim Quiz-Neustart aufgerufen.

function updateMarkersOnly() {

    tramStations.forEach(function (station) {
        refreshStationMarker(station);
    });
}


//=====================================================
// KARTEN-UPDATE KOMPLETT
//=====================================================
//
// Wird genutzt, wenn wirklich alles neu aufgebaut werden soll.

function updateMap() {

    updateRailLinesOnly();
    updateBikeLayerOnly();
    updateMarkersOnly();

    updateProgress();
}


//=====================================================
// 📊 STATIONEN PRO LINIE (VORAB BERECHNET)
//=====================================================
//
// Ordnet jeder Linie die Liste ihrer Stationen zu, z. B.:
//
//   "1"  → [Schönau, Schönauschule, ...]
//   "S1" → [Homburg Hbf, Bruchmühlbach-Miesau, ...]
//
// Wird nur EINMAL beim Laden der Seite gebaut.
// Die Fortschrittsanzeige muss dann nicht mehr bei jedem
// Update alle Stationen durchsuchen, sondern schlägt
// direkt nach: stationsByLine.get("1")
//
// Wichtig:
// Die Listen enthalten dieselben Station-Objekte wie
// tramStations. Wird eine Station auf discovered = true
// gesetzt, sieht man das also automatisch auch hier.

function buildStationsByLine() {

    const result = new Map();

    tramStations.forEach(function (station) {

        station.lines.forEach(function (line) {

            // Liste für diese Linie anlegen, falls noch nicht vorhanden
            if (!result.has(line)) {
                result.set(line, []);
            }

            // Station zur Liste der Linie hinzufügen
            result.get(line).push(station);
        });
    });

    return result;
}

// Einmalig beim Laden ausführen
const stationsByLine = buildStationsByLine();


//=====================================================
// 📊 FORTSCHRITTSANZEIGE PRO LINIE
//=====================================================
//
// Die Fortschrittskreise werden nur im Quizmodus angezeigt.
// Straßenbahn- und S-Bahn-Linien werden getrennt:
//
// 1. Überschrift "Straßenbahn" + Kreise
// 2. Zeilenumbruch
// 3. Überschrift "S-Bahn" + Kreise
//
// Performance:
// - Stationen pro Linie kommen aus stationsByLine (vorab berechnet)
// - Das gesamte HTML wird erst gesammelt und dann
//   EINMAL in den Container geschrieben

function updateProgress() {

    const container = document.getElementById("progressContainer");
    const totalContainer = document.getElementById("totalProgress");

    //-------------------------------------------------
    // Fortschritt nur im Quizmodus anzeigen
    //-------------------------------------------------

    if (gameMode !== "quiz") {
        container.innerHTML = "";
        totalContainer.innerHTML = "";
        return;
    }


    //-------------------------------------------------
    // Linien nach Typ trennen
    //-------------------------------------------------

    const tramLines = Object.keys(transitLines).filter(function (line) {
        return getLineType(line) === "tram";
    });

    const sbahnLines = Object.keys(transitLines).filter(function (line) {
        return getLineType(line) === "sbahn";
    });


    //-------------------------------------------------
    // Sammelbehälter für das HTML
    //-------------------------------------------------
    //
    // Statt bei jedem Kreis "innerHTML +=" zu machen,
    // kommen alle HTML-Stücke erst in diese Liste.
    // Am Ende wird alles mit join("") zusammengefügt
    // und in einem einzigen Schritt eingefügt.

    const htmlParts = [];


    //-------------------------------------------------
    // Zähler für den Gesamt-Kreis
    //-------------------------------------------------
    //
    // Zählt Linien-Haltepunkte: Eine Station mit 3 Linien
    // zählt hier 3-mal (wie bisher).

    let totalStationsAll = 0;
    let totalDiscoveredAll = 0;


    //-------------------------------------------------
    // Hilfsfunktion: HTML für EINEN Fortschrittskreis
    //-------------------------------------------------
    //
    // Gibt das HTML zurück, statt es direkt einzufügen.

    function renderProgressCircle(line) {

        // Stationen dieser Linie direkt nachschlagen.
        // Falls eine Linie noch keine Stationen hat → leere Liste.
        const stationsOfLine = stationsByLine.get(line) || [];

        const total = stationsOfLine.length;

        // Entdeckte Stationen zählen
        let discovered = 0;

        stationsOfLine.forEach(function (station) {
            if (station.discovered) {
                discovered++;
            }
        });

        totalStationsAll += total;
        totalDiscoveredAll += discovered;

        // Prozentwert (0 %, falls die Linie noch keine Stationen hat)
        const percent = total === 0
            ? 0
            : Math.round((discovered / total) * 100);

        const lineColor = getLineColor(line);


        //---------------------------------------------
        // Abschluss-Animation (nur einmal pro Linie)
        //---------------------------------------------
        //
        // Läuft genau in dem Moment, in dem eine Linie
        // erstmals komplett erraten ist. Keine Textmeldung.

        const lineIsComplete = total > 0 && discovered === total;

        let animationClass = "";

        if (lineIsComplete && !completedLineAnimations.has(line)) {
            animationClass = "line-complete-animation";

            // Merken, damit die Animation nicht erneut startet
            completedLineAnimations.add(line);
        }


                //---------------------------------------------
        // Dauerhaftes Häkchen für fertige Linien
        //---------------------------------------------
        //
        // Anders als die Puls-Animation (nur einmal) wird
        // das Häkchen bei JEDEM Update angezeigt, solange
        // die Linie komplett erraten ist.

        let checkHTML = "";

        if (lineIsComplete) {
            checkHTML = `
                <span class="progress-check"
                      style="--line-color: ${lineColor};">✓</span>
            `;
        }


        //---------------------------------------------
        // HTML für diesen Kreis zurückgeben
        //---------------------------------------------

        return `
            <div class="progress-line">

                <div class="progress-circle ${animationClass}"
                     style="background: conic-gradient(${lineColor} ${percent}%, #ddd ${percent}% 100%)">

                    <div class="progress-circle-inner">
                        ${createLineSymbolHTML(line)}
                    </div>

                                </div>

                ${checkHTML}

                <div class="progress-tooltip">
                    Linie ${line}: ${percent}%<br>
                    ${discovered} von ${total} Stationen gefunden
                </div>

            </div>
        `;
    }


    //-------------------------------------------------
    // 1. Straßenbahnlinien
    //-------------------------------------------------

    htmlParts.push(`<div class="progress-group-label">Straßenbahn</div>`);

    tramLines.forEach(function (line) {
        htmlParts.push(renderProgressCircle(line));
    });


    //-------------------------------------------------
    // 2. Zeilenumbruch + S-Bahn-Linien
    //-------------------------------------------------

    htmlParts.push(`
        <div class="progress-break"></div>
        <div class="progress-group-label">S-Bahn</div>
    `);

    sbahnLines.forEach(function (line) {
        htmlParts.push(renderProgressCircle(line));
    });


    //-------------------------------------------------
    // 3. Alles in EINEM Schritt einfügen
    //-------------------------------------------------

    container.innerHTML = htmlParts.join("");


    //=================================================
    // 🌍 GESAMTFORTSCHRITT
    //=================================================
    //
    // Kreis:  basiert auf Linien-Haltepunkten
    //         (Station mit 3 Linien zählt 3-mal)
    // Text:   zählt echte Stationen
    //         (jede Station nur 1-mal)

    const totalPercentNumber = totalStationsAll === 0
        ? 0
        : (totalDiscoveredAll / totalStationsAll) * 100;

    const totalPercentText = totalPercentNumber.toFixed(1);

    // Echte Stationen zählen
    const realTotalStations = tramStations.length;

    let realDiscoveredStations = 0;

    tramStations.forEach(function (station) {
        if (station.discovered === true) {
            realDiscoveredStations++;
        }
    });

    totalContainer.innerHTML = `
        <h3>Gesamtfortschritt</h3>

        <div class="progress-circle"
             style="width:80px;height:80px;
             background: conic-gradient(#2196f3 ${totalPercentNumber}%, #ddd ${totalPercentNumber}% 100%)">

            <div class="progress-circle-inner"
                 style="width:56px;height:56px;">
                ${totalPercentText}%
            </div>

        </div>

        <p>${realDiscoveredStations} von ${realTotalStations} Stationen gefunden</p>
    `;
}


//=====================================================
// EVENT: ENTER-TASTE IM SUCHFELD
//=====================================================

document
    .getElementById("stationseingabe")
    .addEventListener("keydown", function (event) {

        if (event.key === "Enter") {
            searchStation();
        }
    });



//-----------------------------------------------------
// TILE-OPTIONEN FÜR FLÜSSIGERES LADEN
//-----------------------------------------------------

const smoothTileOptions = {
    // Mehr Kacheln rund um den sichtbaren Bereich behalten
    keepBuffer: 4,

    // Neue Kacheln nicht erst nach dem Bewegen laden
    updateWhenIdle: false,

    // Kacheln während Zoomanimationen aktualisieren
    updateWhenZooming: true,

        // Wie oft (in ms) beim Verschieben neue Kacheln angefragt werden.
    // Zu kleine Werte (z. B. 50) erzeugen sehr viele Ladevorgänge
    // während der Bewegung und führen zu Ruckeln.
    // 200 ist der Leaflet-Standard und ein guter Kompromiss.
    updateInterval: 200
};


//=====================================================
// CARTO-KARTENEBENE ERZEUGEN
//=====================================================
//
// Baut eine Kachel-Ebene von CARTO mit API-Key.
//
// style:
// "light_all"      = Positron MIT Beschriftungen (Normalmodus)
// "light_nolabels" = Positron OHNE Beschriftungen (Quizmodus)

function createCartoLayer(style) {

    const url =
        "https://basemaps.cartocdn.com/rastertiles/" +
        style +
        "/{z}/{x}/{y}.png?key=" +
        CARTO_API_KEY;

    return L.tileLayer(url, {

        // Quellenangabe unten rechts – ist bei OSM/CARTO Pflicht
        attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> ' +
            '&copy; <a href="https://carto.com/attributions">CARTO</a>',

        maxZoom: 20,

        // Unsere Optionen für flüssiges Laden übernehmen
        // (keepBuffer, updateInterval usw.)
        ...smoothTileOptions
    });
}


//=====================================================
// KARTENHINTERGRUND AKTUALISIEREN
//=====================================================
//
// Wechselt den Kartenstil je nach Modus:
// - Quizmodus:  ohne Beschriftungen (keine Ortsnamen als Hilfe)
// - Normalmodus: mit Beschriftungen

function updateBaseMap() {

    // Alte Kartenebene entfernen, falls vorhanden
    if (baseMapLayer) {
        map.removeLayer(baseMapLayer);
    }

    if (gameMode === "quiz") {
        baseMapLayer = createCartoLayer("light_nolabels");
    } else {
        baseMapLayer = createCartoLayer("light_all");
    }

    baseMapLayer.addTo(map);

    // Karte ganz nach hinten legen, damit Linien,
    // Radwege und Marker darüber liegen
    baseMapLayer.bringToBack();
}


//=====================================================
// 🎮 MODUS-ANZEIGE AKTUALISIEREN
//=====================================================
//
// Es gibt drei Modi:
// - "normal": Karte erkunden, Stationsinfos, Radwege
// - "lines":  wie normal, aber das Infofeld zeigt die
//             Linienübersicht und Linien-Steckbriefe
// - "quiz":   Stationen erraten
//
// Normal und Linien teilen sich fast alles – nur der
// aktive Button und der Inhalt des Infofelds unterscheiden sich.

function updateModeUI() {

    const normalButton = document.getElementById("normalModeBtn");
    const linesButton = document.getElementById("linesModeBtn");
    const quizButton = document.getElementById("quizModeBtn");
    const restartButton = document.getElementById("restartQuizBtn");
    const searchInput = document.getElementById("stationseingabe");

    const progressContainer = document.getElementById("progressContainer");
    const totalProgress = document.getElementById("totalProgress");

    const infoPanel = document.getElementById("info");
    const foundHistoryPanel = document.getElementById("foundHistory");
    const bikeFilterPanel = document.getElementById("bikeFilterPanel");
    const stationFilterPanel = document.getElementById("stationFilterPanel");

    //-------------------------------------------------
    // Alle Buttons zurücksetzen und aktiven markieren
    //-------------------------------------------------

    normalButton.classList.toggle("active-mode", gameMode === "normal");
    linesButton.classList.toggle("active-mode", gameMode === "lines");
    quizButton.classList.toggle("active-mode", gameMode === "quiz");

    // Stationsfilter an den Modus anpassen:
    // Abdunkeln wirkt nur im Normalmodus (siehe applyStationFilter)
    applyStationFilter();


    //-------------------------------------------------
    // QUIZMODUS
    //-------------------------------------------------

    if (gameMode === "quiz") {

        document.body.classList.add("quiz-active");

        restartButton.style.display = "inline-block";

        progressContainer.style.display = "flex";
        totalProgress.style.display = "block";

        searchInput.placeholder = "Station erraten";

        infoPanel.style.display = "none";
        foundHistoryPanel.style.display = "flex";

        if (bikeFilterPanel) {
            bikeFilterPanel.style.display = "none";
        }

        // Stationsfilter im Quiz ausblenden,
        // sonst würde er Stationen verraten
        if (stationFilterPanel) {
            stationFilterPanel.style.display = "none";
        }

        updateFoundHistory();
        return;
    }


    //-------------------------------------------------
    // NORMAL- UND LINIEN-MODUS
    //-------------------------------------------------

    document.body.classList.remove("quiz-active");

    restartButton.style.display = "none";

    progressContainer.style.display = "none";
    totalProgress.style.display = "none";

    searchInput.placeholder = "Station suchen";

    infoPanel.style.display = "block";
    foundHistoryPanel.style.display = "none";

    // Radweg-Filter nur im Normalmodus,
    // im Linien-Modus braucht das Infofeld den Platz
    if (bikeFilterPanel) {
        bikeFilterPanel.style.display = gameMode === "normal" ? "block" : "none";
    }

    // Stationsfilter ebenfalls nur im Normalmodus
    if (stationFilterPanel) {
        stationFilterPanel.style.display = gameMode === "normal" ? "block" : "none";
    }
}


//=====================================================
// 🔎 STATIONSFILTER
//=====================================================
//
// Mit diesem Filter kann man Stationen nach ihren Details
// hervorheben, z. B. "alle Stationen mit 3 Bahnsteiggleisen"
// oder "alle getrennten Haltestellen mit analogem Anzeiger".
//
// So funktioniert es:
// - Im Seitenpanel gibt es pro Gruppe (Gleise, Haltestelle,
//   Anzeiger) kleine Knöpfe ("Chips") zum An- und Ausklicken.
// - Innerhalb EINER Gruppe gilt ODER:
//     "Analog" + "Digital klein" → Station hat das eine ODER das andere
// - Zwischen VERSCHIEDENEN Gruppen gilt UND:
//     "3 Gleise" + "Getrennt" → Station muss BEIDES erfüllen
// - Stationen, die nicht passen, werden auf der Karte abgedunkelt.
//   Sie bleiben aber sichtbar und anklickbar, damit man die
//   Orientierung im Netz behält.
// - Der Filter wirkt nur im Normalmodus. Im Quiz- und Linien-Modus
//   wird er ausgeblendet und die Karte sieht normal aus.
//
// Stationen mit getrennten Angaben für Tram und S-Bahn
// (details.tram / details.sbahn) zählen als Treffer, wenn
// IRGENDEIN Teil passt.


//-----------------------------------------------------
// FILTERGRUPPEN FESTLEGEN
//-----------------------------------------------------
//
// Hier wird bestimmt, welche Gruppen und Knöpfe es gibt.
// Neue Knöpfe kann man einfach in options ergänzen.
//
// id      = interner Name des Knopfs (muss in der Gruppe eindeutig sein)
// label   = Text auf dem Knopf
// matches = Prüffunktion: bekommt einen Detail-Block
//           (z. B. station.details oder station.details.tram)
//           und gibt true zurück, wenn der Block passt
//
// Der Knopf "Keine Angabe" wird automatisch an jede Gruppe angehängt
// (siehe hasAnyValue weiter unten). Damit findet man schnell
// Stationen, bei denen noch Daten fehlen.

const stationFilterGroups = [
    {
        id: "gleise",
        title: "Bahnsteiggleise",

        // Diese Schlüssel gehören zur Gruppe.
        // Wird für "Keine Angabe" gebraucht.
        keys: ["bahnsteiggleise"],

        options: [
            { id: "1", label: "1", matches: function (d) { return d.bahnsteiggleise === 1; } },
            { id: "2", label: "2", matches: function (d) { return d.bahnsteiggleise === 2; } },
            { id: "3", label: "3", matches: function (d) { return d.bahnsteiggleise === 3; } },

            // "4+" = vier oder mehr Gleise
            { id: "4plus", label: "4+", matches: function (d) { return d.bahnsteiggleise >= 4; } }
        ]
    },
    {
        id: "haltestelle",
        title: "Haltestelle",
        keys: ["getrennt", "doppelhaltestelle"],

        options: [
            { id: "getrennt", label: "Getrennt", matches: function (d) { return d.getrennt === true; } },
            { id: "doppel", label: "Doppelhaltestelle", matches: function (d) { return d.doppelhaltestelle === true; } }
        ]
    },
    {
        id: "anzeiger",
        title: "Anzeiger",
        keys: ["anzeiger"],

        // Die Knöpfe werden automatisch aus anzeigerLabels erzeugt.
        // Kommt dort eine neue Anzeigerart dazu, erscheint sie
        // hier ohne weitere Änderung.
        options: Object.keys(anzeigerLabels).map(function (key) {
            return {
                id: key,
                label: anzeigerLabels[key],
                matches: function (d) { return d.anzeiger === key; }
            };
        })
    }
];


//-----------------------------------------------------
// AKTUELL AUSGEWÄHLTE KNÖPFE
//-----------------------------------------------------
//
// Für jede Gruppe ein Set mit den ids der aktiven Knöpfe.
// Beispiel: { gleise: Set{"3"}, haltestelle: Set{}, anzeiger: Set{"analog"} }
// Am Anfang ist nichts ausgewählt → kein Filter aktiv.

const activeStationFilters = {};

stationFilterGroups.forEach(function (group) {
    activeStationFilters[group.id] = new Set();
});


//-----------------------------------------------------
// HILFSFUNKTION: ALLE DETAIL-BLÖCKE EINER STATION
//-----------------------------------------------------
//
// Gibt eine Liste aller Blöcke zurück, in denen Angaben stehen können:
// - station.details        (gemeinsame Angaben)
// - station.details.tram   (nur Straßenbahn, falls vorhanden)
// - station.details.sbahn  (nur S-Bahn, falls vorhanden)
//
// Station ohne details → leere Liste.

function getStationDetailBlocks(station) {

    const details = station.details;

    if (!details) {
        return [];
    }

    return [details, details.tram, details.sbahn].filter(function (block) {
        return block !== undefined && block !== null;
    });
}


//-----------------------------------------------------
// HILFSFUNKTION: HAT DIE STATION ÜBERHAUPT EINE ANGABE?
//-----------------------------------------------------
//
// Prüft, ob in irgendeinem Detail-Block mindestens einer
// der Schlüssel eingetragen ist.
// Wird für den Knopf "Keine Angabe" gebraucht.

function hasAnyValue(station, keys) {
    return getStationDetailBlocks(station).some(function (block) {
        return keys.some(function (key) {
            return block[key] !== undefined;
        });
    });
}


//-----------------------------------------------------
// PRÜFEN, OB EINE STATION ZU EINER GRUPPE PASST
//-----------------------------------------------------
//
// - Kein Knopf der Gruppe aktiv → Gruppe filtert nicht, also true
// - Sonst: true, wenn MINDESTENS EIN aktiver Knopf passt (ODER)

function stationMatchesGroup(station, group) {

    const selected = activeStationFilters[group.id];

    // Gruppe nicht benutzt → alles erlaubt
    if (selected.size === 0) {
        return true;
    }

    const blocks = getStationDetailBlocks(station);

    // "Keine Angabe" ausgewählt und die Station hat wirklich keine?
    if (selected.has("none") && !hasAnyValue(station, group.keys)) {
        return true;
    }

    // Passt irgendein ausgewählter Knopf zu irgendeinem Block?
    return group.options.some(function (option) {

        if (!selected.has(option.id)) {
            return false;
        }

        return blocks.some(function (block) {
            return option.matches(block);
        });
    });
}


//-----------------------------------------------------
// PRÜFEN, OB EINE STATION ALLE GRUPPEN ERFÜLLT
//-----------------------------------------------------
//
// UND-Verknüpfung: Die Station muss in JEDER Gruppe passen.

function stationMatchesFilter(station) {
    return stationFilterGroups.every(function (group) {
        return stationMatchesGroup(station, group);
    });
}


//-----------------------------------------------------
// IST ÜBERHAUPT EIN FILTER AKTIV?
//-----------------------------------------------------

function isStationFilterActive() {
    return stationFilterGroups.some(function (group) {
        return activeStationFilters[group.id].size > 0;
    });
}


//-----------------------------------------------------
// FILTER AUF DIE KARTE ANWENDEN
//-----------------------------------------------------
//
// Setzt an jedem Marker die CSS-Klasse "filter-dimmed",
// wenn die Station NICHT passt.
//
// Zusätzlich bekommt der Kartencontainer die Klasse
// "station-filter-active". Nur wenn diese gesetzt ist, wirkt das
// Abdunkeln (siehe style.css). So schaltet der Moduswechsel das
// Abdunkeln an und aus, ohne dass alle Marker angefasst werden.
//
// Wie bei "discovered" wird nur eine Klasse geändert,
// kein Marker neu gebaut → sehr schnell.

function applyStationFilter() {

    const container = map.getContainer();

    // Abdunkeln nur im Normalmodus und nur bei aktivem Filter
    const filterVisible = gameMode === "normal" && isStationFilterActive();

    container.classList.toggle("station-filter-active", filterVisible);

    // Treffer zählen (für die Anzeige im Filterpanel)
    let matchCount = 0;

    stationMarkers.forEach(function (marker, station) {

        const matches = stationMatchesFilter(station);

        if (matches) {
            matchCount++;
        }

        const element = marker.getElement();

        if (element) {
            element.classList.toggle("filter-dimmed", !matches);
        }
    });

    updateStationFilterInfo(matchCount);
}


//-----------------------------------------------------
// HINWEISTEXT UNTER DEN KNÖPFEN
//-----------------------------------------------------
//
// Zeigt an:
// - wie viele Stationen überhaupt Detailangaben haben
// - bei aktivem Filter zusätzlich die Anzahl der Treffer
//
// Beispiel: "12 Treffer · Angaben für 111 von 453 Stationen"

function updateStationFilterInfo(matchCount) {

    const infoElement = document.getElementById("stationFilterInfo");

    if (!infoElement) {
        return;
    }

    // Stationen mit mindestens einem Detail-Block
    const withDetails = tramStations.filter(function (station) {
        return getStationDetailBlocks(station).length > 0;
    }).length;

    const coverageText = `Angaben für ${withDetails} von ${tramStations.length} Stationen`;

    if (isStationFilterActive()) {
        infoElement.innerHTML = `<strong>${matchCount} Treffer</strong> · ${coverageText}`;
    } else {
        infoElement.textContent = coverageText;
    }

    //-------------------------------------------------
    // Zähler in der Überschrift
    //-------------------------------------------------
    //
    // Zeigt z. B. "2 aktiv" neben "Stationsfilter".
    // Wichtig, wenn das Panel eingeklappt ist: Dann sieht man
    // trotzdem, dass ein Filter die Karte gerade abdunkelt.

    const header = document.querySelector("#stationFilterPanel h3");

    if (header) {

        // Anzahl aller ausgewählten Knöpfe über alle Gruppen
        let selectedCount = 0;
        stationFilterGroups.forEach(function (group) {
            selectedCount += activeStationFilters[group.id].size;
        });

        // Vorhandenen Zähler suchen oder neu anlegen
        let badge = header.querySelector(".panel-badge");

        if (!badge) {
            badge = document.createElement("span");
            badge.className = "panel-badge";

            // Vor dem Pfeil einfügen (falls schon vorhanden)
            header.insertBefore(badge, header.querySelector(".collapse-arrow"));
        }

        badge.textContent = selectedCount + " aktiv";
        badge.style.display = selectedCount > 0 ? "inline-block" : "none";
    }

    // Zurücksetzen-Knopf nur zeigen, wenn etwas ausgewählt ist
    const resetButton = document.getElementById("stationFilterReset");

    if (resetButton) {
        resetButton.style.display = isStationFilterActive() ? "inline-block" : "none";
    }
}


//-----------------------------------------------------
// EINEN KNOPF AN- ODER AUSSCHALTEN
//-----------------------------------------------------

function toggleStationFilter(groupId, optionId) {

    const selected = activeStationFilters[groupId];

    if (selected.has(optionId)) {
        selected.delete(optionId);
    } else {
        selected.add(optionId);
    }

    renderStationFilterPanel();
    applyStationFilter();
}


//-----------------------------------------------------
// ALLE FILTER ZURÜCKSETZEN
//-----------------------------------------------------

function resetStationFilter() {

    stationFilterGroups.forEach(function (group) {
        activeStationFilters[group.id].clear();
    });

    renderStationFilterPanel();
    applyStationFilter();
}


//-----------------------------------------------------
// FILTERPANEL AUFBAUEN
//-----------------------------------------------------
//
// Erzeugt pro Gruppe eine Überschrift und die Knöpfe.
// Aktive Knöpfe bekommen die Klasse "active".
// Wird bei jedem Klick neu aufgebaut. Das sind nur
// ein paar Knöpfe, das geht sehr schnell.

function renderStationFilterPanel() {

    const container = document.getElementById("stationFilterGroups");

    if (!container) {
        return;
    }

    container.innerHTML = stationFilterGroups.map(function (group) {

        const selected = activeStationFilters[group.id];

        // Normale Knöpfe + automatisch "Keine Angabe" am Ende
        const allOptions = group.options.concat([
            { id: "none", label: "Keine Angabe" }
        ]);

        const chipsHTML = allOptions.map(function (option) {

            const activeClass = selected.has(option.id) ? "active" : "";

            // "Keine Angabe" bekommt eine eigene Klasse,
            // damit er etwas zurückhaltender aussieht
            const noneClass = option.id === "none" ? "filter-chip-none" : "";

            // data-group / data-option merken sich, welcher Knopf
            // das ist. Der Klick-Handler unten liest sie aus.
            return `
                <button type="button"
                        class="filter-chip ${activeClass} ${noneClass}"
                        data-group="${group.id}"
                        data-option="${option.id}">
                    ${option.label}
                </button>
            `;
        }).join("");

        return `
            <div class="filter-group">
                <div class="filter-group-title">${group.title}</div>
                <div class="filter-chips">${chipsHTML}</div>
            </div>
        `;
    }).join("");
}


//-----------------------------------------------------
// KLICKS IM FILTERPANEL VERARBEITEN
//-----------------------------------------------------
//
// Statt jedem Knopf einen eigenen Klick-Handler zu geben,
// hört EIN Handler auf das ganze Panel ("Event Delegation").
// Vorteil: Funktioniert auch nach jedem Neuaufbau der Knöpfe.

function setupStationFilterPanel() {

    const panel = document.getElementById("stationFilterPanel");

    if (!panel) {
        return;
    }

    panel.addEventListener("click", function (event) {

        // Zurücksetzen-Knopf?
        if (event.target.closest("#stationFilterReset")) {
            resetStationFilter();
            return;
        }

        // Filter-Knopf? closest() findet den Knopf auch,
        // wenn genau auf den Text geklickt wurde.
        const chip = event.target.closest(".filter-chip");

        if (!chip) {
            return;
        }

        toggleStationFilter(chip.dataset.group, chip.dataset.option);
    });

    // Knöpfe zum ersten Mal anzeigen
    renderStationFilterPanel();
}


//=====================================================
// 📂 EINKLAPPBARE PANELS
//=====================================================
//
// Macht ein Panel im Seitenpanel (z. B. Radweg-Filter oder
// Stationsfilter) per Klick auf seine Überschrift einklappbar.
//
// Eingeklappt bleibt nur eine schmale Leiste mit der Überschrift
// und einem kleinen Pfeil stehen. Alles andere wird per CSS
// versteckt (Klasse "collapsed", siehe style.css).
//
// Am HTML muss dafür nichts geändert werden: Die Funktion nimmt
// einfach die erste <h3> des Panels als Kopfzeile.
//
// Der Zustand (auf/zu) wird im Browser gespeichert (localStorage),
// damit das Panel beim nächsten Laden genauso aussieht.


//-----------------------------------------------------
// GESPEICHERTEN ZUSTAND LESEN / SCHREIBEN
//-----------------------------------------------------
//
// try/catch: In manchen Browsern (z. B. privates Fenster)
// ist localStorage gesperrt. Dann klappt das Einklappen
// trotzdem, es wird nur nicht gespeichert.

function loadPanelCollapsed(panelId) {
    try {
        return localStorage.getItem("collapsed_" + panelId) === "true";
    } catch (error) {
        return false;
    }
}

function savePanelCollapsed(panelId, collapsed) {
    try {
        localStorage.setItem("collapsed_" + panelId, collapsed ? "true" : "false");
    } catch (error) {
        // Speichern nicht möglich → einfach ignorieren
    }
}


//-----------------------------------------------------
// PANEL EINKLAPPBAR MACHEN
//-----------------------------------------------------

function makePanelCollapsible(panelId) {

    const panel = document.getElementById(panelId);

    if (!panel) {
        return;
    }

    // Erste Überschrift des Panels wird zur Kopfzeile
    const header = panel.querySelector("h3");

    if (!header) {
        return;
    }

    panel.classList.add("collapsible-panel");
    header.classList.add("collapsible-header");

    // Kleiner Pfeil rechts in der Kopfzeile.
    // Er wird per CSS gedreht, wenn das Panel eingeklappt ist.
    header.insertAdjacentHTML("beforeend", `
        <span class="collapse-arrow" aria-hidden="true">▾</span>
    `);

    // Barrierefreiheit: Die Überschrift verhält sich wie ein Knopf
    // (mit Tab erreichbar, Screenreader sagen "aufgeklappt/zugeklappt")
    header.setAttribute("role", "button");
    header.setAttribute("tabindex", "0");


    //-------------------------------------------------
    // Auf- oder zuklappen
    //-------------------------------------------------

    function setCollapsed(collapsed) {
        panel.classList.toggle("collapsed", collapsed);
        header.setAttribute("aria-expanded", collapsed ? "false" : "true");
        savePanelCollapsed(panelId, collapsed);
    }

    // Startzustand: so wie beim letzten Besuch
    setCollapsed(loadPanelCollapsed(panelId));

    // Klick auf die Überschrift
    header.addEventListener("click", function () {
        setCollapsed(!panel.classList.contains("collapsed"));
    });

    // Tastatur: Enter oder Leertaste wie ein Klick
    header.addEventListener("keydown", function (event) {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            header.click();
        }
    });
}


//=====================================================
// 🎮 MODUS WECHSEL
//=====================================================

// Normalmodus:
// Karte mit Beschriftungen.
// Stationen dürfen mit Namen und Details angezeigt werden.
function setNormalMode() {
    gameMode = "normal";

    updateBaseMap();
    updateModeUI();
    updateMap();
}


// Quizmodus:
// Karte ohne Beschriftungen.
// Ungelöste Stationen bleiben anonym.
function setQuizMode() {
    gameMode = "quiz";

    updateBaseMap();
    updateModeUI();
    updateMap();
}

// Linien-Modus:
// Karte mit Beschriftungen, Infofeld zeigt die Linienübersicht.
function setLinesMode() {
    gameMode = "lines";

    updateBaseMap();
    updateModeUI();
    updateMap();

    showLineOverview();
}


//=====================================================
// 🔁 QUIZ NEUSTART
//=====================================================
//
// Setzt alle Stationen wieder auf "nicht erraten".
// Der Nutzer bleibt dabei im Quizmodus.

function restartQuiz() {

    // Sicherheit:
    // Ein Neustart soll immer im Quizmodus stattfinden.
    gameMode = "quiz";

    // Karte ohne Beschriftungen anzeigen
    updateBaseMap();

    // Alle Stationen wieder ungelöst machen
    tramStations.forEach(function (station) {
        station.discovered = false;
    });

    // Verlauf der gefundenen Stationen leeren
foundStationHistory.length = 0;

    // Gespeicherte Abschluss-Animationen zurücksetzen.
    // completedLineAnimations merkt sich, welche Linien bereits
    // einmal pulsiert haben. Ohne dieses Leeren würde nach einem
    // Neustart keine Linie mehr pulsieren, weil das Programm
    // glaubt, die Animation sei schon gelaufen.
    completedLineAnimations.clear();

// Verlauf im rechten Bereich aktualisieren
updateFoundHistory();

    // Oberfläche passend zum Quizmodus aktualisieren
    updateModeUI();

    // Infofeld zurücksetzen
    document.getElementById("info").innerHTML = `
        <h2>Quiz neu gestartet</h2>
        <p>Gib eine Station in das Suchfeld ein.</p>
    `;

    // Karte und Fortschritt neu zeichnen
    updateMap();
}


//=====================================================
// PROGRAMM START
//=====================================================
//
// Beim Laden der Seite wird zuerst die Modus-Anzeige gesetzt.
// Danach wird die Karte aufgebaut.

updateBaseMap();
updateModeUI();

// Stationsmarker einmalig erzeugen.
// Muss VOR updateMap() passieren, weil updateMap()
// die Marker nur noch aktualisiert, nicht mehr erzeugt.
createAllStationMarkers();

// Startgröße der Marker passend zum aktuellen Zoom setzen
updateMarkerSize();

updateMap();
updateBikeFilterButtons();

// Stationsfilter: Knöpfe aufbauen, Klicks aktivieren
// und den Hinweistext ("Angaben für … Stationen") setzen.
// Muss NACH createAllStationMarkers() stehen,
// weil der Filter die Marker braucht.
setupStationFilterPanel();

// Radweg-Filter und Stationsfilter per Klick auf die
// Überschrift einklappbar machen (siehe makePanelCollapsible).
// Muss VOR applyStationFilter() stehen, damit der Zähler
// "x aktiv" links vom Pfeil einsortiert wird.
makePanelCollapsible("bikeFilterPanel");
makePanelCollapsible("stationFilterPanel");

applyStationFilter();


//-----------------------------------------------------
// MARKERGRÖSSE BEI ZOOM ANPASSEN
//-----------------------------------------------------
//
// Nach jedem Zoom wird nur die CSS-Variable für die
// Markergröße angepasst. Kein Marker wird neu erzeugt.

map.on("zoomend", function () {
    updateMarkerSize();
});

//-----------------------------------------------------
// STATIONS-POPUPS BEI KARTENBEWEGUNG SCHLIESSEN
//-----------------------------------------------------
//
// Popups, die nach einer richtigen Quiz-Antwort oder nach einer Suche
// angezeigt werden, bleiben sichtbar.
//
// Erst wenn die Karte verschoben oder gezoomt wird,
// werden sie geschlossen.

map.on("movestart zoomstart", function () {

    if (quizFoundPopup) {
        map.closePopup(quizFoundPopup);
        quizFoundPopup = null;
    }

    if (normalSearchPopup) {
        map.closePopup(normalSearchPopup);
        normalSearchPopup = null;
    }
});


document
    .getElementById("normalModeBtn")
    .addEventListener("click", setNormalMode);

document
    .getElementById("quizModeBtn")
    .addEventListener("click", setQuizMode);

document
    .getElementById("restartQuizBtn")
    .addEventListener("click", restartQuiz);

    document
    .getElementById("linesModeBtn")
    .addEventListener("click", setLinesMode);


//-----------------------------------------------------
// KLICKS IM INFOFELD
//-----------------------------------------------------
//
// Ein einziger Klick-Handler für das ganze Infofeld
// ("Event Delegation"). Weil der Inhalt ständig neu
// geschrieben wird, ist das einfacher, als jedem Symbol
// einzeln einen Handler zu geben.
//
// - Klick auf ein Liniensymbol → Linien-Steckbrief
// - Klick auf "← Alle Linien"  → Linienübersicht

document
    .getElementById("info")
    .addEventListener("click", function (event) {

        // Im Quiz keine Steckbriefe (Infofeld ist dort ohnehin aus)
        if (gameMode === "quiz") {
            return;
        }

        // closest() sucht vom geklickten Element aufwärts
        // nach dem nächsten passenden Eltern-Element
        const backButton = event.target.closest(".line-back-button");

        if (backButton) {
            showLineOverview();
            return;
        }

        const symbol = event.target.closest(".line-symbol[data-line]");

        if (symbol) {
            showLineInInfoPanel(symbol.dataset.line);
        }
    });


    //=====================================================
// 📖 ALMANACH
//=====================================================
//
// Info-Fenster mit frei schreibbaren Texten aus
// data/almanach.js. Öffnet sich über den Button
// "📖 Almanach" – in jedem Modus.
//
// Schließen über:
// - den ✕-Button
// - Klick neben das Fenster (auf den dunklen Hintergrund)
// - die Escape-Taste


//-----------------------------------------------------
// EINFACHEN TEXT IN HTML UMWANDELN
//-----------------------------------------------------
//
// Erlaubt im Almanach-Text:
// - Leerzeile      → neuer Absatz
// - "- " am Anfang → Aufzählungspunkt
// - **Wort**       → fett
//
// Zuerst werden < und > unschädlich gemacht, damit
// versehentlich getippte Zeichen nicht als HTML gelesen werden.

function formatAlmanachText(text) {

    // Sonderzeichen absichern
    const safeText = text
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;");

    // Text in Blöcke aufteilen (getrennt durch Leerzeilen)
    const blocks = safeText
        .trim()
        .split(/\n\s*\n/);

    const html = blocks.map(function (block) {

        // Zeilen des Blocks, ohne Leerraum am Rand
        const lines = block
            .split("\n")
            .map(function (line) {
                return line.trim();
            })
            .filter(function (line) {
                return line !== "";
            });

        // Beginnen ALLE Zeilen mit "- "? → Aufzählung
        const isList = lines.every(function (line) {
            return line.startsWith("- ");
        });

        if (isList) {
            const items = lines.map(function (line) {
                return `<li>${line.slice(2)}</li>`;
            }).join("");

            return `<ul>${items}</ul>`;
        }

        // Sonst: normaler Absatz (Zeilen zusammenfügen)
        return `<p>${lines.join(" ")}</p>`;

    }).join("");

    // **fett** umwandeln
    return html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
}


//-----------------------------------------------------
// ALMANACH-INHALT AUFBAUEN
//-----------------------------------------------------
//
// Jeder Abschnitt wird ein <details>-Element:
// ein im Browser eingebauter aufklappbarer Bereich.
// Dafür ist kein eigenes JavaScript zum Auf-/Zuklappen nötig.

function renderAlmanach() {

    const container = document.getElementById("almanachContent");

    container.innerHTML = almanachSections.map(function (section) {

        // "open" sorgt dafür, dass der Abschnitt aufgeklappt startet
        const openAttribute = section.offen ? "open" : "";

        return `
            <details class="almanach-section" ${openAttribute}>
                <summary>${section.titel}</summary>
                <div class="almanach-text">
                    ${formatAlmanachText(section.text)}
                </div>
            </details>
        `;
    }).join("");
}


//-----------------------------------------------------
// ÖFFNEN UND SCHLIESSEN
//-----------------------------------------------------

function openAlmanach() {
    document.getElementById("almanachOverlay").hidden = false;
}

function closeAlmanach() {
    document.getElementById("almanachOverlay").hidden = true;
}


//-----------------------------------------------------
// ALMANACH EINRICHTEN
//-----------------------------------------------------
//
// Inhalt einmal beim Laden aufbauen
// und alle Schließen-Möglichkeiten verbinden.

renderAlmanach();

document
    .getElementById("almanachBtn")
    .addEventListener("click", openAlmanach);

document
    .getElementById("almanachCloseBtn")
    .addEventListener("click", closeAlmanach);

// Klick auf den dunklen Hintergrund schließt –
// aber NICHT ein Klick ins Fenster selbst
document
    .getElementById("almanachOverlay")
    .addEventListener("click", function (event) {
        if (event.target.id === "almanachOverlay") {
            closeAlmanach();
        }
    });

// Escape-Taste schließt
document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
        closeAlmanach();
    }
});