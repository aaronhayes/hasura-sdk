// Hasura SDK
import axios from 'axios';
import {
  HasuraConfig,
  CreateCronTriggerParams,
  HasuraQueryResponse,
  CreateScheduledEventParams,
  CreateEventTriggerParams,
  HasuraResponse,
  InvokeEventTriggerParams,
  RunSQLParams,
  HasuraRunSQLAxiosResponse,
  HasuraRunSQLResponse,
  TrackTableArgs,
  SetEnumTableArgs,
  TrackTableResponse,
  SetTableIsEnumResponse,
  TrackTableV2Args,
  SetTableCustomFieldsArgs,
  SetTableCustomFieldsResponse,
  UntrackTableArgs,
  UntrackTableResponse
} from './types';

class Hasura {
  endpoint: string;
  adminSecret: string;
  queryEndpoint: string;

  constructor(config: HasuraConfig) {
    this.endpoint = config.endpoint;
    this.adminSecret = config.adminSecret;
    this.queryEndpoint = `${config.endpoint}/v1/query`;
  }

  /**
   * Get authentication headers
   * @private
   */
  getHeaders(): object {
    return {
      'x-hasura-admin-secret': this.adminSecret
    };
  }

  /**
   * Create a cron trigger
   * @param params CreateCronTriggerParams
   */
  createCronTrigger(params: CreateCronTriggerParams): Promise<HasuraResponse> {
    return axios.post<HasuraQueryResponse>(
      this.queryEndpoint,
      {
        type: 'create_cron_trigger',
        args: {
          name: params.name,
          webhook: params.webhook,
          schedule: params.schedule,
          payload: params.payload,
          headers: params.headers,
          retry_conf: params.retry_conf,
          include_in_metadata: params.include_in_metadata ?? false,
          replace: params.replace ?? false,
          comment: params.comment
        }
      },
      {
        headers: this.getHeaders()
      }
    );
  }

  /**
   * Delete an existing cron trigger
   * @param cronName string
   */
  deleteCronTrigger(cronName: string): Promise<HasuraResponse> {
    return axios.post<HasuraQueryResponse>(
      this.queryEndpoint,
      {
        type: 'delete_cron_trigger',
        args: {
          name: cronName
        }
      },
      {
        headers: this.getHeaders()
      }
    );
  }

  /**
   * Create a new scheduled event
   * @param params CreateScheduledEventParams
   */
  createScheduledEvent(params: CreateScheduledEventParams): Promise<HasuraResponse> {
    return axios.post<HasuraQueryResponse>(
      this.queryEndpoint,
      {
        type: 'create_scheduled_event',
        args: {
          webhook: params.webhook,
          schedule_at: params.schedule_at,
          payload: params.payload,
          headers: params.headers,
          retry_conf: params.retry_conf,
          comment: params.comment
        }
      },
      {
        headers: this.getHeaders()
      }
    );
  }

  /**
   * Create a new event trigger or replace an existing event trigger.
   * @param params CreateEventTriggerParams
   */
  createEventTrigger(params: CreateEventTriggerParams): Promise<HasuraResponse> {
    if (!params.webhook && !params.webhook_from_env) {
      throw new Error(`Either "webhook" or "webhook_from_env" is required`);
    }

    return axios.post<HasuraQueryResponse>(
      this.queryEndpoint,
      {
        type: 'create_event_trigger',
        args: {
          name: params.name,
          table: params.table,
          webhook: params.webhook,
          webhook_from_env: params.webhook_from_env,
          insert: params.insert,
          update: params.update,
          delete: params.delete,
          headers: params.headers,
          retry_conf: params.retry_conf,
          replace: params.replace
        }
      },
      {
        headers: this.getHeaders()
      }
    );
  }

  /**
   * Used to delete an event trigger
   * @param triggerName string
   */
  deleteEventTrigger(triggerName: string): Promise<HasuraResponse> {
    return axios.post<HasuraQueryResponse>(
      this.queryEndpoint,
      {
        type: 'delete_event_trigger',
        args: {
          name: triggerName
        }
      },
      {
        headers: this.getHeaders()
      }
    );
  }

  /**
   * Redeliver an existing event.
   * @param eventId string
   */
  redeliverEvent(eventId: string): Promise<HasuraResponse> {
    return axios.post<HasuraQueryResponse>(
      this.queryEndpoint,
      {
        type: 'redeliver_event',
        args: {
          event_id: eventId
        }
      },
      {
        headers: this.getHeaders()
      }
    );
  }

  /**
   * Used to invoke an event trigger with custom payload
   * @param params InvokeEventTriggerParams
   */
  invokeEventTrigger(params: InvokeEventTriggerParams): Promise<HasuraResponse> {
    return axios.post<HasuraQueryResponse>(
      this.queryEndpoint,
      {
        type: 'invoke_event_trigger',
        args: {
          name: params.name,
          payload: params.payload
        }
      },
      { headers: this.getHeaders() }
    );
  }

  /**
   * Can be used to run arbitrary SQL statements.
   * @params params RunSQLParams
   */
  runSQL(params: RunSQLParams): Promise<HasuraRunSQLAxiosResponse> {
    return axios.post<HasuraRunSQLResponse>(
      this.queryEndpoint,
      {
        type: 'run_sql',
        args: {
          sql: params.sql,
          cascade: params.cascade,
          check_metadata_consistency: params.check_metadata_consistency,
          read_only: params.read_only
        }
      },
      { headers: this.getHeaders() }
    );
  }

  // Tables/Views
  /**
   * Used to add table/view to the GraphQL schema
   * @params args TrackTableArgs
   */
  trackTable(args: TrackTableArgs): Promise<TrackTableResponse> {
    return axios.post(
      this.queryEndpoint,
      {
        type: 'track_table',
        args: {
          ...args
        }
      },
      {
        headers: this.getHeaders()
      }
    );
  }

  /**
   * Used to set if an already tracked table should be used as an enum table
   * @params args TrackTableArgs
   */
  setTableIsEnum(args: SetEnumTableArgs): Promise<SetTableIsEnumResponse> {
    return axios.post(
      this.queryEndpoint,
      {
        type: 'set_table_is_enum',
        args: {
          ...args
        }
      },
      {
        headers: this.getHeaders()
      }
    );
  }

  /**
   * Version 2 of track_table is used to add a table/view to the GraphQL schema with configuration. You can customise the root field names.
   * @param args TrackTableV2ARgs
   */
  trackTableV2(args: TrackTableV2Args): Promise<TrackTableResponse> {
    return axios.post(
      this.queryEndpoint,
      {
        type: 'track_table',
        version: 2,
        args: {
          ...args
        }
      },
      { headers: this.getHeaders() }
    );
  }

  /**
   * Sets the custom root fields and custom column names of already tracked table.
   * This will replace the already present custom fields configuration.
   * @param args SetTableCustomFieldsArgs
   */
  setTableCustomFields(args: SetTableCustomFieldsArgs): Promise<SetTableCustomFieldsResponse> {
    return axios.post(
      this.queryEndpoint,
      {
        type: 'set_table_custom_fields',
        version: 2,
        args: {
          ...args
        }
      },
      {
        headers: this.getHeaders()
      }
    );
  }

  /**
   * Used to remove a table/view from the GraphQL schema.
   * @param args UntrackTableArgs
   */
  untrackTable(args: UntrackTableArgs): Promise<UntrackTableResponse> {
    return axios.post(
      this.queryEndpoint,
      {
        type: 'untrack_table',
        args: {
          ...args
        }
      },
      {
        headers: this.getHeaders()
      }
    );
  }
}

export default Hasura;
