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
        'host': 'localhost',
        'port': 9200,
        'scheme': 'http'
    }]
)


index_name = 'crime-data'
mapping = {
    'mappings': {
        'properties': {
            'Year': {'type': 'integer'},
            # add other fields here as necessary
        }
    }
}


def delete_data():
    if es.indices.exists(index=index_name):
        es.indices.delete(index=index_name)


def load_data():
    # Create index with correct mapping if it doesn't exist
    if not es.indices.exists(index=index_name):
        es.indices.create(index=index_name, body=mapping)

    # Open your csv file
    with open('./crime.csv', newline='') as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            row['Year'] = int(row['Year'])
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


@app.get("/delete-data")
async def delete_data_route():
    if es.ping():  # Test connection
        delete_data()  # Delete data
        return {"message": "Data deleted"}
    else:
        return {"message": "Elasticsearch is not available"}


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


@app.get("/crimes/year-range")
async def get_year_range():
    query = {
        "aggs": {
            "min_year": {
                "min": {"field": "Year"}
            },
            "max_year": {
                "max": {"field": "Year"}
            }
        }
    }
    try:
        # size=0 because we only care about the aggregation result
        response = es.search(index="crime-data", body=query, size=0)
        return {
            'min_year': response['aggregations']['min_year']['value'],
            'max_year': response['aggregations']['max_year']['value']
        }
    except NotFoundError:
        return {"error": "Index not found"}
    except RequestError as e:
        print(str(e))
        return {"error": "Error in the request. Please check your query."}
    except Exception as e:
        print(str(e))
        return {"error": str(e)}


@app.get("/population")
async def get_population():
    query = {
        "_source": ["Year", "Population"],
        "query": {
            "match_all": {}
        },
        "sort": [
            {
                "Year": {"order": "asc"}
            }
        ]
    }
    try:
        response = es.search(index="crime-data", body=query, size=10000)
        return response['hits']
    except NotFoundError:
        raise HTTPException(status_code=404, detail="Index not found")
    except RequestError:
        raise HTTPException(
            status_code=400, detail="Error in the request. Please check your query.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/crimes/{year}")
async def get_crimes_by_year(year: int):
    query = {
        "_source_excludes": ["*rate*"],
        "query": {
            "match": {
                "Year": year
            }
        },
    }
    try:
        response = es.search(index="crime-data", body=query, size=10000)
        # print(response)
        return response['hits']
    except NotFoundError:
        raise HTTPException(status_code=404, detail="Index not found")
    except RequestError:
        raise HTTPException(
            status_code=400, detail="Error in the request. Please check your query.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
