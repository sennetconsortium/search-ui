This is a starter template for [Learn Next.js](https://nextjs.org/learn).# bcrf

For Local Development:

Import the search-ui submodule by running:

```
$ git submodule update --init --remote
```

start ingest-api  (manually)\
*Note: For the time being for local development change the variable `GLOBUS_CLIENT_APP_URI` in `app.cfg` to
be 'http://localhost:3000/'

```
$ ingest-api/src/python app.py
```

search-api

```
$ ./search-api-docker.sh localhost start
```

to start

```
$ npm install
$ npm run dev
```


