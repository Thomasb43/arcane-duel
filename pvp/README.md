# Arcane Duel – PvP-Test (nicht produktionsreif)

Nur auf dem Branch feature/arena-pvp. Das bisherige KI-Duell bleibt erhalten.
Die Netzwerk-Testarena nutzt einen eigenen serverseitigen Regelkern und eine einfache Testoberfläche, NICHT den vollständigen vorhandenen Duel-Client. Beide Spieler erhalten dieselbe Liste mit 30 gemischten Karten (10 Kartentypen). Keine Sammlung, kein Extra-Deck, keine Rangliste, keine Belohnungen.

## Zwei Handys im selben WLAN (Entwicklertest)
Node.js 22+ installieren, diesen Branch auschecken und im Repository-Ordner:
```sh
node --test pvp/*.test.mjs
HOST=0.0.0.0 PORT=8787 node pvp/arena-lobby.mjs
```
Unter Windows PowerShell:
```powershell
$env:HOST="0.0.0.0"; $env:PORT="8787"; node pvp/arena-lobby.mjs
```
Auf beiden Handys http://<LAN-IP-des-Rechners>:8787 öffnen. Arena > Privaten Raum erstellen, Code auf dem zweiten Handy eingeben. Beide auf Bereit tippen. Firewall nur für das private WLAN freigeben. Nicht direkt ins öffentliche Internet exponieren.

## Grenzen
Duellräume werden nicht dauerhaft gespeichert; Raumzugang per geheimem Raumtoken. Freunde-Profile und Anfragen werden lokal auf dem Testserver in .arcane-social.json gespeichert. Status wird gepollt (1,2 s); keine Wiederverbindung nach Reload. Kein öffentliches Hosting eingerichtet. Die bestehende Spieloberfläche, eigene Decks, weitere Effekte, Resonanzen, animationsgenaue Ereignisse und vollständige Kartenregeln müssen noch migriert werden. Für öffentliche Duelle: HTTPS, Authentifizierung, Ratenlimits, Zeitlimits, Wiederverbindung, serverseitige vollständige Deckvalidierung und Regelprüfung ergänzen.

## Freunde
Arena > Freunde & Anfragen. Jeder Spieler erstellt einen Namen und erhält eine öffentliche 12-stellige Spieler-ID (mit Trennstrichen angezeigt). Auf dem zweiten Gerät die ID eingeben, Anfrage abschicken; Empfänger nimmt an. Danach kann ein Freund eine Duelleinladung senden; der Empfänger nimmt an und beide tippen auf Duell beitreten und Bereit. Die Online-Anzeige bedeutet Aktivität im Freunde-Menü innerhalb von 15 Sekunden; Einladungen laufen nach zwei Minuten ab.

Die geheimen Profilzugänge werden nur im Browser gespeichert (keine Anmeldung/Wiederherstellung auf anderen Geräten). Die lokale Serverdatei enthält Profilnamen, Anfragen, Freundschaften und gehashte Zugänge. Nicht ins Repository hochladen; bei Deployment muss ein privates persistentes Verzeichnis konfiguriert werden. Kein öffentlicher Betrieb ohne HTTPS, Authentifizierung, Missbrauchsschutz und weitere Sicherheitstests.
