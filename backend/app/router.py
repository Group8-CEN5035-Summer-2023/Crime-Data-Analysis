import csv
from elasticsearch import Elasticsearch
from elasticsearch import NotFoundError, RequestError

from fastapi import FastAPI, HTTPException, APIRouter

router = APIRouter()

# CORS middleware
index_name = 'crime-data'
mapping = {
    'mappings': {
        'properties': {
            'Year': {'type': 'integer'},
        }
    }
}

# Elasticsearch connection object
es = Elasticsearch(
    hosts=[{
        'host': 'localhost',
        'port': 9200,
        'scheme': 'http'
    }]
)

def delete_data():
    if es.indices.exists(index=index_name):
        es.indices.delete(index=index_name)


def load_data():
    # Create index with correct mapping if it doesn't exist
    if not es.indices.exists(index=index_name):
        es.indices.create(index=index_name, body=mapping)

    with open('./crime.csv', newline='') as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            row['Year'] = int(row['Year'])
            es.index(index=index_name, body=row)


# Elasticsearch health check
@router.get("/heartbeat")
def elasticsearch_heartbeat():
    """
    Elasticsearch health check endpoint

    Checks if elasticsearch is up and returns availability.
    """
    if es.ping():  # Test connection
        return {"Elasticsearch": "Available"}
    else:
        return {"Elasticsearch": "Unavailable"}

# Load csv data into elasticsearch container
@router.get("/load-data")
async def load_data_route():
    """
    Load data from csv into elasticsearch
    """
    if es.ping():  # Test connection
        load_data()
    else:
        return {"message": "Elasticsearch is not available"}
    return {"message": "Data loaded"}

# Delete data stored in elasticsearch container
@router.get("/delete-data")
async def delete_data_route():
    """
    Delete data from elasticsearch
    """
    if es.ping():  # Test connection
        delete_data()  # Delete data
        return {"message": "Data deleted"}
    else:
        return {"message": "Elasticsearch is not available"}

# Fetch All Crimes
@router.get("/crimes")
def get_all_crimes():
    """
    Fetch All Crimes
    """
    query = {
        "query": {
            "match_all": {}
        }
    }
    try:
        response = es.search(index="crime-data", body=query, size=10000)
        # The actual data is inside the 'hits' key
        return response['hits']
    except NotFoundError:
        return {"error": "Index not found"}
    except RequestError:
        return {"error": "Error in the request. Please check your query."}
    except Exception as e:
        # Catch any other exceptions
        return {"error": str(e)}

# Fetches data with year, population, violent crime total, and property crime total fields
@router.get("/crime-trends")
async def get_population_crime_trends():
    """
    Fetches crime trends data

    Includes year, population, violent crime total, property crime total, and total crime
    """
    query = {
        "_source": ["Year", "Population", "Violent crime total", "Property crime total"],
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

# Fetches year range from data in elasticsearch
@router.get("/crimes/year-range")
async def get_year_range():
    """
    Fetches year range from data available
    """
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

# Fetches data by requested year
@router.get("/crimes/{year}")
async def get_crimes_by_year(year: int):
    """
    Fetches crime by year

    Parameters:
    - **year**: The year whose crime data is required.
    """
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

