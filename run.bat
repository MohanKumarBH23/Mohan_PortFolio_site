@echo off
echo Starting Mohan's Portfolio locally...
start http://localhost:8080
python -m http.server 8080
