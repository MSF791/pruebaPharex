from pydantic import BaseModel

#Clase Base Para manejo de datos en el usuario
class UserBase(BaseModel):
    first_name:str
    last_name:str
    email:str  
    cellphone:str
    password:str