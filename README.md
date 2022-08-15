# SenNet Data Portal

## Working with submodule

This repository relies on the [search-ui](https://github.com/dbmi-pitt/search-ui) as a submodule to function. The
file `.gitmodules` contains the configuration for the URL and specific branch of the submodule that is to be used. Once
you already have cloned this repository and switched to the target branch, to load the latest `search-ui` submodule:

```
git submodule update --init --remote
```

## For Local Development

Create a file called `.env.local` at the root of the project with the same structure as `sample.env`. Modify the
variables as needed.

### Required services

The `ingest-api` must be running locally and for the time being you must change the variable `GLOBUS_CLIENT_APP_URI`
in `app.cfg` to be 'http://localhost:3000/' for redirects to work properly. You can start the `ingest-api` with the
following command:

```
$ ingest-api/src/python app.py
```

The `search-api` and `entity-api` must be running via Docker to avoid CORS related problems. You can start the `search-api` with the
following command:

```
$ ./search-api-docker.sh localhost start
```

To start the application run the following commands:\
 **_Note:_** This application requires Node.js 18 or later

```
$ npm install
$ npm run dev
```

## Docker deployment

For docker deployment, first create `.env` file base on `example.env` file in the same `src` directory.

### Docker build for DEV development

There are a few configurable environment variables to keep in mind:

- `HOST_UID`: the user id on the host machine to be mapped to the container. Default to 1000 if not set or null.
- `HOST_GID`: the user's group id on the host machine to be mapped to the container. Default to 1000 if not set or null.

```
cd docker
./docker-development.sh [check|config|build|start|stop|down]
```

### Docker build for deployment on TEST/STAGE/PROD

```
cd docker
docker pull hubmap/portal-ui:1.0.0 (replace with the actual released version number)
./docker-deployment.sh [start|stop|down]
```

