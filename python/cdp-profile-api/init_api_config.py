from decouple import Config, RepositoryEnv

# Path to your .env file
ENV_PATH = "dev.env"

# Usage
cdp_api_config = Config(RepositoryEnv(ENV_PATH))

print("\n ------------ load_latest_env -----------------")
print( "cdp_host " + cdp_api_config('cdp_host'))
print( "tokenkey " + cdp_api_config('tokenkey'))
print( "tokenvalue " + cdp_api_config('tokenvalue'))
print("---------------------------------------------- \n")

