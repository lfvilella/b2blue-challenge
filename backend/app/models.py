import sqlalchemy
import uuid

from .database import Base


class City(Base):
    __tablename__ = "cities"

    id = sqlalchemy.Column(
        sqlalchemy.String,
        primary_key=True,
        unique=True,
        index=True,
        default=lambda: str(uuid.uuid4()),
    )
    name = sqlalchemy.Column(sqlalchemy.String)
    population_count = sqlalchemy.Column(sqlalchemy.Integer)
    avarage_income = sqlalchemy.Column(sqlalchemy.Float)
    country = sqlalchemy.Column(sqlalchemy.String)
    state = sqlalchemy.Column(sqlalchemy.String)
    foundation_date = sqlalchemy.Column(sqlalchemy.Date)
