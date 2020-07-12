import typing

import fastapi
import sqlalchemy.orm
from . import schemas, services, database, models

# Create DB
models.Base.metadata.create_all(bind=database.engine)

_VERSION = "/api/v.1"

app = fastapi.FastAPI(
    openapi_url=_VERSION + "/openapi.json",
    docs_url=_VERSION + "/docs",
)


# Dependency
def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.exception_handler(services.ServiceException)
def handle_services_error(
    request: fastapi.Request, exception: services.ServiceException
):
    if isinstance(exception, services.ValidationError):
        return fastapi.responses.JSONResponse(
            status_code=400, content={"detail": str(exception)}
        )

    raise exception


@app.post(_VERSION + "/city", status_code=201, response_model=schemas.City)
def create_city(
    city: schemas.CityInput,
    db: sqlalchemy.orm.Session = fastapi.Depends(get_db),
):
    service = services.CityService(db)
    return service.create_city(city=city)


@app.get(
    _VERSION + "/city",
    status_code=200,
    response_model=typing.List[schemas.City],
)
def filter_city(
    name: str, db: sqlalchemy.orm.Session = fastapi.Depends(get_db),
):
    service = services.CityService(db)
    return service.cached_filter_city(name=name)
