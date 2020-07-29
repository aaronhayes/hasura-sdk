<h1 align="center">Hasura SDK</h1>
<h2 align="center">Hasura Schema and Metadata Node SDK</h2>

<p align="center">
 <a href="https://badge.fury.io/js/%40aaronhayes%2Fhasura-sdk"><img src="https://badge.fury.io/js/%40aaronhayes%2Fhasura-sdk.svg" alt="npm version" height="18"></a>
  <a href="LICENSE">
    <img src="https://img.shields.io/badge/license-MIT-yellow.svg" alt="license: MIT" />
  </a>
  <a href="https://prettier.io">
    <img src="https://img.shields.io/badge/code_style-prettier-ff69b4.svg" alt="code style: prettier" />
  </a>
  <a href="https://circleci.com/gh/aaronhayes/hasura-sdk">
    <img src="https://circleci.com/gh/aaronhayes/hasura-sdk.svg?style=svg"/>
  </a>
    <a href="https://github.com/aaronhayes/hasura-sdk/actions">
    <img src="https://github.com/aaronhayes/hasura-sdk/workflows/Tests/badge.svg?branch=master"/>
  </a>
  <a href="https://codecov.io/gh/aaronhayes/hasura-sdk">
    <img src="https://codecov.io/gh/aaronhayes/hasura-sdk/branch/master/graph/badge.svg" />
  </a>
</p>

---

Hasura Schema/Metadata API SDK. Written in TypeScript!

- ✅ 100% in TypeScript
- 🏋️ Uses Axios under the hood

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
        schedule: '* * * * *', // every minute
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

- [Full documentation](https://aaronhayes.github.io/hasura-sdk/)
- [Hasura Docs](https://hasura.io/docs/1.0/graphql/manual/api-reference/schema-metadata-api/index.html#metadata-apis)

## Supported APIs

We currently only support a small range of Hasura APIs. Be assured we working on adding more - if you need something be sure to create an issue!

| API                   | Support    |
| --------------------- | ---------- |
| Run SQL               | No         |
| Tables/Views          | No         |
| Custom SQL Functions  | No         |
| Relationships         | No         |
| Computed Fields       | No         |
| Permissions           | No         |
| <b>Event Triggers</b> | <b>Yes</b> |
| Remote Schemas        | No         |
| Query Collections     | No         |
| Custom Types          | No         |
| Actions               | No         |
| Manage Metadata       | No         |

## Give us a star!

Every star helps build a little more
