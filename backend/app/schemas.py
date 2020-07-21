import pydantic_sqlalchemy
from . import models

CityBase = pydantic_sqlalchemy.sqlalchemy_to_pydantic(
    models.City, exclude={"id"}
)


class CityInput(CityBase):
    recaptcha: str


class City(CityBase):
    id: str
