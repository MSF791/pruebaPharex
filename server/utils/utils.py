import jwt
from constants.constants import (KEY)

"""
funcion generate_token 

julian tique - julismania2006@gmail.com
@params:
user: informacion del usuario

la función genera el token con la informacion del usuario
"""
def generate_token(user):
    #mapeamos los datos
    data_user = {
        "id":user["id"],
        "email": user["email"],
    }
    #generamos el token
    encoded = jwt.encode(data_user, KEY, algorithm="HS256")
    return encoded