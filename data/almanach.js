//=====================================================
// 📖 ALMANACH
//=====================================================
//
// Inhalt des Info-Fensters (Button "📖 Almanach").
//
// Jeder Abschnitt hat:
// - titel = Überschrift des aufklappbaren Bereichs
// - text  = Inhalt (zwischen den ` ` Zeichen)
// - offen = optional: true → Abschnitt ist beim Öffnen
//           schon aufgeklappt
//
// Einfache Formatierung im Text:
// - Leerzeile           → neuer Absatz
// - Zeile mit "- "      → Aufzählungspunkt
// - **Wort**            → fett
//
// Neue Abschnitte einfach unten anhängen.
// Wird in index.html VOR script.js geladen.

const almanachSections = [

    {
        titel: "Über diese Karte",
        offen: true,
        text: `
Diese Karte zeigt die Straßenbahn- und S-Bahn-Linien sowie die Radwege im Rhein-Neckar-Gebiet.

Klicke auf eine Station, um ihren Steckbrief zu sehen. Über den Button **Linien** findest du die Steckbriefe aller Linien.
        `
    },

    {
        titel: "Wie genau sind die Angaben?",
        text: `
Streckenlängen und Haltestellenabstände werden aus den eingezeichneten Gleisverläufen berechnet.

- Streckenlängen sind auf 0,1 km gerundet.
- Haltestellenabstände der Straßenbahn sind auf 10 m gerundet, bei der S-Bahn auf 0,1 km.
- Kurven werden durch einzelne Punkte angenähert, daher liegen die Werte meist 1–2 % unter der tatsächlichen Länge.
        `
    },

    {
        titel: "Quiz: Regeln",
        text: `
Errate so viele Stationen wie möglich, indem du ihren Namen in das Suchfeld eingibst.

- Richtig erratene Stationen werden auf der Karte farbig.
- Kleine Tippfehler werden bei längeren Namen akzeptiert.
- Ist eine Linie komplett erraten, leuchtet sie kurz auf.
        `
    },

    {
        titel: "Quiz: Tipps",
        text: `
- Abkürzungen funktionieren: **MA**, **LU**, **HD**, **Hbf**, **Bf**.
- Fahre gedanklich eine Linie ab, Station für Station.
- Fahre mit der Maus über einen leeren Marker: Er verrät nicht den Namen, aber du siehst, wo noch Stationen fehlen.
        `
    }

];
