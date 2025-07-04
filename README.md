# LogisticaGlobal

LogisticaGlobal busca desarrollar una aplicación para optimizar la gestión de incidentes de robot en almacenes automatizados. Actualmente tienen un proceso manual ineficiente y proceso a errores lo que dificulta el seguimiento y generación de reportes. Lo que se busca es crear una herramienta centralizada que permita registrar, clasificar y hacer seguimiento a los incidentes robóticos, mejorando la trazabilidad y reduciendo tiempos de gestión.

## Requisitos
- React 	v19 o superior
- NodeJS v18 o superior
- PostgreSQL v12 o superior

## Instalación
### Clonar repositorio
```
git clone https://github.com/Marambio-MyA/LogisticaGlobal.git
cd LogisticaGlobal
```
### Backend
Dirigirse a la carpeta backend
```
cd backend
```
El sistema requiere un archivo `.env` en la raíz del proyecto backend con las siguientes variables de entorno:
```
DB_USER = DB_USER
DB_HOST = DB_HOST
DB_NAME = DB_NAME
DB_PASSWORD = DB_PASSWORD
DB_PORT = DB_PORT
JWT_SECRET = JWT_SECRET
```

Estas variables son necesarias para establecer la conexión a la base de datos, configurar el puerto del servidor. Una vez creado, ejecutar estos comandos para iniciar al servidor.
```
npm install
npm run start
```
### Frontend

Dirigirse a la carpeta frontend
```
cd frontend
```

El Frontend nececia de un .env para conectarse con la API del backend y definir el tipo de ambiente:
```
VITE_API_HOST = VITE_API_HOST
VITE_API_PORT = VITE_API_PORT
VITE_ENV = VITE_ENV
```

Ejecutar estos comandos para iniciar al servidor.
```
npm install
npm run dev
```

### Test

Dirigirse a la carpeta test
```
cd test
```

Las pruebas requieren de un .env para conectarse al ambiente e iniciar sesión con un usuario:
```
TEST_URL = TEST_URL
TEST_EMAIL = TEST_EMAIL
TEST_PASSWORD = TEST_PASSWORD
```

Ejecutar estos comandos para iniciar las pruebas.
```
npm install
node main-test.js
```

Para mas informacion de la documentación mirar la [Wiki](https://github.com/Marambio-MyA/LogisticaGlobal/wiki)
