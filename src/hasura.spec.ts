// tslint:disable:no-expression-statement no-object-mutation
import test from 'ava';
import Hasura from './hasura';

test('constructor', (t) => {
  const hasura = new Hasura({
    endpoint: 'http://localhost:8080',
    adminSecret: 'testsecret',
  });

  t.is(hasura.endpoint, 'http://localhost:8080');
  t.is(hasura.adminSecret, 'testsecret');
  t.is(hasura.queryEndpoint, 'http://localhost:8080/v1/query');
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
