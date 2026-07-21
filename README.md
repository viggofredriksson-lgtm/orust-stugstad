# Orust Stugstäd – hemsida

Statisk one-pager (HTML/CSS/JS, inget byggsteg). Filer:

- `index.html` – all text och struktur
- `styles.css` – all styling (palett som CSS-variabler högst upp i filen)
- `script.js` – mobilmeny, diskret parallax, kontaktformulär (placeholder)
- `assets/svg/` – landskapet i hero (moln, fiskmåsar, kustlinje med sjöbodar/båt), var och en i egen fil
- `assets/img/logo.png` – er logga, används liten i nav och footer

## Köra lokalt

Öppna en terminal i mappen och kör en enkel lokal server, t.ex.:

```
python3 -m http.server 8000
```

Gå sedan till `http://localhost:8000` i webbläsaren. (Man kan även dubbelklicka
på `index.html` direkt, men en lokal server rekommenderas eftersom vissa
webbläsare är strikta med lokala filsökvägar.)

## Publicera

Sajten är ren statisk HTML/CSS/JS och kan hostas gratis, t.ex.:

- **Netlify:** dra och släpp mappen på [app.netlify.com/drop](https://app.netlify.com/drop),
  eller koppla ett GitHub-repo för automatiska uppdateringar.
- **GitHub Pages:** pusha mappen till ett GitHub-repo, aktivera Pages i
  repots inställningar (branch `main`, root-mapp).
- **Vercel:** `vercel deploy` i mappen, eller koppla GitHub-repo.

## Kvar att göra innan lansering

Sök efter `TODO` i koden – varje ställe är kommenterat:

1. **Kontaktformuläret** (`index.html`, sektion `#kontakt`, och `script.js`) –
   koppla till t.ex. [Formspree](https://formspree.io) eller mail.
2. **JSON-LD url** (`index.html`, `<head>`) – uppdatera `url` när ni har en
   riktig domän (telefon och mail är redan ifyllda).
3. **Loggan** har låg upplösning – har ni en skarpare/vektorversion senare
   (t.ex. SVG) är det bara att byta ut `assets/img/logo.png`.
