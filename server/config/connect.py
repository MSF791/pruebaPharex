from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine
from constants.constants import DATABASE_URL

# Configurar la base de datos
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Conectar y obtener una sesión directamente
def connect_db():
    return SessionLocal()  

# Función de dependencia para obtener una sesión de la base de datos
def get_db():
    db = connect_db()
    try:
        yield db
    finally:
        db.close()