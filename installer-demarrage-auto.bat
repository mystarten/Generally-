@echo off
REM Double-clique ce fichier une fois : le cerveau demarrera tout seul, cache,
REM a chaque ouverture de session Windows. Pour l'enlever : retirer-demarrage-auto.bat
setlocal
cd /d "%~dp0"

where node >nul 2>nul
if errorlevel 1 (
  echo Node.js n'est pas installe.
  echo Installe-le ici : https://nodejs.org ^(bouton LTS^), puis double-clique a nouveau.
  pause
  exit /b 1
)

if not exist ".engine" mkdir ".engine"
set "STARTUP=%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup"
set "VBS=%STARTUP%\cerveau-mats.vbs"
set "DIR=%~dp0"

REM Petit lanceur invisible (pas de fenetre noire), journal dans .engine\server.log
> "%VBS%" echo Set sh = CreateObject("WScript.Shell")
>> "%VBS%" echo sh.CurrentDirectory = "%DIR%"
>> "%VBS%" echo sh.Run "cmd /c node server.js >> .engine\server.log 2>&1", 0, False

if not exist "%VBS%" (
  echo Impossible d'ecrire dans le dossier Demarrage : %STARTUP%
  pause
  exit /b 1
)

echo Demarrage automatique installe.
echo   Lanceur : %VBS%
echo   Journal : %DIR%.engine\server.log
echo.
echo Je le lance tout de suite et j'ouvre le cerveau...
wscript "%VBS%"
timeout /t 3 /nobreak >nul
start "" http://localhost:3000
echo.
echo Astuce : epingle http://localhost:3000 dans ton navigateur.
pause
