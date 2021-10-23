
export type CLinkStyle =
   'simple' | 'thumb' |
   'background' | 'card' |
   'grid' | 'slider'

export interface CLink extends MutableDoc {
   thumb?: string
   title: string,
   description?: string,
   href: string,
   style?: CLinkStyle,
   favicon?: string,
   userId: DocId
}

export type PartialCLink = Partial<CLink>

export interface SiteMetadata {
   title?: string,
   description?: string,
   thumb?: string,
   favicon?: string
}
