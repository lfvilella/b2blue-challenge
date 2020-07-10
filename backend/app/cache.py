import pickle

from redis import StrictRedis
from redis_cache import RedisCache


client = StrictRedis(host="redis_host", decode_responses=True)


def get_cache():
    return RedisCache(redis_client=client, serializer=pickle.dumps, deserializer=pickle.loads)
