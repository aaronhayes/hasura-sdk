// tslint:disable:no-expression-statement no-object-mutation
import test from 'ava';
import Hasura from './hasura';

const ENDPOINT = process.env.HASURA_ENDPOINT ?? 'http://localhost:8080';
const ADMIN_SECRET = process.env.HASURA_ADMIN_SECRET ?? 'testsecret';

test('constructor', (t) => {
  const hasura = new Hasura({
    endpoint: ENDPOINT,
    adminSecret: ADMIN_SECRET,
  });

  t.is(hasura.endpoint, ENDPOINT);
  t.is(hasura.adminSecret, ADMIN_SECRET);
  t.is(hasura.queryEndpoint, `${ENDPOINT}/v1/query`);
});

test('createEventTrigger', async (t) => {
  const hasura = new Hasura({
    endpoint: 'http://localhost:8080',
    adminSecret: 'testsecret',
  });

  await t.throwsAsync(
    async () => {
      await hasura.createEventTrigger({
        name: 'missing webhook',
        table: { name: 'mytable', schema: 'myschema' },
      });
    },
    { instanceOf: Error }
  );
});
