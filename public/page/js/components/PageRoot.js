import { PageComponent } from "../classes/PageComponent.js"
import { h } from '../utils/dom.js'

export class PageRootComponent extends PageComponent {
   template() {
      const attrs = {
         class: 'page__root',
         'aria-label': 'Page Root'
      };

      return h('div', attrs, ...this.childNodes);
   }
}
