@echo off
REM Enleve le demarrage automatique du cerveau et arrete celui qui tourne.
setlocal
set "VBS=%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup\cerveau-mats.vbs"
if exist "%VBS%" (
  del "%VBS%"
  echo Demarrage automatique retire.
) else (
  echo Il n'etait pas installe.
)
REM arrete le serveur du cerveau, et lui seul (son numero est note dans .engine\server.pid)
cd /d "%~dp0"
if exist ".engine\server.pid" (
  set /p PID=<".engine\server.pid"
  call taskkill /PID %%PID%% /F >nul 2>nul
  del ".engine\server.pid"
)
echo Cerveau arrete.
pause
