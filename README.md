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

5- Abrimos desde el navegador http://localhost:5173

## Tecnologias Utilizadas

Para la solución de la prueba técnica decidí utilizar FastAPI (backend), ReactJS + Vite (frontend) y base de datos relacional PostgreSQL. Decidí utilizar FastAPI por la ventaja de la autodocumentación de la API y su sintaxis sencilla y legible. 

Para el caso del frontend, escogí ReactJS + Vite. En este caso, decidí utilizar React con el empaquetador Vite para poder agilizar los procesos, el tiempo de carga y que el sitio web se sienta más fluido. En la prueba se mencionan relaciones de uno a muchos o de muchos a muchos, por lo que decidí utilizar PostgreSQL por tiempos de respuesta más rápidos. 

La base de datos se desplegó en Neon.tech, ya que su versión gratuita permite utilizar hasta un máximo de 2 MB, lo que permite agilizar el tiempo de respuesta.

Para el tema de los estilos elegi tailwind por sus colores fijos, comodidad y facilidad al escribir codigo css en linea.

## Decisiones Técnicas
Para hacer la conexión a la base de datos utilice la biblioteca sqlalchemy que utiliza orm (Object Relational Mapping), lo que facilita al hacer consultas SQL y la legibilidad del codigo.

Para el tema de las contraseñas utilice bcrypt para poder encriptar las contraseñas y no dejarlas como texto plano. 

Para el login utilicé la libreria jwt que permite generar tokens para almacenar la sesión del usuario. 

Use la libreria websockets para poder tener la comunicación entre el front y el back.

FastAPI tiene una facilidad para comunicarse con websocket que fue otra razón por la que decidi utilizar fastAPI.

## Retos Encontrados durante la prueba

Mientras desarrollaba la prueba técnica y llegue a la parte donde tenia que realizar el websocket para poder mostrar la notificación cuando ocurre un cambio
en la tarea asignada. Realmente nunca habia escuchado el termino websocket asi que empece investigarlo y entender como funcionaba para poder realizar el mayor reto de la prueba técnica leyendo documentación y algunos blogs tuve la primera idea de como empezar a desarrollar la funcionalidad del websocket para configurarlo para poder enviar mensajes entre el servidor y el cliente. 

Una vez tuve la primera versión lo implemente mal en el front, ya que no lo habia hecho a nivel general sino a nivel de componente una vez lo pase a nivel de componente tuve problemas con la notificacion ya que use react-hot-toast para las alertas y no abria la alerta. Despues de depurar y revisar la documentacion de react-hot-toast pude superar el problema.

Otro Reto fue a la hora de hacer el modelo de Tareas ya que además de los campos comunes en las tareas tenia que hacer las relaciones para tareas y usuario para poder asignar usuario y crear nuestras propias tareas.

Adicionalmente tuve algunas dificultades con el responsive por darle propiedades a unos contenedores incorrectos


