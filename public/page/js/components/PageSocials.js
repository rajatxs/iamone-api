import { PageComponent } from "../classes/PageComponent.js"
import { h } from "../utils/dom.js"

export class PageSocialsComponent extends PageComponent {
   template() {
      const attrs = {
         class: 'page__socials', 
         'aria-label': 'Socials'
      }

      return h('div', attrs, ...this.childNodes)
   }
}
