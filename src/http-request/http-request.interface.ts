
export interface HttpRequest extends ImmutableRow {
   url_path: string,
   ip: string,
   origin?: string
   user_agent?: string
   lang?: string
}

export type PartialHttpRequest = Partial<HttpRequest>
