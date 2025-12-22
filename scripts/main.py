import os
import yaml

from core_engine import config, logger

def load_config():
    """Loads the application configuration from the YAML file."""
    config_path = os.path.join(os.path.dirname(__file__), 'config.yaml')
    if not os.path.exists(config_path):
        raise FileNotFoundError("Configuration file not found.")
    
    with open(config_path, 'r') as stream:
        try:
            config.load(yaml.safe_load(stream))
        except yaml.YAMLError as exc:
            logger.error("Failed to load configuration: %s", exc)

if __name__ == "__main__":
    load_config()
    logger.info("Application started.")