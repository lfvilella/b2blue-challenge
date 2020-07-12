import pickle
import redis
import redis_cache


def get_cache():
    """ Get Cache

    This method is used to get the cache manager
    Returns:
        The returns is a Redis cache
    """
    client = redis.StrictRedis(host="redis_host")
    return redis_cache.RedisCache(
        redis_client=client,
        serializer=pickle.dumps,
        deserializer=pickle.loads,
    )
