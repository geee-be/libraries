export interface Client {
  ips: string[];
  userAgent?: string;
}

export interface RequestUser {
  iss: string;
  sub: string;
}

export interface RequestContext {
  client: Client;
  sessionId?: string;
  sessionType?: string;
  tokenType?: string;
  traceId: string | undefined;
  user?: RequestUser;
  when: Date;
}
