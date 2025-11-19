@echo off
echo ============================================
echo   HEALit Lab - Quick Deployment Commands
echo ============================================
echo.

:menu
echo.
echo Select an option:
echo.
echo 1. Install dependencies
echo 2. Run development server
echo 3. Build for production
echo 4. Preview production build
echo 5. Deploy to GitHub
echo 6. Check deployment status
echo 7. Exit
echo.
set /p choice="Enter your choice (1-7): "

if "%choice%"=="1" goto install
if "%choice%"=="2" goto dev
if "%choice%"=="3" goto build
if "%choice%"=="4" goto preview
if "%choice%"=="5" goto deploy
if "%choice%"=="6" goto status
if "%choice%"=="7" goto end

echo Invalid choice. Please try again.
goto menu

:install
echo.
echo Installing dependencies...
npm install
echo.
echo Done! Dependencies installed.
pause
goto menu

:dev
echo.
echo Starting development server...
echo Visit: http://localhost:5173
npm run dev
goto menu

:build
echo.
echo Building for production...
npm run build
echo.
echo Build complete! Check /dist folder.
pause
goto menu

:preview
echo.
echo Previewing production build...
echo Visit: http://localhost:4173
npm run preview
goto menu

:deploy
echo.
echo Deploying to GitHub...
echo.
set /p commit_msg="Enter commit message: "
git add .
git commit -m "%commit_msg%"
git push origin main
echo.
echo Code pushed! Netlify will auto-deploy in 1-2 minutes.
echo Check: https://app.netlify.com/
pause
goto menu

:status
echo.
echo Checking Git status...
git status
echo.
pause
goto menu

:end
echo.
echo Goodbye!
exit
