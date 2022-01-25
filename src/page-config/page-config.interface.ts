
export interface PageConfig extends MutableDoc {
   title?: string,
   description?: string,
   tags?: string[],
   watermark?: boolean,
   theme: string,
   templateName?: string,
   themeMode: 'LIGHT' | 'DARK' | 'AUTO',
   styles: object,
   userId: DocId
}

export type PartialPageConfig = Partial<PageConfig>
