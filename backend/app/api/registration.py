from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List, Dict
from services.registration import (
    create_registration as svc_create,
    get_registrations as svc_list,
    update_registration as svc_update,
)
from schemas.registration import Registration, RegistrationCreate, RegistrationUpdate
from db.database import get_db

router = APIRouter(prefix="/registrations", tags=["Registrations"])

@router.post("/", response_model=Registration)
def create_registration(reg: RegistrationCreate, db: Session = Depends(get_db)):
    return svc_create(db, reg)

@router.get("/", response_model=List[Registration])
def list_registrations(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return svc_list(db, skip=skip, limit=limit)

@router.put("/{reg_id}", response_model=Registration)
def edit_registration(reg_id: int, payload: RegistrationUpdate, db: Session = Depends(get_db)):
    return svc_update(db, reg_id, payload)
