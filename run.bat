@echo off
echo Starting Mohan's Portfolio locally...
start http://localhost:5050
python -m http.server 5050
