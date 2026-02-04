# AIM: TO DESIGN A SOCIAL-MEDIA PLATFORM (INSTAGRAM/FACEBOOK)

## Functional Requirements
1. User Registeration
2. Content Posting 
3. Follow each other (or send friend requests)
4. like or comment feature
5. View the Feed

## Non-Functional Requirements
1. Scalability: 500M DAU (Daily Active Users)
2. Consistency & Availability: Must be highly available
3. Latency: 500ms to upload (DB Latency + Application Latency + all other latencies)

## Core Entities
1. Users
2. Posts
3. Followers
4. Likes and Comments
5. Feeds

## API Design
1. User On Boarding
- HOME TASK: How to Make Session secure if user is forging JWT.
    ```ruby
    Registeration: POST /api/v1/users/register
    ```

2. User Posts
```ruby
POST /api/v1/user_id/posts
```

## Database Schema Design

## HLD

## LLD

## EXTRA TOPICS:
```ruby
1. Fanout model / Architecture (Social Media Feed)
2. Kafka: Producer as a Temp Buffer
    - Producer / Consumer Architecture
    - PUB / SUB Model
3. Materializer: Temp Buffer Storage
```

#### PUB / SUB
- One Publishes Other Subscribes to it for data.

#### FanOut Model
- Gives Push and Pull Model to stack up the feed
- If number of followers is less, use Push model (Fanout-on-Write)
- If number of followers is more, use Pull model (Fanout-on-Read) 