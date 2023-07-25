## Create a virtual environment

```sh
python3 -m venv .senv
source .senv/bin/activate
```

## To run the app

```sh
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
