# AIM: TO DESIGN AN E COMMERCE SYSTEM (AMAZON OR FLIPKART)

## REQUIREMENTS GATHERING

### FUNCTIONAL REQUIREMENTS
### NON-FUNCTIONAL REQUIREMENTS

## 6-7 HIGH LEVEL API DESIGN
```ruby
LOCAL HOST: https://127.0.0.1/products/:id/

HTTP METHOD: GET
HTTP REQUEST:
{
    id: ""
}
HTTP RESPONSE:
{
    product: {                                                                                                                                                                                                
        name: "",
        price: "",
        description: "",
        image_url: "amazon s3" # which uses blob (study)
    }
}
```

## DATABASE SELECTION + SCHEMA (HOMEWORK)
### CORE ENTITIES 
```RUBY
1. USER/CLIENT
2. PRODUCTS
3. CART
4. ORDERS
```

## HLD

## LLD
```RUBY
1. 
2.
```


## LEARNING OUTCOMES
- KAFKA
- BLOB
- ELASTIC SEARCH
- CDC PIPELINE

### ELASTIC SEARCH (VERY OPTIMIZED) -> bigger searching
- WORKS ON THE CONCEPT OF TOKENIZATION
- IT BREAKS THE DATA INTO TOKENS (CHUNKS)
- built on top of APACHE Lucene
- Stored as in Elastic DB: Token - Document Number - Frequency

QUES -> what is multi term searching (MTS) Famous Question for Interview


####  Streaming Service + Elastic Search + Watcher on DB (all happening through Pipeline - CDC Change Data Capture Pipeline)
1. If any request has to go to DB and any Change or search is made on DB -> A Watcher (other name -> Connector Service) will stream the changes to Streaming Service (in form of messages).
2. This Streaming Migrates the changes to Elastic Service.
3. This all is done through a pipeline known as CDC Pipeline
4. This CDC Pipeline is a Service Provided by **Kafka**
5. Kafka Pipeline stores the messages which is in form of tokens

#### Producer and Consumer Architecture of Kafka
- Majorily used for syncing the changes to multiple services
- For eg., At the checkout process of a user -> we need to stream inventory service, order service, and payment service all at a time. We need to make changes or check the 


### HOMEWORK: 
- REALTIME MEIN MULTIPLE USERS EK SHARED RESOURCE KAISE LENGE -> HOW DO WE HANDLE IT