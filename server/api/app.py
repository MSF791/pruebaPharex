from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from typing import List
from routes.users import user
from routes.tasks import task
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = ["http://localhost:5173"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Guardar las conexiones de los WebSockets para poder enviar mensajes
active_connections: List[WebSocket] = []

# Función para manejar la conexión WebSocket
@app.websocket("/ws/notifications/{user_id}")
async def websocket_endpoint(websocket: WebSocket, user_id: int):
    await websocket.accept()
    active_connections.append((websocket, user_id))
    
    try:
        while True:
            data = await websocket.receive_text()

    except WebSocketDisconnect:
        active_connections.remove((websocket, user_id))

# Función para enviar notificaciones a los usuarios
async def send_notification(user_id: int, message: str):
    for websocket, connected_user_id in active_connections:
        if connected_user_id == user_id:
            await websocket.send_text(message)

@app.get('/')
def home():
    return "Bienvenidos!"

app.include_router(user)
app.include_router(task)