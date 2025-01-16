from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime
from sqlalchemy import Column, String, Integer, Text, DateTime, ForeignKey, Enum, create_engine
from sqlalchemy.orm import relationship 
from enum import Enum as PyEnum

Base = declarative_base()

# Modelo de DB
class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True, autoincrement=True)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    cellphone = Column(String, nullable=False)
    password = Column(String, nullable=False)
    # Relaciones
    tasks = relationship('Task', foreign_keys='Task.assigned_to', back_populates='assigned_user')
    assigned_tasks = relationship('Task', foreign_keys='Task.assigned_by', back_populates='assigned_by_user')

    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}"

class TaskStatus(PyEnum):
    PENDING = "pendiente"
    IN_PROGRESS = "en progreso"
    COMPLETED = "completada"

class Task(Base):
    __tablename__ = 'tasks'
    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.now(), nullable=False)
    updated_at = Column(DateTime, default=datetime.now(), onupdate=datetime.now(), nullable=False)
    deadline = Column(DateTime, nullable=False) 
    status = Column(Enum(TaskStatus), default=TaskStatus.PENDING, nullable=False)
    priority = Column(Integer, default=1, nullable=False)
    #Claves foráneas
    assigned_to = Column(Integer, ForeignKey('users.id'), nullable=True)
    assigned_by = Column(Integer, ForeignKey('users.id'), nullable=True)
    # Relaciones
    assigned_user = relationship('User', foreign_keys=[assigned_to], back_populates='tasks') 
    assigned_by_user = relationship('User', foreign_keys=[assigned_by], back_populates='assigned_tasks')
    # Relación con el historial de tareas
    history = relationship("TaskHistory", back_populates="task")

class TaskHistory(Base):
    __tablename__ = "task_history"

    id = Column(Integer, primary_key=True, index=True)
    task_id = Column(Integer, ForeignKey('tasks.id'))
    action = Column(String)
    previous_data = Column(String)
    new_data = Column(String)
    modified_at = Column(DateTime, default=datetime.now())

    task = relationship("Task", back_populates="history")