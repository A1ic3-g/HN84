#!/usr/bin/env python3

import connexion

from swagger_server import encoder

def main():
    app = connexion.App(__name__, specification_dir='./swagger/')
    app.app.json_encoder = encoder.JSONEncoder
    app.add_api('swagger.yaml', arguments={'title': 'HackPac - OpenAPI 3.0'}, pythonic_params=True)

    # Disable CORS for all localhost connections
    app.app.config['CORS_HEADERS'] = 'Content-Type'  # Optional: You can set specific CORS headers if needed
    app.run(port=8080)

if __name__ == '__main__':
    main()