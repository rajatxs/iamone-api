
export interface HttpRequest extends ImmutableDoc {
   url_path: string,
   ip: string,
   origin?: string
   user_agent?: string
   lang?: string
}

export type PartialHttpRequest = Partial<HttpRequest>
