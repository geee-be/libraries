export interface Client {
  ips: string[];
  userAgent?: string;
}

export interface RequestContext {
  client: Client;
  sessionId?: string;
  sessionType?: string;
  tokenType?: string;
  traceId: string | undefined;
  user?: {
    organizationId?: string;
    roles: string[];
    _id: string;
  };
  when: Date;
}
