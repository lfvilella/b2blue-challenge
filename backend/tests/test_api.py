import pytest
from fastapi.testclient import TestClient

from app import api
from app import models


client = TestClient(api.app)


def build_url():
    return "api/v.1/city"


@pytest.fixture
def payload():
    return {
        "name": "Fake City",
        "population_count": 100,
        "avarage_income": 90.73,
        "state": "FakeState",
        "foundation_date": "2020-07-11"
    }


@pytest.mark.usefixtures("use_db")
class TestCreateCity:
    def test_when_valid_returns_created(self, payload):
        response = client.post(build_url(), json=payload)
        assert response.status_code == 201

    def test_when_valid_returns_complete_body(self, payload):
        response = client.post(build_url(), json=payload)
        payload['id'] = 'fakestate - fakecity'
        assert response.json() == payload

    def test_when_valid_saves_on_db(self, payload, session_maker):
        assert session_maker().query(models.City).count() == 0

        client.post(build_url(), json=payload)

        assert session_maker().query(models.City).count() == 1
        city = session_maker().query(models.City).first()

        payload['id'] = 'fakestate - fakecity'
        assert payload["name"] == city.name
        assert payload["population_count"] == city.population_count
        assert payload["avarage_income"] == city.avarage_income
        assert payload["state"] == city.state
        assert payload["foundation_date"] == str(city.foundation_date)

    def test_create_two_equal_cities(self, payload):
        response = client.post(build_url(), json=payload)
        assert response.status_code == 201

        response = client.post(build_url(), json=payload)
        assert response.json().get('detail') == 'City already exist'

    def test_when_invalid_returns_invalid_post(self):
        response = client.post(build_url(), json='')

        assert not response.ok
        assert response.json().get('detail') == 'Invalid Post'


class TestFilterCity:
    pass
