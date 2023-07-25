from elasticsearch import Elasticsearch
from fastapi import FastAPI

app = FastAPI()

es = Elasticsearch(
    hosts=[{
        'host': 'elasticsearch',
        'port': 9200,
        'scheme': 'http'
    }]
)


@app.get("/")
def read_root():
    if es.ping():  # Test connection
        return {"Elasticsearch": "Available"}
    else:
        return {"Elasticsearch": "Unavailable"}
