@echo off
REM Sonar-runner path
set SONAR_RUNNER_PATH=D:\Logiciels\Sonarqube-4.3.2\sonar-runner-2.4\bin

REM Go to the current position
cd %CD%

REM Launch Sonar-runner bat script
call %SONAR_RUNNER_PATH%\sonar-runner.bat

pause