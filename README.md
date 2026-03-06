# QR Dispenser Demo (MVP)

Detta är en **minimal, fungerande** demo:

1) Skanna QR → öppna `index.html?p=demo`
2) Välj land → redirect till lokal URL från `config.json`

## Ändra länkar
Öppna `config.json` och byt ut `url` för respektive marknad.

## Lägg till fler länder
1. Lägg till i `ui.supportedMarkets`
2. Lägg till i produktens `markets`

Exempel:
```json
"FR": {"label": "France", "url": "https://..."}
```

## Flera produkter (en QR per produkt)
Lägg till fler produkter under `products`, t.ex. `"soap-1000"`, och gör QR-länken:

`https://DIN-DOMÄN/index.html?p=soap-1000`

## Hosting (för att mobilen ska nå sidan)
- **Enklast**: GitHub Pages eller Azure Static Web Apps (gratis nivå finns).
- Om ni vill hålla allt internt kan IT hjälpa till med intern webbplats eller tenant-godkänd hosting.

> OBS: SharePoint/Teams dokumentbibliotek är inte alltid lämpligt för att köra HTML/JS direkt (kan laddas ner istället för att visas).

## Skapa QR-kod
Du kan generera QR med valfritt verktyg. I detta paket finns en exempel-QR som pekar på en placeholder.

Skapad: 2026-03-06
