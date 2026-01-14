# AIM: DESIGN A URL SHORTNER SYSTEM

## Requirements Gathering
### Funtional Requirements
```ruby
    1. Given a Long URL -> Short URL.
        - Custom URL option for Premium Users
        - Expiry Date (Optional in nature)
    2. Given a Short URL -> Redirect -> Long URL.
    3. Every Shortnered URL should be unique.
```
### Non - Functional Requirements
```ruby
    1. LATENCY (URL_CREATION, URL_REDIRECTION): APPROX. 20 MS
    2. 100 MILLION DAILY ACTIVE USERS, ONLY 1 MILLION PERFORMING URL SHORTENING
    3. AVAILABILITY: 24 X 7
    4. CONSISTENCY: 100 MILLION USER: CONSISTENT
    5. SCALABILITY: 
```
### TOOLS USED: POSTMAN, DRAW.IO, LUCID CHART, EXCELIDRAW

## API Design (URL Shortner)
- Some Extra Knowledge
```js
    1. GET: RETRIEVE DATA FROM 
    2. PUT / PATCH: UPDATE
    3. POST: INSERT
    4. DELETE: REMOVE
```

- DESIGN:
```ruby
LOCAL HOST: https://127.0.0.1/shorten

APP.ROUTE("/shorten")

HTTP METHOD: POST
HTTP REQUEST:
{
    url: "LONG_URL"
}
HTTP RESPONSE:
{
    short_url: "SHORT_URL",
    short_code: "SHORT_CODE"
}


APP.ROUTE("/:short_code")
HTTP METHOD: GET
HTTP RESPONSE: 
{
    url: "LONG_URL"
}
```

## HLD of URL Shortner

```RUBY
NOTE: AVOID DATABASE LOOK UP OPERATION TO IMPROVE LATENCY
```

## LLD of URL Shortner
