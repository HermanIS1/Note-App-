## Notes App

Prosta aplikacja do rysowania notatek w zeszytach (Next.js + Prisma).

## Wymagania

# Zainstalowane:

Node.js (najlepiej v18 lub nowszy)

npm

# Sprawdzenie w terminalu:

node -v
npm -v

# Instalacja (jeśli pobierasz projekt jako ZIP)

# Pobierz repozytorium jako ZIP z GitHub

# Rozpakuj ZIP na komputerze

# Otwórz terminal w folderze projektu

# Instalacja zależności

npm install

# To zainstaluje wszystkie potrzebne pakiety (node_modules).

# Konfiguracja bazy danych

# Utwórz plik:

.env

# Wklej do niego:

DATABASE_URL="file:./dev.db"

# Inicjalizacja bazy danych

# Uruchom:

npx prisma generate
npx prisma migrate dev

# To utworzy lokalną bazę danych i tabele.

# Uruchomienie aplikacji

npm run dev

# Aplikacja uruchomi się na:

http://localhost:3000

# Co można robić w aplikacji

tworzyć zeszyty

dodawać strony

rysować notatki

usuwać strony

przeglądać miniatury stron

# Struktura projektu

app/ → strony Next.js
components/ → komponenty React
prisma/ → baza danych i schema
lib/ → konfiguracje (np. prisma client)
public/ → pliki statyczne

# Reset bazy danych (opcjonalnie)

# Jeśli coś się zepsuje, możesz usunąć plik:

prisma/dev.db

i ponownie uruchomić:

npx prisma migrate dev

# Uruchomienie w skrócie

npm install
npx prisma generate
npx prisma migrate dev
npm run dev
