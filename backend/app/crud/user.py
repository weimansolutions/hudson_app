from sqlalchemy.orm import Session
from app.models.user import User, Role, Permission
from app.schemas.user import UserCreate, UserUpdate, RoleCreate, PermissionCreate
from passlib.context import CryptContext
from typing import List, Dict
from fastapi import HTTPException

from fastapi.security import OAuth2PasswordBearer
from app.utils.config import settings

import logging
logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)
handler = logging.StreamHandler()
formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
handler.setFormatter(formatter)
logger.addHandler(handler)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/token")

# Define pwd_context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def reset_password(db: Session, user_id: int, new_password: str) -> User:
    db_user = get_user(db, user_id)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    db_user.hashed_password = get_password_hash(new_password)
    db.commit()
    db.refresh(db_user)
    return db_user
    
def create_user(db: Session, user: UserCreate) -> User:
    logger.debug(f"Creating user {user.username}")
    hashed_password = get_password_hash(user.password)
    logger.debug(f"Password for {user.username} hashed as {hashed_password}")
    db_user = User(
        username=user.username,
        email=user.email,
        full_name=user.full_name,
        hashed_password=hashed_password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_user(db: Session, user_id: int) -> User:
    return db.query(User).filter(User.id == user_id).first()

def get_user_by_username(db: Session, username: str) -> User:
    return db.query(User).filter(User.username == username).first()

def get_all_users(db: Session, skip: int = 0, limit: int = 10) -> List[Dict]:
    db_users = db.query(User).offset(skip).limit(limit).all()
    result = []
    for u in db_users:
        result.append({
            "id":         u.id,
            "username":   u.username,
            "email":      u.email,
            "full_name":  u.full_name,
            # aquí extraemos solo los nombres de los roles
            "roles":      [ role.name for role in u.roles ],
            # si tu schema los incluye, puedes hacer lo mismo con permisos:
            # "permissions": [ perm.name for perm in u.permissions ]
        })
    return result

def update_user(db: Session, user_id: int, update_data: dict) -> User:
    db_user = get_user(db, user_id)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    # 1) Manejo especial de roles:
    if 'roles' in update_data:
        role_names = update_data.pop('roles') or []
        # buscas las instancias de Role correspondientes:
        role_objs = db.query(Role).filter(Role.name.in_(role_names)).all()
        db_user.roles = role_objs

    # 2) Luego aplicas el resto (email, full_name, hashed_password, etc):
    for key, value in update_data.items():
        setattr(db_user, key, value)
    
    db.commit()
    db.refresh(db_user)
    return db_user

def delete_user(db: Session, user_id: int):
    db_user = get_user(db, user_id)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    db.delete(db_user)
    db.commit()

def assign_role_to_user(db: Session, user: User, role: Role):
    if role not in user.roles:
        user.roles.append(role)
        db.commit()
        db.refresh(user)
    return user

def remove_role_from_user(db: Session, user: User, role: Role):
    if role in user.roles:
        user.roles.remove(role)
        db.commit()
        db.refresh(user)
    return user