import { PageComponent } from "../classes/PageComponent.js"
import { h } from "../utils/dom.js"

export class PageCustomLinksComponent extends PageComponent {
   template() {
      const attrs = {
         class: 'page__custom-links', 
         'aria-label': 'Custom Links'
      }

      return h('div', attrs, ...this.childNodes)
   }
}
