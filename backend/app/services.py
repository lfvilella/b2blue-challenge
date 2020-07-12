import typing

import sqlalchemy.orm
from . import models, schemas, cache


class ServiceException(Exception):
    pass


class ValidationError(ServiceException):
    pass


_cache = cache.get_cache()


class CityService:

    _db: sqlalchemy.orm.Session

    def __init__(self, db: sqlalchemy.orm.Session):
        self._db = db

    def __getstate__(self):
        state = self.__dict__.copy()
        state.pop("_db")  # do not pickle _db session
        return state

    def get_city_by_name(
        self, name: str, state: str, raise_error: bool = True
    ) -> models.City:

        db_city = (
            self._db.query(models.City)
            .filter_by(id=models.City.generate_id(name=name, state=state))
            .first()
        )

        return db_city

    def create_city(self, city: schemas.CityInput,) -> models.City:
        if None in city.dict().values():
            raise ValidationError("Invalid Post")

        db_city = self.get_city_by_name(
            name=city.name, state=city.state, raise_error=False
        )
        if db_city:
            raise ValidationError("City already exist")

        city = models.City(**city.dict())
        city.id = models.City.generate_id(name=city.name, state=city.state)

        self._db.add(city)
        self._db.commit()
        self._db.flush()

        self.cached_filter_city.invalidate_all()

        return city

    def filter_city(self, name: str) -> typing.List[models.City]:
        query = self._db.query(models.City).filter(
            models.City.name.contains(name)
        )
        return query.all()

    @_cache.cache(ttl=60)
    def cached_filter_city(self, name):
        return self.filter_city(name)
