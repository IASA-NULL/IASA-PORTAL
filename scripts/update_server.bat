@echo off
IF "%1"=="" (
    set /p str=Enter Branch: 
) ELSE (
    set str=%1
)
echo 1 >> C:\Server\state\build
cd C:\Server
cd IASA-PORTAL
call git reset --hard
call git fetch
call git pull origin %str%
call git checkout %str%
call yarn install
call yarn run build
xcopy C:\secret C:\server\IASA-PORTAL\secret /e/i/h/y
del /s /q C:\Server\state\build