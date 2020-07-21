""" Services

This module is reponsible to handle all interactions to the database
 and bussiness rules
"""

import typing

import environs
import dotenv
import requests
import sqlalchemy.orm

from . import models, schemas, cache

env = environs.Env()
dotenv.load_dotenv()

SECRET_KEY_RECAPTCHA = env("RECAPTCHA_SECRET_KEY", "")
VALIDATE_RECAPTCHA = env.bool("VALIDATE_RECAPTCHA", True)


class ServiceException(Exception):
    """ Service Exception

    This error is raised when data passed to the function is not valid
    """


class ValidationError(ServiceException):
    pass


_cache = cache.get_cache()


class CityService:
    """ City Service

    Service class designed to provide reusable functionalities relate to city
    """

    _db: sqlalchemy.orm.Session

    def __init__(self, db: sqlalchemy.orm.Session):
        """
        This constructor set database to others methods
        """
        self._db = db

    def __getstate__(self):
        """
        Prevent database connection to be cached
        """
        state = self.__dict__.copy()
        state.pop("_db")  # do not pickle _db session
        return state

    def get_city_by_id(self, name: str, state: str) -> models.City:
        """ Get City By ID

        This method is used to get City
        Args:
            name (str): City's name
            state (str): City's state
        Returns:
            Instance of models.City
        """

        db_city = (
            self._db.query(models.City)
            .filter_by(id=models.City.generate_id(name=name, state=state))
            .first()
        )

        return db_city

    def create_city(self, city: schemas.CityBase) -> models.City:
        """ Create City

        This method is used to create a City
        Args:
            city (schemas.CityInput): City's fields
        Returns:
            models.City
        """
        if None in city.dict().values():
            raise ValidationError("Invalid Post")

        db_city = self.get_city_by_id(name=city.name, state=city.state)
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
        """ Filter City

        This method is used to filter a Cities
        Args:
            name (str): City's name
        Returns:
            list of cities
        """
        query = self._db.query(models.City).filter(
            models.City.name.contains(name)
        )
        return query.all()

    @_cache.cache(ttl=60)
    def cached_filter_city(self, name: str):
        """ Cached Filter City

        Cached version of filter_city it prevents from hitting
         database for alredy cached queries
        Args:
            name (str): City's name
        Returns:
            list of cities
        """
        return self.filter_city(name)


class GoogleService:
    _RECAPTCHA_SITEVERIFY_URL = (
        "https://www.google.com/recaptcha/api/siteverify"
    )

    def validate_recaptcha(self, response_token: str) -> bool:
        if not VALIDATE_RECAPTCHA:
            return True

        data = {
            "response": response_token,
            "secret": SECRET_KEY_RECAPTCHA,
        }
        response = requests.post(self._RECAPTCHA_SITEVERIFY_URL, data=data)

        if response.json().get("success") is not True:
            return False

        return True
