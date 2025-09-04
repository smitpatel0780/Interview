# from pydantic import BaseModel, EmailStr, validator, root_validator
# from typing import Optional

# STATE_DISTRICT_DATA = {
#     "Gujarat": ["Ahmedabad", "Surat", "Rajkot", "Vadodara"],
#     "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Nashik"],
#     "Rajasthan": ["Jaipur", "Udaipur", "Jodhpur", "Kota"],
# }


# class RegistrationBase(BaseModel):
#     firstName: str
#     lastName: str
#     phone: str
#     email: EmailStr
#     address: Optional[str] = None
#     state: Optional[str] = None
#     district: Optional[str] = None
#     city: Optional[str] = None
#     zip: Optional[str] = None

#     @validator("phone")
#     def phone_must_be_10_digits(cls, v: str) -> str:
#         digits = "".join(ch for ch in v if ch.isdigit())
#         if len(digits) != 10:
#             raise ValueError("Phone must contain exactly 10 digits")
#         return digits

#     @validator("zip")
#     def zip_must_be_6_digits(cls, v: Optional[str]) -> Optional[str]:
#         if v is None:
#             return v
#         digits = "".join(ch for ch in v if ch.isdigit())
#         if len(digits) != 6:
#             raise ValueError("Zip code must contain exactly 6 digits")
#         return digits

#     @root_validator
#     def validate_state_and_district(cls, values):
#         state = values.get("state")
#         district = values.get("district")

#         if state:
#             if state not in STATE_DISTRICT_DATA:
#                 raise ValueError(f"Invalid state '{state}'. Must be one of {list(STATE_DISTRICT_DATA.keys())}")

#             if district:
#                 if district not in STATE_DISTRICT_DATA[state]:
#                     raise ValueError(
#                         f"Invalid district '{district}' for state '{state}'. "
#                         f"Allowed districts: {STATE_DISTRICT_DATA[state]}"
#                     )

#         return values


# class RegistrationCreate(RegistrationBase):
#     pass


# class RegistrationUpdate(BaseModel):
#     firstName: Optional[str] = None
#     lastName: Optional[str] = None
#     phone: Optional[str] = None
#     email: Optional[EmailStr] = None
#     address: Optional[str] = None
#     state: Optional[str] = None
#     district: Optional[str] = None
#     city: Optional[str] = None
#     zip: Optional[str] = None

#     @validator("phone")
#     def phone_if_present_is_10_digits(cls, v: Optional[str]) -> Optional[str]:
#         if v is None:
#             return v
#         digits = "".join(ch for ch in v if ch.isdigit())
#         if len(digits) != 10:
#             raise ValueError("Phone must contain exactly 10 digits")
#         return digits

#     @validator("zip")
#     def zip_if_present_is_6_digits(cls, v: Optional[str]) -> Optional[str]:
#         if v is None:
#             return v
#         digits = "".join(ch for ch in v if ch.isdigit())
#         if len(digits) != 6:
#             raise ValueError("Zip code must contain exactly 6 digits")
#         return digits

#     @root_validator
#     def validate_state_and_district(cls, values):
#         state = values.get("state")
#         district = values.get("district")

#         if state:
#             if state not in STATE_DISTRICT_DATA:
#                 raise ValueError(f"Invalid state '{state}'. Must be one of {list(STATE_DISTRICT_DATA.keys())}")

#             if district:
#                 if district not in STATE_DISTRICT_DATA[state]:
#                     raise ValueError(
#                         f"Invalid district '{district}' for state '{state}'. "
#                         f"Allowed districts: {STATE_DISTRICT_DATA[state]}"
#                     )

#         return values


# class Registration(RegistrationBase):
#     id: int

#     class Config:
#         orm_mode = True
from pydantic import BaseModel, EmailStr, validator, model_validator
from typing import Optional

STATE_DISTRICT_DATA = {
    "Gujarat": ["Ahmedabad", "Surat", "Rajkot", "Vadodara"],
    "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Nashik"],
    "Rajasthan": ["Jaipur", "Udaipur", "Jodhpur", "Kota"],
}


class RegistrationBase(BaseModel):
    firstName: str
    lastName: str
    phone: str
    email: EmailStr
    address: Optional[str] = None
    state: Optional[str] = None
    district: Optional[str] = None
    city: Optional[str] = None
    zip: Optional[str] = None

    @validator("phone")
    def phone_must_be_10_digits(cls, v: str) -> str:
        digits = "".join(ch for ch in v if ch.isdigit())
        if len(digits) != 10:
            raise ValueError("Phone must contain exactly 10 digits")
        return digits

    @validator("zip")
    def zip_must_be_6_digits(cls, v: Optional[str]) -> Optional[str]:
        if v is None:
            return v
        digits = "".join(ch for ch in v if ch.isdigit())
        if len(digits) != 6:
            raise ValueError("Zip code must contain exactly 6 digits")
        return digits

    @model_validator(mode="after")
    def validate_state_and_district(cls, values):
        state = values.state
        district = values.district

        if state:
            if state not in STATE_DISTRICT_DATA:
                raise ValueError(f"Invalid state '{state}'. Must be one of {list(STATE_DISTRICT_DATA.keys())}")

            if district and district not in STATE_DISTRICT_DATA[state]:
                raise ValueError(
                    f"Invalid district '{district}' for state '{state}'. "
                    f"Allowed districts: {STATE_DISTRICT_DATA[state]}"
                )

        return values


class RegistrationCreate(RegistrationBase):
    pass


class RegistrationUpdate(BaseModel):
    firstName: Optional[str] = None
    lastName: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[EmailStr] = None
    address: Optional[str] = None
    state: Optional[str] = None
    district: Optional[str] = None
    city: Optional[str] = None
    zip: Optional[str] = None

    @validator("phone")
    def phone_if_present_is_10_digits(cls, v: Optional[str]) -> Optional[str]:
        if v is None:
            return v
        digits = "".join(ch for ch in v if ch.isdigit())
        if len(digits) != 10:
            raise ValueError("Phone must contain exactly 10 digits")
        return digits

    @validator("zip")
    def zip_if_present_is_6_digits(cls, v: Optional[str]) -> Optional[str]:
        if v is None:
            return v
        digits = "".join(ch for ch in v if ch.isdigit())
        if len(digits) != 6:
            raise ValueError("Zip code must contain exactly 6 digits")
        return digits

    @model_validator(mode="after")
    def validate_state_and_district(cls, values):
        state = values.state
        district = values.district

        if state:
            if state not in STATE_DISTRICT_DATA:
                raise ValueError(f"Invalid state '{state}'. Must be one of {list(STATE_DISTRICT_DATA.keys())}")

            if district and district not in STATE_DISTRICT_DATA[state]:
                raise ValueError(
                    f"Invalid district '{district}' for state '{state}'. "
                    f"Allowed districts: {STATE_DISTRICT_DATA[state]}"
                )

        return values


class Registration(RegistrationBase):
    id: int

    class Config:
        orm_mode = True
