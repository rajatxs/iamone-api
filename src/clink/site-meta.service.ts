import { Injectable } from '@nestjs/common'
import axios from 'axios'
import cheerio from 'cheerio'
import { SiteMetadata } from './clink.interface'
import { URL } from 'url'

@Injectable()
export class SiteMetaService {

   public isAbsolute(url: string) {
      return url.indexOf('://') > 0 || url.indexOf('//') === 0
   }

   public toURL(url: string, baseUrl: string): string {
      let newUrl: string

      if (!this.isAbsolute(url)) {
         newUrl = new URL(url, baseUrl).href;
      } else {
         newUrl = url
      }

      return newUrl
   }

   /** Extract metadata from html content */
   public extract(url: string, content: string): SiteMetadata {
      const $ = cheerio.load(content)
      let title: string, description: string, thumb: string, favicon: string

      title = $('title').text() || $("meta[name='apple-mobile-web-app-title']").attr('content')
      description = $("meta[name='description']").attr('content')
      thumb = $("meta[property='og:image']").attr('content')
      favicon = $("link[rel='shortcut icon'], link[rel='icon shortcut'], link[rel='icon']").attr('href')

      // Resolve absolute urls
      thumb = (thumb)? this.toURL(thumb, url): ''
      favicon = (favicon)? this.toURL(favicon, url): ''
      description = description || ''

      return {
         title,
         description,
         thumb,
         favicon
      }
   }

   /** Fetch site metadata from URL */
   public async fetch(url: string) {
      let status: number, content: string
      const response = await axios.get<string>(url, {
         headers: {
            'Accept': 'text/html',
            'Sec-Fetch-Site': 'cross-site',
            'Sec-Fetch-Dest': 'document'
         },
         responseType: 'text'
      })

      status = response.status

      if (status >= 400 && status < 600) {
         throw new Error()
      }

      content = response.data

      return content
   }
}
