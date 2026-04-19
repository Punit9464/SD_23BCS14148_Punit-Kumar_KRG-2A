# EVENT DRIVEN SYSTEMS:
- Latency Is Introduced here if background tasks took time.

## Solution: Broker System
1. Apache Kafka
2. Rabbit MQ

They both uses a queue to store the messages (request)

### APACHE KAFKA 
- A distributed event streaming platform
- follows dumb broker and smart consumer idea
- **Retention** = stores the messages after requests are served for a particular time period.
- Pull model

Why Dumb Broker and Smart Consumer ? `->`

`-` **ARCHITECTURE**

```ruby
PRODUCER
    TOPIC: Specialized channel or directory where messages are published.

    PARTITIONING: A specific topic can be further divided and can be stored horizontally on multiple servers

    OFFSET: Unique message id in a partition

CONSUMER
```

<br>

### RABBIT MQ

- devloped by Rabbit Technologies, now managed by VMWare.
- Build on ErLang
- Push Model

`-` **Architecture**
```ruby
PRODUCER -> Message Producer

EXCHANGE -> How the message is been exchanged among the consumers
    1. DIRECT -> Uses key: INDIA.EXPRESS
    2. FANOUT -> Does not use any key just broadcasts the message (like fanout model)
    3. TOPIC (PATTERN) -> uses certain patterns matches
        A. *: Message is matched with one word only.
        B. #: Message is matched with one or more words.

        eg: INDIA.#
            *.EXPRESS.* 

BINDING ->
    A. Routing Key : Key to show the way
            eg: "COUNTRY.DELIVERY.TYPE_OF_ITEM"
                "INDIA.EXPRESS.ELECTRONICS"
    B. Binding Key : Helps to bind that in which queue message should be binded.

QUEUE -> Specialized Queue for Storing Data

CONSUMER -> Message Consumer
```