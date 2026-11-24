# PROJEKT-MASTERFILE – KEHRWERK
Gilt zusätzlich zur globalen Masterfile (~/.claude/CLAUDE.md).

## 1. Ziel und Endprodukt
Interaktive Demo-Website für einen erfundenen Schornsteinfeger-Meisterbetrieb (KEHRWERK Schornsteinfegerei). Musterbeispiel für Akquise (PROJEKT EX), nächste Branche nach Elektro (LICHTBOGEN), Maler (FARBKANTE), Heizung (WARMHERZ).
Probleme, die die Seite löst:
- Nachwuchs/Fachkräfte → eigenes Recruiting-Kapitel (Film + Bewerbung in 60 Sekunden)
- Termin-Chaos (Kunde nicht da, Telefon, Terminzettel) → Wunsch-Zeitfenster online, „Wir klingeln nur, wenn Sie da sind“
- Kunde weiß nicht, was Pflicht ist → interaktiver Haus-/Heizungs-Check (Kaminofen, Gas, Öl, Pellets, Wärmepumpe)
- Wettbewerb seit Liberalisierung → Vertrauen: Ablauf sichtbar, Bewertungen, Meisterbetrieb
- Neue Geschäftsfelder (Energieberatung, Heizungstausch-Beratung, CO-Melder, Wärmebild) → eigene Kapitel
- Dokumentation → digitaler Feuerstätten-Pass

## 2. Qualitätsanspruch & Referenzen
- Aufbau wie FLUTLICHT27 (Film-Kapitel ↔ Motion Design mit Übergängen), Niveau wie FARBKANTE/LICHTBOGEN: 4K-Fotolook, cinematic, alles bewegt/anklickbar.
- Leitmotiv eindeutig Schornsteinfeger, aber modern und ohne Klischee (Eugen 23.11.2026: „Klischeekacke“): Dach + Leiter mit Absturzsicherung, Kehrbürste, Schachtkamera, Abgasmessgerät, digitales Protokoll, Ruß. Moderne schwarze Arbeitskleidung (Softshell, Knieschutz, rotes Sicherungsgeschirr). NIE Zylinder, Messingknöpfe, Kluft, Glücksbringer, Kleeblatt, Schwein, „Glück“-Sprüche.

## 3. Regeln für dieses Projekt
- Keine echten Firmen, keine Preise/Euro, kein Wort „KI“, keine Rechtsaussagen (keine Kehr-Intervalle/Pflicht-Zahlen nennen).
- Demo-Hinweis oben, Formulare senden nichts, persönlicher Link per `?firma=Name`.
- ATTRAKTIV STATT STANDARD (Eugen 23.11.2026, Mix A „scheiße langweilig“): Kein normales Website-Raster mit Doku-Fotos. Kampagnen-Look (Nike/Apple): Riesentypo, mit der Menschen/Objekte interagieren, dramatisches Licht, Partikel, Bewegung, jede Szene eine andere Komposition.
- Bewertungen: erfundene Firma → nur als sichtbar markierte Beispiel-Karten, keine Noten erfinden.
- Mobil-Prüfung in 4 Größen + Kopfzeile 1081–1600 px vor jeder Lieferung.

## 4. Skills, Plugins, Agenten, MCP
Keine zusätzlichen nötig.

## 5. Zugänge
gh (Engelstraenen), sjinn in Chrome eingeloggt (Unlimited).

## 6. Workflow & Freigabepunkte
3 Storyboards (Eugen wählt/mischt) → First Frames 4K → Video-Drafts gratis → Seite bauen → Storyboard-Abgleich → GitHub Pages.

