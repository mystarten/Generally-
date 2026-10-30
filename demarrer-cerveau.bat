@echo off
REM Double-clique ce fichier (Windows) : il demarre le cerveau et ouvre le navigateur.
cd /d "%~dp0"

where node >nul 2>nul
if errorlevel 1 (
  echo Node.js n'est pas installe.
  echo Installe-le ici : https://nodejs.org ^(bouton LTS^), puis double-clique a nouveau.
  pause
  exit /b 1
)

echo Cerveau en cours de demarrage...
start "" http://localhost:3000
echo.
echo   Le cerveau tourne sur http://localhost:3000
echo   Ferme cette fenetre pour l'arreter.
echo.
node server.js
