import { PageComponent } from "../classes/PageComponent.js"
import { h } from "../utils/dom.js"
import { truncate } from "../utils/common.js"

export class PageCustomLinkComponent extends PageComponent {
   template() {
      const { title, desc, link } = this.props
      const attrs = {
         class: 'page__custom-link',
         href: link,
         target: '_blank'
      }

      return h('a', attrs, 
         h('div', { class: 'page__custom-link-metadata' },
            h('h5', { class: 'page__custom-link-metadata-title' }, title),
            h('div', { class: 'page__custom-link-metadata-desc' }, truncate(desc || link, 58))
         )
      )
   }
}
