@echo off
echo ============================================
echo   DGSkills - AI Lab Future Architect
echo   Windows Setup Script
echo ============================================
echo.

:: Check Node.js
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo [FOUT] Node.js is niet gevonden!
    echo Download Node.js LTS van: https://nodejs.org/
    echo Installeer Node.js en voer dit script opnieuw uit.
    pause
    exit /b 1
)

:: Show Node version
echo [OK] Node.js gevonden:
node --version
echo.

:: Check npm
where npm >nul 2>&1
if %errorlevel% neq 0 (
    echo [FOUT] npm is niet gevonden!
    pause
    exit /b 1
)

echo [OK] npm gevonden:
npm --version
echo.

:: Install dependencies
echo [1/3] Dependencies installeren...
echo.
call npm install
if %errorlevel% neq 0 (
    echo [FOUT] npm install is mislukt!
    pause
    exit /b 1
)
echo.
echo [OK] Dependencies geinstalleerd!
echo.

:: Create .env.local if it doesn't exist
if not exist .env.local (
    echo [2/3] .env.local aanmaken...
    (
        echo # Lokale ontwikkelomgeving
        echo # Vul hier je Supabase gegevens in ^(zie Supabase Dashboard ^> Project Settings ^> API^)
        echo VITE_SUPABASE_URL=https://your-project-ref.supabase.co
        echo VITE_SUPABASE_ANON_KEY=your-anon-key
    ) > .env.local
    echo [OK] .env.local aangemaakt - vul je Supabase gegevens in!
) else (
    echo [2/3] .env.local bestaat al - overgeslagen.
)
echo.

:: Done
echo [3/3] Setup voltooid!
echo.
echo ============================================
echo   Volgende stappen:
echo ============================================
echo.
echo 1. Open .env.local en vul je Supabase URL en Anon Key in
echo    (zie Supabase Dashboard ^> Project Settings ^> API)
echo.
echo 2. Start de development server:
echo    npm run dev
echo.
echo 3. Open je browser op http://localhost:5173
echo.
echo ============================================
pause
