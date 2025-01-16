from fastapi import APIRouter, Depends, HTTPException
from fastapi.encoders import jsonable_encoder
from config.connect import get_db
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from schemas.UserBase import UserBase
import bcrypt 
from models.models import User
import jwt
from constants.constants import KEY
from utils.utils import generate_token

# declaramos la ruta usuarios
user = APIRouter()

"""
funcion get_user

julian tique - julismania2006@gmail.com
@params:
user_data: email que llega como parametro de la URL,
db: conexion a base de datos

retorna informacion de usuario filtrado por email
"""
@user.get('/users/{email}')
def get_user(email:str, db: Session = Depends(get_db)):
    #realizar la consulta a db 
    query = db.query(User).filter(User.email == email).first()
    #retornar el usuario si se encontró
    if query is not None:
        return {"user":query}
    else:
        raise HTTPException(status_code=404, detail='Usuario no encontrado')
"""
funcion get_users

julian tique - julismania2006@gmail.com
@params:
db: conexion a base de datos

retorna todos los usuarios
"""
@user.get('/users')
def get_users(db: Session = Depends(get_db)):
    #realizar la consulta a db 
    query = db.query(User).all()
    #retornar el usuario si se encontró
    if query is not None:
        return {"users":query}
    else:
        raise HTTPException(status_code=404, detail='No se pudieron recuperar los usuarios')

"""
funcion save_user 

julian tique - julismania2006@gmail.com
@params:
user_data: datos del usuario transformados por el schema,
db: conexion a base de datos

la función guarda el usuario en la base de datos
"""
@user.post('/users')
def save_user(user_data: UserBase, db: Session = Depends(get_db)):
    try:
        #Convertir a formato JSON
        user = user_data.model_dump()

        # Encriptar la contraseña
        password = user["password"]
        password_encode = password.encode()
        salt = bcrypt.gensalt(15)
        hashed_password = bcrypt.hashpw(password_encode, salt)

        # Actualizar el campo 'password' con la contraseña encriptada
        user["password"] = hashed_password.decode()  # Decodifica para almacenar como string en la base de datos

        # Crear el nuevo usuario con la contraseña encriptada
        new_user = User(**user)

        # Agregar y guardar el nuevo usuario en la base de datos
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
    except IntegrityError as error:
        # Verificar si el error es por violación de unicidad en el username
        db.rollback() 
        if "email" in str(error.orig):
            raise HTTPException(status_code=400, detail="El email digitado ya está en uso.")
    except Exception as error:
        raise HTTPException(status_code=500, detail=f"Ha ocurrido un error: {error}")

    return HTTPException(status_code=201, detail="Se ha creado exitosamente el usuario")

"""
funcion edit_user 

julian tique - julismania2006@gmail.com
@params:
data: datos del usuario en formato diccionario,
db: conexion a base de datos

la función edita el usuario en la base de datos
"""
@user.patch('/users/edit')
def edit_user(Data: dict, db: Session = Depends(get_db)):
    try:
        # Obtener el ID del usuario
        user_id = Data.get("id")
        if not user_id:
            raise HTTPException(status_code=400, detail="ID de usuario es requerido")
        
        # Buscar el usuario en la base de datos
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            raise HTTPException(status_code=404, detail="Usuario no encontrado")
        
        # Actualizar los campos que están en el formulario
        for key, value in Data.items():
            setattr(user, key, value)

        # Guardar los cambios en la base de datos
        db.commit()
        db.refresh(user)

        return HTTPException(status_code=204, detail="Usuario actualizado correctamente")
    except Exception as error:
        raise HTTPException(status_code=500, detail=f"ha ocurrido un error {error}")

"""
funcion delete_user 

julian tique - julismania2006@gmail.com
@params:
id: parametro de la URL,
db: conexion a base de datos 

la función elimina el usuario de la base de datos
"""
@user.delete('/users/{id}')
def delete_user(id:int, db: Session = Depends(get_db)):
    try:
        #hacemos la consulta a la db 
        user = db.query(User).filter(User.id == id).first()
        #retornamos error 404 en caso de no ser encontrado, eliminamos si hay resultados
        if not user:
            raise HTTPException(status_code=404, detail='Usuario no encontrado')
        else:
            db.delete(user)
            db.commit()
            return HTTPException(status_code=200, detail='Usuario eliminado con éxito')
    except Exception as error:
        raise HTTPException(status_code=400, detail=f"ha ocurrido un error {error}")
    
"""
funcion login 

julian tique - julismania2006@gmail.com
@params:
data:la informacion del body en el request

la función verifica los datos y nos devuelve el token generado
"""
@user.post('/users/login')
def login(data:dict, db: Session = Depends(get_db)):
    #consultamos el usuario
    user = db.query(User).filter(User.email == data["email"]).first() 
    #retornamos error en caso de no ser encontrado
    if user is None:
        raise HTTPException(status_code=404, detail="Usuario o contraseña incorrectos")
    #convertimos modelo User a JSON
    user = jsonable_encoder(user)

    #verificamos si la contraseña es correcta 
    if bcrypt.checkpw(data["password"].encode(), user["password"].encode()):
        #generamos el token
        token = generate_token(user)
        return token
    else:
        raise HTTPException(status_code=404, detail="Usuario o contraseña incorrectos")

"""
funcion check_token 

julian tique - julismania2006@gmail.com
@params:
token: recibimos el token como parte del body en el request,

la funcion nos retorna la informacion almacenada en el token
""" 
@user.post('/users/auth')
def check_token(token:dict):
    if not token:
        raise HTTPException(status_code=401, detail="No autenticado")
    
    try:
        payload = jwt.decode(token['token'], KEY, algorithms=["HS256"])
        return payload 
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Token inválido") 
    