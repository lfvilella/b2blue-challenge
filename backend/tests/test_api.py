import datetime

import pytest
from fastapi.testclient import TestClient

from app import api
from app import models


client = TestClient(api.app)


def build_url(name=None):
    if name:
        return f"api/v.1/city?name={name}"

    return "api/v.1/city"


@pytest.fixture
def payload():
    return {
        "name": "Fake City",
        "population_count": 100,
        "avarage_income": 90.73,
        "state": "FakeState",
        "foundation_date": "2020-07-11",
    }


@pytest.mark.usefixtures("use_db")
@pytest.mark.usefixtures("mock_google_recaptcha")
class TestCreateCity:
    def test_when_valid_returns_created(self, payload):
        response = client.post(build_url(), json=payload)
        assert response.status_code == 201

    def test_when_valid_returns_complete_body(self, payload):
        response = client.post(build_url(), json=payload)
        payload["id"] = "fakestate - fakecity"
        assert response.json() == payload

    def test_when_valid_saves_on_db(self, payload, session_maker):
        assert session_maker().query(models.City).count() == 0

        client.post(build_url(), json=payload)

        assert session_maker().query(models.City).count() == 1
        city = session_maker().query(models.City).first()

        payload["id"] = "fakestate - fakecity"
        assert payload["name"] == city.name
        assert payload["population_count"] == city.population_count
        assert payload["avarage_income"] == city.avarage_income
        assert payload["state"] == city.state
        assert payload["foundation_date"] == str(city.foundation_date)

    def test_create_two_equal_cities(self, payload):
        response = client.post(build_url(), json=payload)
        assert response.status_code == 201

        response = client.post(build_url(), json=payload)
        assert response.json().get("detail") == "City already exist"

    def test_when_invalid_returns_invalid_post(self):
        response = client.post(build_url(), json="")

        assert not response.ok
        assert response.json().get("detail") == "Invalid Post"


@pytest.fixture
def create_db_city(payload, session_maker):
    def execute(name, state):
        session = session_maker()

        city = models.City(
            id=models.City.generate_id(name=name, state=state),
            name=name,
            population_count=payload["population_count"],
            avarage_income=payload["avarage_income"],
            state=state,
            foundation_date=datetime.date(2020, 7, 11),
        )

        session.add(city)
        session.commit()

        return city

    return execute


@pytest.mark.usefixtures("use_db")
@pytest.mark.usefixtures("mock_google_recaptcha")
class TestFilterCity:
    def test_when_city_matches_returns_ok(self, create_db_city):
        create_db_city(name="Sao Paulo", state="SP")
        create_db_city(name="Other", state="FakeState")
        request = client.get(build_url(name="sAO"))
        assert request.status_code == 200
        assert request.json() == [
            {
                "name": "Sao Paulo",
                "population_count": 100,
                "avarage_income": 90.73,
                "state": "SP",
                "foundation_date": "2020-07-11",
                "id": "sp - saopaulo",
            }
        ]

    def test_when_city_does_not_exist_returns_empity_list(
        self, create_db_city
    ):
        request = client.get(build_url(name="anything"))
        assert request.json() == []

    def test_use_cache_when_filtering(self, create_db_city):
        create_db_city(name="City One", state="State")
        r_1 = client.get(build_url(name="City"))

        create_db_city(name="City Two", state="State")
        r_2 = client.get(build_url(name="City"))

        assert r_1.json() == r_2.json()

    def test_when_creating_new_city_invalidate_existing_cache(
        self, payload, create_db_city
    ):
        create_db_city(name="City One", state="State")
        r_1 = client.get(build_url(name="City"))

        payload["name"] = "City Two"
        client.post(build_url(), json=payload)

        r_2 = client.get(build_url(name="City"))
        assert r_1.json() != r_2.json()


@pytest.mark.usefixtures("use_db")
class TestRobot:
    def test_returns_bad_request(self, payload):
        response = client.post(build_url(), json=payload)
        assert response.status_code == 400

    def test_returns_bot_message(self, payload):
        response = client.post(build_url(), json=payload)
        assert response.json() == {'detail': 'Hi robot!'}
