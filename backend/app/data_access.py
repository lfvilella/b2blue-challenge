import typing

import sqlalchemy.orm
from . import models, schemas


class DataAccessException(Exception):
    pass


class ValidationError(DataAccessException):
    pass


class DoesNotExisit(DataAccessException):
    pass


def get_city_by_name(
    db: sqlalchemy.orm.Session, name: str, raise_error: bool = True
) -> models.City:
    db_city = db.query(models.City).filter_by(name=name).first()
    if not db_city and raise_error:
        raise DoesNotExisit("City does not exist")

    return db_city


def create_city(
    db: sqlalchemy.orm.Session, city: schemas.CityInput,
) -> models.City:

    db_city = get_city_by_name(db=db, name=city.name, raise_error=False)
    if db_city:
        raise ValidationError("City already exist")

    city = models.City(**city.dict())

    db.add(city)
    db.commit()
    db.flush()
    return city


def filter_city(
    db: sqlalchemy.orm.Session, name: str
) -> typing.List[models.City]:
    cities = (
        db.query(models.City).filter(models.City.name.contains(name)).all()
    )
    if not cities:
        raise DoesNotExisit("City does not exist")

    return cities
