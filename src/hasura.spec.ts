// tslint:disable:no-expression-statement no-object-mutation
import test from 'ava';
import Hasura from './hasura';

const ENDPOINT = process.env.HASURA_ENDPOINT ?? 'http://localhost:8080';
const ADMIN_SECRET = process.env.HASURA_ADMIN_SECRET ?? 'testsecret';

test('constructor', (t) => {
  const hasura = new Hasura({
    endpoint: ENDPOINT,
    adminSecret: ADMIN_SECRET
  });

  t.is(hasura.endpoint, ENDPOINT);
  t.is(hasura.adminSecret, ADMIN_SECRET);
  t.is(hasura.queryEndpoint, `${ENDPOINT}/v1/query`);
});

test('getHeaders', (t) => {
  const hasura = new Hasura({
    endpoint: ENDPOINT,
    adminSecret: ADMIN_SECRET
  });

  t.deepEqual(hasura.getHeaders(), { 'x-hasura-admin-secret': ADMIN_SECRET });
});

test('createEventTrigger Error', async (t) => {
  const hasura = new Hasura({
    endpoint: ENDPOINT,
    adminSecret: ADMIN_SECRET
  });

  await t.throwsAsync(
    async () => {
      await hasura.createEventTrigger({
        name: 'missing webhook',
        table: { name: 'mytable', schema: 'myschema' }
      });
    },
    { instanceOf: Error }
  );
});

test('createCronTrigger', async (t) => {
  const hasura = new Hasura({
    endpoint: ENDPOINT,
    adminSecret: ADMIN_SECRET
  });

  await t.notThrowsAsync(async () => {
    await hasura.createCronTrigger({
      name: 'test_cron',
      schedule: '* * * * *',
      webhook: 'https://httpbin.org/post'
    });
  });
});

test('deleteCronTrigger', async (t) => {
  const hasura = new Hasura({
    endpoint: ENDPOINT,
    adminSecret: ADMIN_SECRET
  });

  await t.notThrowsAsync(async () => {
    await hasura.createCronTrigger({
      name: 'test_cron',
      schedule: '* * * * *',
      webhook: 'https://httpbin.org/post',
      payload: {
        hello: 'world'
      },
      replace: true,
      include_in_metadata: true
    });

    await hasura.deleteCronTrigger('test_cron');
  });
});

test('createScheduledTrigger', async (t) => {
  const hasura = new Hasura({
    endpoint: ENDPOINT,
    adminSecret: ADMIN_SECRET
  });

  await t.notThrowsAsync(async () => {
    await hasura.createScheduledEvent({
      schedule_at: '2999-12-31T14:00:00.000Z',
      webhook: 'https://httpbin.org/post',
      payload: {
        hello: 'world'
      }
    });
  });
});

test('runSQL', async (t) => {
  const hasura = new Hasura({
    endpoint: ENDPOINT,
    adminSecret: ADMIN_SECRET
  });

  await t.notThrowsAsync(async () => {
    const resp = await hasura.runSQL({
      sql: `create table item ( id serial,  name text,  category text,  primary key (id))`,
      read_only: false,
      check_metadata_consistency: false
    });

    t.is(resp.data.result_type, 'CommandOk');
    t.is(resp.data.result, null);
  });
});
