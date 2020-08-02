// tslint:disable:no-expression-statement no-object-mutation
import test from 'ava';
import Hasura from './hasura';

const ENDPOINT = process.env.HASURA_ENDPOINT ?? 'http://localhost:8080';
const ADMIN_SECRET = process.env.HASURA_ADMIN_SECRET ?? 'myadminsecretkey';

const setupHasura = () => {
  return new Hasura({
    endpoint: ENDPOINT,
    adminSecret: ADMIN_SECRET
  });
};

test.serial('constructor', (t) => {
  const hasura = setupHasura();

  t.is(hasura.endpoint, ENDPOINT);
  t.is(hasura.adminSecret, ADMIN_SECRET);
  t.is(hasura.queryEndpoint, `${ENDPOINT}/v1/query`);
});

test.serial('getHeaders', (t) => {
  const hasura = setupHasura();

  t.deepEqual(hasura.getHeaders(), { 'x-hasura-admin-secret': ADMIN_SECRET });
});

test.serial('createEventTrigger Error', async (t) => {
  const hasura = setupHasura();

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

test.serial('createCronTrigger', async (t) => {
  const hasura = setupHasura();

  await t.notThrowsAsync(async () => {
    try {
      await hasura.deleteCronTrigger('test_cron');
    } catch (error) {
      // noop continue
    }

    await hasura.createCronTrigger({
      name: 'test_cron',
      schedule: '* * * * *',
      webhook: 'https://httpbin.org/post',
      replace: false
    });
    t.pass();
  });
});

test.serial('deleteCronTrigger', async (t) => {
  const hasura = setupHasura();

  await t.notThrowsAsync(async () => {
    try {
      await hasura.deleteCronTrigger('test_cron_delete');
    } catch (error) {
      // noop continue
    }

    await hasura.createCronTrigger({
      name: 'test_cron_delete',
      schedule: '* * * * *',
      webhook: 'https://httpbin.org/post',
      payload: {
        hello: 'world'
      },
      replace: false,
      include_in_metadata: true
    });

    await hasura.deleteCronTrigger('test_cron_delete');
    t.pass();
  });
});

test.serial('createScheduledTrigger', async (t) => {
  const hasura = setupHasura();

  await t.notThrowsAsync(async () => {
    await hasura.createScheduledEvent({
      schedule_at: '2999-12-31T14:00:00.000Z',
      webhook: 'https://httpbin.org/post',
      payload: {
        hello: 'world'
      }
    });
    t.pass();
  });
});

test.serial('runSQL', async (t) => {
  const hasura = setupHasura();

  // Clear table if exists
  const dropResp = await hasura.runSQL({
    sql: 'DROP TABLE IF EXISTS item',
    read_only: false
  });
  t.is(dropResp.data.result_type, 'CommandOk');
  t.is(dropResp.data.result, null);

  const resp = await hasura.runSQL({
    sql: `create table item ( id serial,  name text,  category text,  primary key (id))`,
    read_only: false,
    check_metadata_consistency: false,
    cascade: true
  });

  t.is(resp.data.result_type, 'CommandOk');
  t.is(resp.data.result, null);
});

// Tables/Views
test.serial('trackTable', async (t) => {
  const hasura = setupHasura();

  const resp = await hasura.trackTable({
    table: {
      schema: 'public',
      name: 'item'
    }
  });

  t.is(resp.data.message, 'success');
});

test.serial('setTableIsEnum', async (t) => {
  const hasura = setupHasura();

  await hasura.runSQL({
    sql: 'DROP TABLE IF EXISTS enumtable;',
    cascade: true
  });

  await hasura.runSQL({
    sql: 'CREATE TABLE enumtable ( value text, primary key (value) );'
  });

  await hasura.runSQL({
    sql: `INSERT INTO enumtable ( value ) VALUES ('testenumval');`
  });

  await hasura.trackTable({
    table: {
      schema: 'public',
      name: 'enumtable'
    }
  });

  const resp = await hasura.setTableIsEnum({
    table: {
      schema: 'public',
      name: 'enumtable'
    },
    is_enum: true
  });

  t.is(resp.data.message, 'success');
});

test.serial('trackTableV2', async (t) => {
  const hasura = setupHasura();

  await hasura.runSQL({
    sql: 'DROP TABLE IF EXISTS trackvtwo',
    read_only: false
  });

  await hasura.runSQL({
    sql: 'CREATE TABLE trackvtwo ( id text, name text, primary key (id));'
  });

  const resp = await hasura.trackTableV2({
    table: 'trackvtwo',
    configuration: {
      custom_column_names: {
        id: 'Author'
      }
    }
  });

  t.is(resp.data.message, 'success');
});

test.serial('setTableCustomFields', async (t) => {
  const hasura = setupHasura();

  await hasura.runSQL({
    sql: 'DROP TABLE IF EXISTS setcustomfields',
    read_only: false
  });

  await hasura.runSQL({
    sql: 'CREATE TABLE setcustomfields ( id text, name text, primary key (id));'
  });

  await hasura.trackTableV2({
    table: 'setcustomfields',
    configuration: {
      custom_column_names: {
        id: 'Author'
      }
    }
  });

  const resp = await hasura.setTableCustomFields({
    table: 'setcustomfields',
    custom_column_name: {
      id: 'CustomIdField'
    }
  });

  t.is(resp.data.message, 'success');
});

test.serial('untrackTable', async (t) => {
  const hasura = setupHasura();

  await hasura.runSQL({
    sql: 'DROP TABLE IF EXISTS tracky',
    read_only: false
  });

  await hasura.runSQL({
    sql: 'CREATE TABLE tracky ( id text, name text, primary key (id));'
  });

  await hasura.trackTableV2({
    table: 'tracky',
    configuration: {}
  });

  const resp = await hasura.untrackTable({
    table: 'tracky',
    cascade: true
  });

  t.is(resp.data.message, 'success');
});
