# KEHRWERK · Haus im Schnitt – Übergangs-Drehbuch (Masterfile V2.66)
Eine durchgehende Geschichte: der gelbe Leuchtpunkt (LED der Schachtkamera) ist der rote Faden. Jeder Wechsel = sichtbare Verwandlung, kein Schnitt.

| # | von → nach | Element A | Bewegung | Element B | verbindendes Bild/Video |
|---|---|---|---|---|---|
| 1 | Start → Kehren | Leuchtpunkt am Schornsteinkopf (H-1) | Zoom in den Schornsteinkopf, Punkt wird zur LED im Schacht | Kehrbürste kommt aus der Tiefe (H-2) | H-1 Zoom → H-2 (Punkt = LED-Lichtkegel) |
| 2 | Kehren → Inspektion | Rußpartikel um die Bürste | Partikel wirbeln zur Kamera, werden zu gelben Linien, Zoom zurück | Linie wächst als Callout zum Riss am Dachboden (H-3 im Callout) | Code-Partikel → SVG-Linie über H-1 |
| 3 | Inspektion → Messung | Callout-Foto | schrumpft zurück in den Punkt, Punkt fährt mit Leuchtspur in den Keller | Punkt = Spitze des Messfühlers im Abgasrohr, Zoom auf H-4 | Spur (stroke-dashoffset) + Zoom |
| 4 | Messung → CO | Messkurve, die der Punkt zeichnet | Kurve steigt (CO-Wert), läuft als Linie durchs Haus nach oben ins Wohnzimmer | Kurve schließt sich zum Ring um den CO-Melder (H-5) | SVG-Pfad morpht zu Ellipse |
| 5 | CO → Wärmebild | gelber Ring | Ring weitet sich übers Bild, Zoom raus, wird zur Scanlinie | Scanlinie wischt übers Haus → Wärmebild (H-1T, deckungsgleich) | clip-path-Wischer |
| 6 | Wärmebild → Ausbildung | Scanlinie / Punkt | steigt aufs Dach, Push-in aufs Dach (Kumo „window push“) | Azubi auf der Leiter (H-7), Bewerbungs-Karte | Zoom H-1 Dach → H-7 |
| 7 | Ausbildung → Protokoll | „Jetzt bewerben“-Häkchen | Zoom raus, Punkt fährt den Schornstein hinab und setzt je Ebene ein Häkchen | Bewertungs-Karten hängen an den Ebenen | Häkchen-Kette über H-1 |
| 8 | Protokoll → Termin | unterstes Häkchen im Wohnzimmer | wird zum Glutpunkt im Ofen, Push-in ins Feuer | Ofen-Film (KWV-1) + Zeitfenster-Chips | Zoom H-1 Ofen → Ofen-Video |

Vorlagen: getlayers „Kumo“ (one unbroken shot, push-in through window, cloud wipe), getlayers „Kimi“ (line-draw, ping, stroke-dashoffset), motionsites „3D Story“ (Storytelling-Scroll). Skill transitions-dev für die Feinabstimmung beim Bau.
