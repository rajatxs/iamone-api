import { PageComponent } from "../classes/PageComponent.js"
import { h } from "../utils/dom.js"

export class PageContentComponent extends PageComponent {
   template() {
      const attrs = {
         class: 'page__content',
         'aria-label': 'Content'
      }

      return h('div', attrs, ...this.childNodes)
   }
}
