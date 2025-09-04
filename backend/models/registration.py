from sqlalchemy import Column, Integer, String, UniqueConstraint
from db.database import Base

class Registration(Base):
    __tablename__ = "registrations"

    id = Column(Integer, primary_key=True, index=True)
    firstName = Column(String, nullable=False)
    lastName = Column(String, nullable=False)
    phone = Column(String, nullable=False, unique=True, index=True)
    email = Column(String, nullable=False, unique=True, index=True)
    address = Column(String)
    state = Column(String)
    district = Column(String)
    city = Column(String)
    zip = Column(String)

    __table_args__ = (
        UniqueConstraint('phone', name='uq_reg_phone'),
        UniqueConstraint('email', name='uq_reg_email'),
    )
