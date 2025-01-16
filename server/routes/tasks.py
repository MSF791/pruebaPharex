from fastapi import APIRouter, Depends, HTTPException
from config.connect import get_db
from sqlalchemy.orm import Session
from schemas.TaskBase import TaskBase
from models.models import Task, TaskStatus
from fastapi.encoders import jsonable_encoder
from datetime import datetime
from models.models import TaskHistory

task = APIRouter()

"""
funcion get_tasks_created

julian tique - julismania2006@gmail.com
@params:
user: id que llega como parametro de la URL,
db: conexion a base de datos

retorna tareas filtradas por usuario
"""
@task.get('/tasks/{user}')
def get_tasks_created(user:int, db:Session = Depends(get_db)):
    #hacemos la consulta para recuperar las tareas por usuario
    tasks = db.query(Task).filter(Task.assigned_by == user).all()
    if not tasks:
        raise HTTPException(status_code=404, detail=f'No se pudieron recuperar las tareas del usuario {user}')
    else:
        response = []
        #mapeamos la respuesta para poder usar el nombre
        for task in tasks:
            response.append({
                "id": task.id,
                "name": task.name,
                "description": task.description,
                "deadline": task.deadline,
                "status": task.status,
                "priority": task.priority,
                "assigned_to": f"{task.assigned_user.first_name} {task.assigned_user.last_name}" if task.assigned_user else None
            })

        return {"tasks": response}

"""
funcion get_tasks_created

julian tique - julismania2006@gmail.com
@params:
user: id que llega como parametro de la URL,
db: conexion a base de datos

retorna las tareas asignadas por otros usuarios
"""
@task.get('/tasks/assigned/{user}')
def get_tasks_assigned(user:int, db:Session = Depends(get_db)):
    #hacemos la consulta para recuperar las tareas por usuario
    tasks = db.query(Task).filter(Task.assigned_to == user).all()
    if not tasks:
        raise HTTPException(status_code=404, detail=f'No se pudieron recuperar las tareas del usuario {user}')
    else:
        response = []
        #mapeamos la respuesta para poder usar el nombre
        for task in tasks:
            response.append({
                "id": task.id,
                "name": task.name,
                "description": task.description,
                "deadline": task.deadline,
                "status": task.status,
                "priority": task.priority,
                "assigned_to": f"{task.assigned_user.first_name} {task.assigned_user.last_name}" if task.assigned_user else None,
                "assigned_by": f"{task.assigned_by_user.first_name} {task.assigned_by_user.last_name}" if task.assigned_by_user else None
            })

        return {"tasks": response}

"""
funcion load_task

julian tique - julismania2006@gmail.com
@params:
id: id que llega como parametro de la URL,
db: conexion a base de datos

retorna informacion sobre una tarea
"""
@task.get('/tasks/load/{id}')
def load_task(id:int, db:Session = Depends(get_db)):
    task = db.query(Task).filter(Task.id == id).first()
    if not task:
        raise HTTPException(status_code=404, detail='No se pudo recuperar la tarea')
    else: 
        return {"task":task}

"""
funcion create_task

julian tique - julismania2006@gmail.com
@params:
data: Schema Base para tareas,
db: conexion a base de datos

retorna la informacion de la tarea agregada
"""
@task.post('/tasks')
def create_task(data:TaskBase, db:Session = Depends(get_db)):
    try:
        data = data.model_dump()

        new_task = Task(**data)
        db.add(new_task)
        db.commit()
        db.refresh(new_task)

        return {
            "id": new_task.id,
            "name": new_task.name,
            "description": new_task.description,
            "assigned_to": f"{new_task.assigned_user.first_name} {new_task.assigned_user.last_name}" if new_task.assigned_user else None,
            "status": new_task.status,
            "priority": new_task.priority,
            "deadline": new_task.deadline
        }
    
    except Exception as error:
        raise HTTPException(status_code=500, detail='Ha ocurrido un error')

"""
funcion delete_task

julian tique - julismania2006@gmail.com
@params:
id: id que llega como parametro de la URL,
db: conexion a base de datos

retorna elimina la tarea
"""
@task.delete('/tasks/{id}')
def delete_task(id:int, db:Session = Depends(get_db)):
    try:    
        query = db.query(Task).filter(Task.id == id).first()
        if not query:
            raise HTTPException(status_code=404, detail='no se pudo recuperar la tarea')
        else:
            db.delete(query)
            db.commit()
            return HTTPException(status_code=200, detail='Tarea Eliminada Con Exito')
    except Exception as error:
        raise HTTPException(status_code=500, detail='Ha ocurrido un error')
    
"""
funcion edit_task

julian tique - julismania2006@gmail.com
@params:
data: diccionario con la informacion de la tarea,
db: conexion a base de datos

retorna datos de la actualizacion y agrega en el historial
"""
@task.patch('/tasks')
async def edit_task(data:dict, db: Session = Depends(get_db)):
    try:
        from api.app import send_notification
        task_id = data.get("id")
        if not task_id:
            raise HTTPException(status_code=400, detail='el id de la tarea es requerido')
        
        if data["status"] == 'pendiente':
            data["status"] = TaskStatus.PENDING
        elif data["status"] == 'en progreso':
            data["status"] = TaskStatus.IN_PROGRESS
        elif data["status"] == 'completada':
            data["status"] = TaskStatus.COMPLETED
        
        task = db.query(Task).filter(Task.id == task_id).first()
        if not task:
            raise HTTPException(status_code=404, detail='No se pudo recuperar la tarea')
        
        original_task_data = jsonable_encoder(task)
        
        # Actualizar los campos que están en el formulario
        for key, value in data.items():
            setattr(task, key, value)

        # Guardar los cambios en la base de datos
        db.commit()
        db.refresh(task)

        if task.assigned_by:
            user_id = task.assigned_by
            message = f"La tarea {task.name} ha sido modificada"
            await send_notification(user_id, message)

        # Guardar el historial de la tarea
        history = TaskHistory(
            task_id=task.id,
            action="Actualización",
            previous_data=str(original_task_data),
            new_data=str(jsonable_encoder(task)),
            modified_at=datetime.now()
        )
        db.add(history)
        db.commit()

        return HTTPException(status_code=200, detail='Se ha actualizado con exito')

    except Exception as error:
        raise HTTPException(status_code=500, detail='Ha ocurrido un error')
    
"""
funcion get_history_tasks

julian tique - julismania2006@gmail.com
@params:
user_id: id que llega como parametro de la URL,
db: conexion a base de datos

retorna historico de tareas por usuario
"""
@task.get('/tasks/history/{user_id}')
def get_history_tasks(user_id:int, db: Session = Depends(get_db)):
    task_history = db.query(TaskHistory).join(Task).filter(Task.assigned_by == user_id).all()
    if not task_history:
        raise HTTPException(status_code=404, detail='No se han podido recuperar los logs')
    else:
        return {"tasks_history":task_history}