import pydantic_sqlalchemy
from . import models


CityInput = pydantic_sqlalchemy.sqlalchemy_to_pydantic(
    models.City, exclude={"id"}
)


class City(CityInput):
    id: str
