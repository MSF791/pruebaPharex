from pydantic import BaseModel
from datetime import datetime
from enum import Enum
from typing import Optional

#Clase Base Para manejo de datos en el usuario
class TaskBase(BaseModel):
    name: str
    description: str
    deadline: datetime
    priority: int
    assigned_to: Optional[int]
    assigned_by: Optional[int]
