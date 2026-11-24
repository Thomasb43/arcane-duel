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
Keine dauerhafte Speicherung, Spieleridentität nur per geheimem Raumtoken. Status wird gepollt (1,2 s); keine Wiederverbindung nach Reload. Kein öffentliches Hosting eingerichtet. Die bestehende Spieloberfläche, eigene Decks, weitere Effekte, Resonanzen, animationsgenaue Ereignisse und vollständige Kartenregeln müssen noch migriert werden. Für öffentliche Duelle: HTTPS, Authentifizierung, Ratenlimits, Zeitlimits, Wiederverbindung, serverseitige vollständige Deckvalidierung und Regelprüfung ergänzen.
