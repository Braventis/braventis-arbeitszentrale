# BRAVENTIS Arbeitszentrale

Hybride Next.js-Anwendung im BRAVENTIS-Design. Notion dient in der ersten Ausbaustufe als Datenbasis.

## Aktueller Umfang

- responsives Dashboard im BRAVENTIS-Farbsystem
- Übersicht, Aufgaben, Monatssteuerung, Kunden, Kommunikation, Kontakte
- Kalender, Webmail-Shell, Finanzen, Team/Rollen und Tools
- serverseitiges Lesen aus Notion
- serverseitiges Erstellen einfacher Aufgaben
- Demomodus, solange kein Notion-Token hinterlegt ist

## Lokal starten

```bash
npm install
cp .env.example .env.local
npm run dev
```

## Notion verbinden

1. Interne Notion-Integration anlegen.
2. Nur die benötigten Datenbanken mit der Integration teilen.
3. Token ausschließlich als `NOTION_TOKEN` in `.env.local` bzw. Vercel hinterlegen.
4. Die Datenquellen-IDs sind in `.env.example` vorbereitet.

Niemals einen Notion-Token in Client-Code oder GitHub committen.

## Vercel

1. Repository in Vercel importieren.
2. Variablen aus `.env.example` unter Project Settings → Environment Variables eintragen.
3. Deployment starten.

## Nächste Ausbaustufen

- echtes Login und Rollenprüfung
- vollständige CRUD-Aktionen für Monatspläne, Termine, Team und Belege
- Notion File Upload / OCR-Service für Belege
- Webmail-Provider und Kalenderintegration
- Videoanbieter und Benachrichtigungen
- Audit-Log und Freigabeautomationen
