import typing

import fastapi
import sqlalchemy.orm
from . import schemas, data_access, database, models


# Create DB
models.Base.metadata.create_all(bind=database.engine)

_VERSION = "/api/v.1"

app = fastapi.FastAPI()


# Dependency
def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.exception_handler(data_access.DataAccessException)
def handle_data_access_error(
    request: fastapi.Request, exception: data_access.DataAccessException
):
    if isinstance(exception, data_access.ValidationError):
        return fastapi.responses.JSONResponse(
            status_code=400, content={"detail": str(exception)}
        )

    if isinstance(exception, data_access.DoesNotExisit):
        return fastapi.responses.JSONResponse(
            status_code=404, content={"detail": str(exception)}
        )

    raise exception


@app.post(_VERSION + "/city", status_code=201, response_model=schemas.City)
def create_city(
    city: schemas.CityInput,
    db: sqlalchemy.orm.Session = fastapi.Depends(get_db),
):
    return data_access.create_city(db=db, city=city)


@app.get(
    _VERSION + "/city",
    status_code=200,
    response_model=typing.List[schemas.City],
)
def filter_city(
    name: str, db: sqlalchemy.orm.Session = fastapi.Depends(get_db),
):
    return data_access.filter_city(db=db, name=name)
