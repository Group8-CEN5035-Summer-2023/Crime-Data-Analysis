import csv
from elasticsearch import Elasticsearch
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from elasticsearch import NotFoundError, RequestError
from typing import List
from pydantic import BaseModel

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Allow requests from this origin
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods
    allow_headers=["*"],  # Allow all headers
)

es = Elasticsearch(
    hosts=[{
        'host': 'elasticsearch',
        'port': 9200,
        'scheme': 'http'
    }]
)


index_name = 'crime-data'


def load_data():
    if not es.indices.exists(index=index_name):
        # Open your csv file
        with open('crime.csv', newline='') as csvfile:
            reader = csv.DictReader(csvfile)
            for row in reader:
                # Index each row into Elasticsearch
                es.index(index=index_name, body=row)


@app.get("/")
def read_root():
    if es.ping():  # Test connection
        return {"Elasticsearch": "Available"}
    else:
        return {"Elasticsearch": "Unavailable"}


@app.get("/load-data")
async def load_data_route():
    if es.ping():  # Test connection
        load_data()
    else:
        return {"message": "Elasticsearch is not available"}
    return {"message": "Data loaded"}


@app.get("/crimes")
def get_all_crimes():
    query = {
        "query": {
            "match_all": {}
        }
    }
    try:
        response = es.search(index="crime-data", body=query)
        # The actual data is inside the 'hits' key
        return response['hits']
    except NotFoundError:
        return {"error": "Index not found"}
    except RequestError:
        return {"error": "Error in the request. Please check your query."}
    except Exception as e:
        # Catch any other exceptions
        return {"error": str(e)}


class SearchBody(BaseModel):
    query: str


@app.post("/search-crimes/")
def search_crimes(body: SearchBody):
    query = {
        "query": {
            "query_string": {
                "query": body.query
            }
        }
    }
    try:
        response = es.search(index="crime-data", body=query)
        return response['hits']
    except NotFoundError:
        return {"error": "Index not found"}
    except RequestError:
        return {"error": "Error in the request. Please check your query."}
    except Exception as e:
        return {"error": str(e)}


@app.get("/aggregate-crimes/{field}")
def aggregate_crimes(field: str):
    query = {
        "aggs": {
            "crime_counts": {
                "terms": {
                    "field": field
                }
            }
        }
    }
    try:
        response = es.search(index="crime-data", body=query)
        return response['aggregations']
    except NotFoundError:
        return {"error": "Index not found"}
    except RequestError as e:
        print(e.info)
        return {"error": "Error in the request. Please check your query."}
    except Exception as e:
        return {"error": str(e)}