## 7. Befehle
- Vorschau: `cd site && python3 -m http.server 4472` (Port 4472 = KEHRWERK, vorher `<title>` prüfen)
- Assets: `zsh tools/assets.sh` (frames/KS-*.png -> WebP 2560/1600, Filme -> Scrub-MP4, Manifest)
- Prüfen: `python3 tools/shots.py http://localhost:4472/ <ordner>` (5 Viewports + Kopfzeile)
- Bilder: Dreamina-Tab, `tools/ks_queue.js` per Datei-Eingang einspielen, `KSQ.run()`; Download: `KSQ.armCopy()` + Klick oben, dann `tools/ks_fetch.sh`
- Deploy: `zsh tools/deploy.sh "Text"` (gh-pages, legacy)

## 8. Offene Fragen
- Wahl Storyboard 1 „Durch den Schacht“, 2 „Über den Dächern“, 3 „Messwert“ (konzepte/).

## 9. Entschieden
- 23.11.2026: Name KEHRWERK (Annahme), 3 Storyboard-Varianten erzeugt (Prompts konzepte/prompts.md).
- 23.11.2026: Eugen wählt Mix 2 + 1, aber ohne Klischee. Neu: KWMIX-A (dunkel, Glut-Orange) und KWMIX-B (hell, Signal-Orange), gleicher Ablauf: Vorher-Dach → Aufstieg gesichert → Kehren → Schachtkamera → Messen im Heizungskeller → Erledigt + Protokoll → Haus-Check → Recruiting → Handy (Termin + Bewerbung).

- 24.11.2026: Eugen wählt Storyboard 1 „Rauchzeichen“ (Fallback 3 Rooftop Crew). Farbwelt Ruß #0f0e0d + Signalrot #ff3b30 (Schwarz+Glut-Orange gesperrt, FEUERRAUM). Prompts: konzepte/prompts-frames.md.
- 24.11.2026: Startbilder 2K auf Dreamina (GPT Image 2.5 Sunburst, Unlimited), Videos Dreamina Seedance 2.5 720P Unlimited (First and last frames, nur Startbild). Dreamina: 1 Gratis-Auftrag gleichzeitig kontoweit je Art (Bild/Video), Wächter `KWD` (Bild-Tab) und `KWVW.fire(tag)` (Video-Tab). Chrome blockt nach einigen Downloads weitere → Original-Link per Klick-Handler in die Zwischenablage, dann `curl "$(pbpaste)"` (scratchpad clipdl.sh).

- 24.11.2026 (abends): NEUAUFBAU „Schachtkamera-Fahrt“ (Masterfile V2.53): ganze Seite = Kamerafahrt durch den Schornstein, WebGL-Schacht (three.js) zwischen fotorealistischen Stationen, HUD (Tiefe/Messwerte/REC/Protokoll) = Navigation. Stationen 0 Dach · Einfahrt (KWV-2 rückwärts) · 01 Reinigung · 02 Inspektion · 03 Messung · 04 CO · 05 Energie (Wärmebild-Wischer) · 06 Team (Funkspruch-Bewerbung) · 07 Protokoll + Bewertungs-Beispiele als Prüfmarken · 08 Ofen + Termin (KWV-1). Storyboard konzepte/7-schachtkamera.png freigegeben.
- 24.11.2026: Lichtrichtung immer ausdrücklich in den Prompt (Eugen: LED der Schachtkamera muss NACH UNTEN in den Schacht leuchten, nicht hoch zur Kamera) → KS-1B neu.
- 24.11.2026 (Masterfile V2.59): Fotos/Videos nur kostenlos (Unlimited, 0 Credits), kein MiniMax-2K-Endrender. Erst nach Eugens Gesamtfreigabe: freigegebene 720P-Videos hochskalieren/prüfen, sonst nur diese neu in 2K/4K auf Dreamina Seedance 2.5 – alles mit Credits nur nach OK mit live gelesenem Preis.
- Offen: Firmenname ohne „-WERK“ (Masterfile V2.53), Vorschläge bei Lieferung.

## 10. Ablage
frames/ (Startbilder 2560×1440, KS-* = Schachtkamera-Motive), videos/ (Drafts), vorschau/ (für den Chat)
Code: Dropbox/CLAUDE/Projekte/KEHRWERK · Storyboards: konzepte/
