
export interface PageConfig extends MutableDoc {
   title?: string,
   description?: string,
   tags?: string[],
   templateName: string,
   watermark?: boolean,
   layout?: string,
   themeMode: 'LIGHT' | 'DARK' | 'AUTO',
   styles: object,
   userId: DocId
}

export type PartialPageConfig = Partial<PageConfig>
