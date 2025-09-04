from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from fastapi import HTTPException, status
from models.registration import Registration as RegistrationModel
from schemas.registration import RegistrationCreate, RegistrationUpdate

def create_registration(db: Session, reg: RegistrationCreate) -> RegistrationModel:
    existing = db.query(RegistrationModel).filter(
        (RegistrationModel.phone == reg.phone) | 
        (RegistrationModel.email == reg.email)
    ).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Phone or Email already exists"
        )

    db_reg = RegistrationModel(**reg.dict())
    db.add(db_reg)
    db.commit()
    db.refresh(db_reg)
    return db_reg

def get_registrations(db: Session, skip: int = 0, limit: int = 100):
    return db.query(RegistrationModel).offset(skip).limit(limit).all()

def get_registration(db: Session, reg_id: int):
    return db.query(RegistrationModel).filter(RegistrationModel.id == reg_id).first()

def update_registration(db: Session, reg_id: int, payload: RegistrationUpdate):
    db_reg = get_registration(db, reg_id)
    if not db_reg:
        raise HTTPException(status_code=404, detail="Registration not found")

    for field, value in payload.dict(exclude_unset=True).items():
        setattr(db_reg, field, value)

    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Phone or Email already exists"
        )
    db.refresh(db_reg)
    return db_reg
