export interface Client {
  ips: string[];
  userAgent?: string;
}

export interface RequestUser {
  iss: string;
  sub: string;
}

export interface RequestContext<User extends RequestUser = RequestUser> {
  client: Client;
  sessionId?: string;
  sessionType?: string;
  tokenType?: string;
  traceId: string | undefined;
  user?: User;
  when: Date;
}
