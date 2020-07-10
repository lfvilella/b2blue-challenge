from beaker.cache import CacheManager
from beaker.util import parse_cache_config_options

cache_opts = {
    "cache.type": "dbm",
    "cache.data_dir": "./tmp/cache",
}


def get_cache_manager():
    return CacheManager(**parse_cache_config_options(cache_opts))
