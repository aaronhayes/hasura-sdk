// Hasura SDK
import axios, { AxiosResponse } from 'axios';

export type EventPayload = {
  readonly [key: string]: any;
};

export type EventHeaders = HeaderFromValue | HeaderFromEnv;

export type HeaderFromValue = {
  readonly name: string;
  readonly value: string;
};

export type HeaderFromEnv = {
  readonly name: string;
  readonly value_from_env: string;
};

export type EventRetryConfig = {
  readonly num_retries?: number;
  readonly retry_interval_seconds?: number;
  readonly timeout_seconds?: number;
  readonly tolerance_seconds?: number;
};

export type CronExpression = string;

export type WebhookUrl = string;

type HasuraConfig = {
  readonly endpoint: string;
  readonly adminSecret: string;
};

type CreateCronTriggerParams = {
  // Name of cron trigger
  readonly name: string;

  // URL of webhook
  readonly webhook: WebhookUrl;

  // Cron expression at which the trigger should be invoked
  readonly schedule: CronExpression;

  // Any JSON payload
  readonly payload?: EventPayload;

  // List of headers to be sent with the webhook
  readonly headers?: readonly EventHeaders[];

  // Retry configuration if scheduled invocation delivery fails
  readonly retry_config?: EventRetryConfig;

  // Custom comment
  readonly comment?: string;

  // Flag to indivate whether a trigger should be included in the metadata. default: false
  readonly include_in_metadata?: boolean;

  // Replace existing cron with same name? default: false
  readonly replace?: boolean;
};

type CreateScheduledEventParams = {
  // URL of the webhook
  readonly webhook: string;

  // The time at which the inovcation should be invoked (Datetime ISO8601 format)
  readonly schedule_at: string;

  // JSON payload which will be sent when the webhook is invoked
  readonly payload?: EventPayload;

  // List of headers to be sent with the webhook
  readonly headers?: readonly EventHeaders[];

  // Retry configuration
  readonly retry_config?: EventRetryConfig;

  // Custom comment
  readonly comment?: string;
};

type HasuraQueryResponse = {
  readonly tyep: string;
  readonly args: object;
  readonly version?: number;
};

class Hasura {
  endpoint: string;
  adminSecret: string;
  queryEndpoint: string;

  constructor(config: HasuraConfig) {
    this.endpoint = config.endpoint;
    this.adminSecret = config.adminSecret;
    this.queryEndpoint = `${config.endpoint}/v1/query`;
  }

  createCronTrigger(
    params: CreateCronTriggerParams
  ): Promise<AxiosResponse<HasuraQueryResponse>> {
    return axios.post<HasuraQueryResponse>(this.queryEndpoint, {
      type: 'create_cron_trigger',
      args: {
        name: params.name,
        webhook: params.webhook,
        schedule: params.schedule,
        payload: params.payload,
        headers: params.headers,
        retry_conf: params.retry_config,
        include_in_metadata: params.include_in_metadata ?? false,
        replace: params.replace ?? false,
        comment: params.comment,
      },
    });
  }

  deleteCronTrigger(
    cronName: string
  ): Promise<AxiosResponse<HasuraQueryResponse>> {
    return axios.post<HasuraQueryResponse>(this.queryEndpoint, {
      type: 'delete_cron_trigger',
      args: {
        name: cronName,
      },
    });
  }

  createScheduledEvent(
    params: CreateScheduledEventParams
  ): Promise<AxiosResponse<HasuraQueryResponse>> {
    return axios.post<HasuraQueryResponse>(this.queryEndpoint, {
      type: 'create_scheduled_event',
      args: {
        webhook: params.webhook,
        schedule_at: params.schedule_at,
        payload: params.payload,
        headers: params.headers,
        retry_conf: params.retry_config,
        comment: params.comment,
      },
    });
  }
}

export default Hasura;
