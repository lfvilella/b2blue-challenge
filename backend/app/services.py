import typing

import sqlalchemy.orm
from . import models, schemas, cache


class DataAccessException(Exception):
    pass


class ValidationError(DataAccessException):
    pass


class DoesNotExisit(DataAccessException):
    pass

service_cache = cache.get_cache()

class CityService:
    _db: sqlalchemy.orm.Session

    def __init__(self, db: sqlalchemy.orm.Session):
        self._db = db

    def get_city_by_name(
        self, name: str, raise_error: bool = True
    ) -> models.City:
        db_city = self._db.query(models.City).filter_by(name=name).first()
        if not db_city and raise_error:
            raise DoesNotExisit("City does not exist")

        return db_city

    def create_city(self, city: schemas.CityInput,) -> models.City:

        db_city = self.get_city_by_name(name=city.name, raise_error=False)
        if db_city:
            raise ValidationError("City already exist")

        city = models.City(**city.dict())

        self._db.add(city)
        self._db.commit()
        self._db.flush()

        self.cached_filter_city.invalidate_all()

        return city

    def filter_city(self, name: str) -> typing.List[models.City]:
        print('aquiuiquiquqiuq')
        return []
        query = self._db.query(models.City).filter(
            models.City.name.contains(name)
        )
        return query.all()

    @service_cache.cache()
    def cached_filter_city(self, name):
        return self.filter_city(name)
