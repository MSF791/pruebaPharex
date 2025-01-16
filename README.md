# Prueba Tecnica Julian Tique

## Como Ejecutar el proyecto?

### Pre-requisitos:
1- Tener Instalado Python3 y NodeJS(version 22.11.0 en adelante)
2- descargar el zip de este repositorio y descomprimirlo

### Pasos para ejecutar el lado del servidor:
1- abrir una terminal y dirigirse a la carpeta descomprimida

2- ejecutar el comando python -m venv venv (creamos un entorno virtual para no mezclar dependencias)

3- ejecutar en caso de Windows: \venv\Scripts\activate

4- instalamos las dependencias necesarias con el comando: pip install -r requirements.txt

5- Nos pasamos a la carpeta server con el comando: cd server

6- Ejecutamos el comando: uvicorn api.app:app 

7- Abrimos en nuestro navegador: http://localhost:8000
8- Para ver la documentacion ingresar la url: http://localhost:8000/docs

### Pasos para ejecutar el lado del cliente:
1- abrir una terminal diferente en donde se está ejecutando la del servidor y dirigirse a la carpeta descomprimida

2- transladarnos a la carpeta client con el comando: cd client

3- instalar las dependencias necesarias para ejecutar el proyecto con: npm install

4- una vez haya terminado de instalar las dependencias ejecutar el proyecto con: npm run dev

5. Abrimos desde el navegador http://localhost:5173
