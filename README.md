# Hasura Schema/Metadata SDK

- ✅ 100% in TypeScript
- 🏋️ Lightweight

Hasura Schema/Metadata API SDK. Written in TypeScript!

## Installation

### yarn

- `yarn add @aaronhayes/hasura-sdk`

### npm

- `npm install @aaronhayes/hasura-sdk`

## Usage

```JavaScript
import Hasura from '@aaronhayes/hasura-sdk`;

// Note: just the base url - don't add /v1/graphql!
const HASURA_GRAPHQL_ENDPOINT = 'http://localhost:8080'; 

// Hint: use process.env.HASURA_GRAPHQL_ADMIN_SECRET
const HASURA_GRAPHQL_ADMIN_SECRET = 'yousecret'; 

const hasura = new Hasura({
    endpoint: HASURA_GRAPHQL_ENDPOINT,
    adminSecret: HASURA_GRAPHQL_ADMIN_SECRET
});

// Using Async/Await Functions
try {
    const resp = await hasura.createCronTrigger({
        name: 'newcronjob',
        schedule: '* * * * *',
        webhook: '{{EVENT_BASE_URL}}/cron',
        payload: {
            hello: "world"
        },
        comment: 'test cron job every minute'
    });
} catch (error) {
    // handle error
}

// Using Promises
hasura.createCronTrigger({
    name: 'newcronjob',
    schedule: '* * * * *',
    webhook: '{{EVENT_BASE_URL}}/cron',
    payload: {
        hello: "world"
    },
    comment: 'test cron job every minute'
}).then(data => {
    // axios response
}).catch(error => {
    // handle error
});
```

## Schema/Metadata API References

Full for documentation see [Hasura Docs](https://hasura.io/docs/1.0/graphql/manual/api-reference/schema-metadata-api/index.html#metadata-apis)

## Give us a star!

Every start helps build a little more
