import sqlalchemy

from .database import Base


class City(Base):
    __tablename__ = "cities"

    id = sqlalchemy.Column(
        sqlalchemy.String, primary_key=True, unique=True, index=True,
    )
    name = sqlalchemy.Column(sqlalchemy.String)
    population_count = sqlalchemy.Column(sqlalchemy.Integer)
    avarage_income = sqlalchemy.Column(sqlalchemy.Float)
    state = sqlalchemy.Column(sqlalchemy.String)
    foundation_date = sqlalchemy.Column(sqlalchemy.Date)

    @staticmethod
    def generate_id(name, state):
        return "".join(state.split() + [" - "] + name.split()).lower()
