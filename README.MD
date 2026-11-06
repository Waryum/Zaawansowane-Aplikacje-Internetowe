Aplikacja wyświetlająca pomiary temperatury z czujników. 
API utworzone zgodnie z kontrakterm OpenAPI.

Aplikacja wdrożone pod adresem https://pogoda.jakubwor.hostilla.pl

Aplikacja działa przez Passenger'a, pierwsze żądanie może potrwać dłużej przy okresie bezczynności.

Wykorzystane technologie to: Node.js 24, Express 5, MariaDB wraz z konektorem, bcryptjs oraz dotenv.

Uruchomienie lokalne:

1. npm install
2. skopiowanie .env.example do .env z własnymi parametrami.
3. utworzenie bazy danych i schematu mysql -u root -p nazwa_bazy < db/schema.sql
4. npm run create-admin
5. node server.js

Generator wartości znajduje się w katalogu /generator.
Polecenie uruchomienia generator.js z parametrami uruchomienia (--api, --key, --count, --interval, --mode, --min, --max, --live).

Wartości min oraz max muszą zostać zapisane z symbolem "=".

Struktura katalogu:

1. Główne przekierowania w katalogu routes/
2. Dodatkowe funckje w katalogu middleware/
3. Schema.sql i funkcja połączenia z bazą w katalogu db/
4. dodatkowe funkcje w katalogu utils/
5. skrypt tworzenia konta administratora w katalogu scripts/
6. generator wartości w katalogu generator/
7. Katalog information/ zawiera testowe wywołania SQL query wykorzystane przy testach oraz diagram ERD.

W głównym katalogu znajdują się pliki app.js oraz plik wywołujący server.js.