// Hasura SDK
import axios, { AxiosResponse } from 'axios';
import {
  HasuraConfig,
  CreateCronTriggerParams,
  HasuraQueryResponse,
  CreateScheduledEventParams,
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
   * Create a cron trigger
   * @param params CreateCronTriggerParams
   */
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

  /**
   * Delete an existing cron trigger
   * @param cronName string
   */
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

  /**
   * Create a new scheduled event
   * @param params CreateScheduledEventParams
   */
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
