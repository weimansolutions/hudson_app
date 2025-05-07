from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.schemas.user import UserCreate, UserUpdate, UserResponse, Role,UserDataUpdate,PasswordReset,UserOut
from app.services.user_service import create_user_service, update_user_service,reset_password_service
from app.crud import user as user_crud, role as role_crud
from app.utils.dependencies import get_db, permission_required, role_required,get_current_user
from app.models.user import User as UserModel
from typing import List
from app.crud.user import get_all_users

router = APIRouter()

@router.post("/", response_model=UserResponse, status_code=201, dependencies=[Depends(permission_required("create_user"))])
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    db_user = create_user_service(db, user)
    return UserResponse.from_orm(db_user)

@router.get("/me", response_model=UserResponse, tags=["User Management"])
def read_current_user_me(current_user: UserModel = Depends(get_current_user)):
    return UserResponse.from_orm(current_user)
    
@router.get("/{user_id}", response_model=UserResponse, dependencies=[Depends(permission_required("read_user"))])
def get_single_user(
    user_id: int,
    db: Session = Depends(get_db)
) -> UserResponse:
    db_user = user_crud.get_user(db, user_id)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    return UserResponse.from_orm(db_user)

@router.get("/", response_model=List[UserOut], dependencies=[Depends(permission_required("read_all_users"))])
def get_all_users_list(
    skip: int = 0,
    limit: int = 10,
    db: Session = Depends(get_db)
):
    # devuelve la lista de dicts con id, username, email, full_name, roles
    return get_all_users(db, skip, limit)

@router.put(
    "/{user_id}",
    response_model=UserResponse,
    dependencies=[Depends(permission_required("update_user"))]
)
def update_user_data(
    user_id: int,
    payload: UserDataUpdate,
    db: Session = Depends(get_db)
) -> UserResponse:
    db_user = update_user_service(db, user_id, payload)
    return UserResponse.from_orm(db_user)

@router.post(
    "/{user_id}/reset-password",
    status_code=204,
    dependencies=[Depends(permission_required("reset_password"))]
)
def reset_user_password(
    user_id: int,
    payload: PasswordReset,
    db: Session = Depends(get_db)
):
    reset_password_service(db, user_id, payload.new_password)

@router.delete("/{user_id}", status_code=204, dependencies=[Depends(permission_required("delete_user"))])
def delete_existing_user(
    user_id: int,
    db: Session = Depends(get_db)
):
    user_crud.delete_user(db, user_id)

@router.post("/{user_id}/roles/{role_id}", response_model=UserResponse, status_code=200, dependencies=[Depends(permission_required("assign_role_to_user"))])
def assign_role_to_user_endpoint(user_id: int, role_id: int, db: Session = Depends(get_db)):
    db_user = user_crud.get_user(db, user_id)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    db_role = role_crud.get_role(db, role_id)
    if not db_role:
        raise HTTPException(status_code=404, detail="Role not found")
    user_crud.assign_role_to_user(db, db_user, db_role)
    return UserResponse.from_orm(db_user)

@router.delete("/{user_id}/roles/{role_id}", response_model=UserResponse, status_code=200, dependencies=[Depends(permission_required("remove_role_from_user"))])
def remove_role_from_user_endpoint(user_id: int, role_id: int, db: Session = Depends(get_db)):
    db_user = user_crud.get_user(db, user_id)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    db_role = role_crud.get_role(db, role_id)
    if not db_role:
        raise HTTPException(status_code=404, detail="Role not found")
    user_crud.remove_role_from_user(db, db_user, db_role)
    return UserResponse.from_orm(db_user)


