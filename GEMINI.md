# Petale și Poveste | Workspace Instructions

Acesta este spațiul de lucru pentru proiectul **Petale și Poveste**, un atelier artizanal floral din Sibiu. Proiectul este un site web static, modern și performant, axat pe o experiență de utilizare tactilă și elegantă.

## Project Overview

- **Scop:** Prezentarea atelierului floral, portofoliului de servicii și facilitarea interacțiunii prin instrumente interactive (Creator de Buchete, Calculator Evenimente).
- **Tehnologii:** 
    - **Frontend:** HTML5, CSS3 (Modern tokens/variables), Vanilla JavaScript.
    - **Iconițe:** Lucide Icons (încărcate via CDN).
    - **Fonturi:** Fraunces (serif) pentru titluri, Inter (sans-serif) pentru text de bază.
    - **Performanță:** Throttling pentru scroll/mouse events, accelerare GPU via `transform3d`, preload pentru resurse critice (LCP).

## Directory Structure

- `index.html`: Pagina principală (Hero, Despre, Testimoniale).
- `portfolio.html`: Galeria de lucrări și proiecte trecute.
- `services.html`: Detalii despre servicii și Configuratorul de Eveniment.
- `about.html`: Istoria atelierului și echipa.
- `contact.html`: Formular de contact și detalii locație.
- `admin.html`: Panou de control administrativ (interfață statică pentru dashboard).
- `style.css`: Toate stilurile proiectului, organizate folosind variabile semantice pentru teme (Light/Dark).
- `script.js`: Logica interactivă (Cursor custom, Scroll parallax, Theme toggle, Mobile menu).
- `imgs/`: Resursele vizuale (logo, fotografii portofoliu, hero images).

## Development Conventions

1.  **Type Safety & JS:** Deși este Vanilla JS, codul trebuie să fie curat, bine documentat și să evite manipulări costisitoare de DOM în loop-uri de animație. Folosiți `requestAnimationFrame` pentru animații.
2.  **CSS Architecture:** 
    - Folosiți variabilele din `:root` definite în `style.css` pentru culori, spațiere și umbre.
    - Respectați designul "glassmorphism" și "pastel" stabilit.
    - Suportul pentru **Dark Mode** este obligatoriu via atributul `data-theme` pe `html`.
3.  **Performance:**
    - Imaginile noi trebuie adăugate în `imgs/` și optimizate.
    - Folosiți `loading="lazy"` pentru imagini sub fold.
    - Mențineți INP (Interaction to Next Paint) sub 200ms.
4.  **Accessibility (A11Y):**
    - Folosiți contrast ratios adecvate (definite în token-urile CSS).
    - Asigurați-vă că iconițele Lucide au `aria-hidden="true"` sau label-uri descriptive unde este cazul.

## How to Run

Deoarece este un site static, poate fi rulat prin orice server local de fișiere:
- **VS Code:** Live Server extension.
- **Python:** `python3 -m http.server 8000`.
- **Node.js:** `npx serve .`.

## TODO / Future Improvements

- [ ] Implementarea funcționalității reale pentru "Creatorul de Buchete".
- [ ] Conectarea formularului de contact la un serviciu de backend (ex: Formspree sau API custom).
- [ ] Optimizarea suplimentară a imaginilor din `imgs/` (WebP).
- [ ] Adăugarea de animații de intrare (Reveal on scroll) folosind `IntersectionObserver`.
