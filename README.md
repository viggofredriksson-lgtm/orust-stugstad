# Orust Stugstäd – hemsida

Statisk one-pager (HTML/CSS/JS, inget byggsteg). Filer:

- `index.html` – all text och struktur
- `styles.css` – all styling (palett som CSS-variabler högst upp i filen)
- `script.js` – mobilmeny, diskret parallax, Städguiden, kontaktformulär (skickas till Formspree)
- `assets/svg/` – landskapet i hero (moln, fiskmåsar, kustlinje med sjöbodar/båt), var och en i egen fil
- `assets/img/logo.png` – er logga, används liten i nav och footer
- `robots.txt` / `sitemap.xml` – för sökmotorer (Google m.fl.)

## Köra lokalt

Öppna en terminal i mappen och kör en enkel lokal server, t.ex.:

```
python3 -m http.server 8000
```

Gå sedan till `http://localhost:8000` i webbläsaren. (Man kan även dubbelklicka
på `index.html` direkt, men en lokal server rekommenderas eftersom vissa
webbläsare är strikta med lokala filsökvägar.)

## Publicerad

Sajten är live på GitHub Pages, gratis:

**https://viggofredriksson-lgtm.github.io/orust-stugstad/**

Koden ligger i GitHub-repot [viggofredriksson-lgtm/orust-stugstad](https://github.com/viggofredriksson-lgtm/orust-stugstad).
Varje gång ni vill publicera en ändring:

```
git add -A
git commit -m "beskrivning av ändringen"
git push
```

Sidan uppdateras automatiskt (tar oftast under en minut).

**Viktigt vid ändringar i `script.js` eller `styles.css`:** GitHub Pages
cachar dessa filer i webbläsaren i 10 minuter. Höj siffran i `?v=2` (i
`index.html`, längst ner respektive i `<head>`) varje gång du ändrar någon av
filerna, annars kan besökare (och du själv) se en gammal cachad version ett
tag efter att ändringen är live.

Vill ni ha en egen domän (t.ex. `oruststugstad.se`) senare går det att koppla
in under repots Settings → Pages → Custom domain – hör bara av dig så hjälper
jag till att ställa in det (då behöver canonical-URL:en och JSON-LD:t i
`index.html` också bytas till den nya domänen).

Andra gratis-alternativ om ni någon gång vill byta host: **Netlify**
(drag-och-släpp på [app.netlify.com/drop](https://app.netlify.com/drop) eller
koppla GitHub-repot) eller **Vercel** (koppla GitHub-repot).

## Kontaktformulär

Kopplat till Formspree: [formspree.io/f/mojglrwb](https://formspree.io/f/mojglrwb).
Inskickningar går till mailen som är kopplad till det Formspree-kontot, och
går även att se i Formspree-dashboarden. Vill ni ha SMS-avisering också,
koppla en Zap (Formspree → SMS by Zapier, eller via webhook om Formspree inte
dyker upp som egen app i Zapier).

## Kvar att göra

1. **JSON-LD url** (`index.html`, `<head>`) – uppdatera `url` när ni har en
   riktig domän (telefon och mail är redan ifyllda).
2. **Loggan** har låg upplösning – har ni en skarpare/vektorversion senare
   (t.ex. SVG) är det bara att byta ut `assets/img/logo.png`.
