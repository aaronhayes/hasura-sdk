import { AxiosResponse } from 'axios';
import { TableName, TableConfig, CustomRootFields, CustomColumnNames } from './HasuraMetadataV2';

export type EventPayload = {
  readonly [key: string]: any;
};

export type EventHeader = HeaderFromValue | HeaderFromEnv;

export type HeaderFromValue = {
  readonly name: string;
  readonly value: string;
};

export type HeaderFromEnv = {
  readonly name: string;
  readonly value_from_env: string;
};

export type TriggerRetryConfig = {
  readonly num_retries?: number;
  readonly retry_interval_seconds?: number;
  readonly timeout_seconds?: number;
};

export type TriggerRetryConfigST = {
  readonly num_retries?: number;
  readonly retry_interval_seconds?: number;
  readonly timeout_seconds?: number;
  readonly tolerance_seconds?: number;
};

export type CronExpression = string;

export type WebhookUrl = string;

export type HasuraConfig = {
  readonly endpoint: string;
  readonly adminSecret: string;
};

export type CreateCronTriggerParams = {
  // Name of cron trigger
  readonly name: string;

  // URL of webhook
  readonly webhook: WebhookUrl;

  // Cron expression at which the trigger should be invoked
  readonly schedule: CronExpression;

  // Any JSON payload
  readonly payload?: EventPayload;

  // List of headers to be sent with the webhook
  readonly headers?: readonly EventHeader[];

  // Retry configuration if scheduled invocation delivery fails
  readonly retry_conf?: TriggerRetryConfigST;

  // Custom comment
  readonly comment?: string;

  // Flag to indivate whether a trigger should be included in the metadata. default: false
  readonly include_in_metadata?: boolean;

  // Replace existing cron with same name? default: false
  readonly replace?: boolean;
};

export type CreateScheduledEventParams = {
  // URL of the webhook
  readonly webhook: string;

  // The time at which the inovcation should be invoked (Datetime ISO8601 format)
  readonly schedule_at: string;

  // JSON payload which will be sent when the webhook is invoked
  readonly payload?: EventPayload;

  // List of headers to be sent with the webhook
  readonly headers?: readonly EventHeader[];

  // Retry configuration
  readonly retry_conf?: TriggerRetryConfigST;

  // Custom comment
  readonly comment?: string;
};

export type QualifiedTable = {
  // Table name
  readonly name: string;

  // Schema name
  readonly schema: string;
};

export type PGColumn = string;

export type OperationSpec = {
  // List of columns or "*" to listen to changes
  readonly columns: readonly PGColumn[] | '*';

  // List of columns or "*" to send as part of webhook payload
  readonly payload?: readonly PGColumn[] | '*';
};

export type CreateEventTriggerParams = {
  // Name of the event trigger
  readonly name: string;

  // Object with table name and schema
  readonly table: QualifiedTable;

  // Full url of webhook
  readonly webhook?: string;

  // Envrionment variable name of webhook
  readonly webhook_from_env?: string;

  // Spec for insert operation
  readonly insert?: OperationSpec;

  // Sepc for update operation
  readonly update?: OperationSpec;

  // Spec for delete operation;
  readonly delete?: OperationSpec;

  // List of headers to be sent with the webhook
  readonly headers?: readonly EventHeader[];

  // Retry configuration
  readonly retry_conf?: TriggerRetryConfig;

  // Replace existing trigger. default: false
  readonly replace?: boolean;
};

export type InvokeEventTriggerParams = {
  // Name of the event trigger
  readonly name: string;

  // Some JSON payload to send to the trigger
  readonly payload: EventPayload;
};

export type HasuraQueryResponse = {
  readonly tyep: string;
  readonly args: object;
  readonly version?: number;
};

export type HasuraResponse = AxiosResponse<HasuraQueryResponse>;

export type RunSQLParams = {
  // The SQL to be executed
  readonly sql: string;

  // When set to true, the effect is cascaded
  readonly cascade?: boolean;

  // When set to false, the sql is executed without checking metadata dependencies
  readonly check_metadata_consistency?: boolean;

  // When true the request will be run in READ ONLY transaction acccess mode
  readonly read_only?: boolean;
};

export type ResultTuple = readonly string[];

export type HasuraRunSQLResponse = {
  readonly result_type: string;
  readonly result?: readonly ResultTuple[];
};

export type HasuraRunSQLAxiosResponse = AxiosResponse<HasuraRunSQLResponse>;

export type TrackTableV2Args = {
  readonly table: TableName;
  readonly configuration: TableConfig;
};

export type SetTableCustomFieldsArgs = {
  readonly table: TableName;
  readonly custom_root_fields?: CustomRootFields;
  readonly custom_column_name?: CustomColumnNames;
};

export type TrackTableArgs = {
  readonly table: TableName;
  readonly is_enum?: boolean;
};

export type UntrackTableArgs = {
  readonly table: TableName;
  readonly cascade?: boolean;
};

export type SetEnumTableArgs = {
  readonly table: TableName;
  readonly is_enum: boolean;
};

export type TrackTableResponse = AxiosResponse<{
  message: string;
}>;

export type SetTableIsEnumResponse = AxiosResponse<{
  message: string;
}>;

export type SetTableCustomFieldsResponse = AxiosResponse<{
  message: string;
}>;

export type UntrackTableResponse = AxiosResponse<{
  message: string;
}>;