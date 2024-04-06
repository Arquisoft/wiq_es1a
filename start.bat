echo Iniciando gateway...
cd gatewayservice
start cmd /k node gateway-service.js
cd ..

echo Iniciando question service...
cd questionservice
start cmd /k node question-service.js
cd ..

echo Iniciando stats service...
cd statsservice
start cmd /k node stats-service.js
cd ..

echo Iniciando auth service...
cd users/authservice
start cmd /k node auth-service.js
cd ../..

echo Iniciando user service...
cd users/userservice
start cmd /k node user-service.js
cd ../..

echo Todos los microservicios han sido iniciados.