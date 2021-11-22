import { PageComponent } from "../classes/PageComponent.js"
import { h } from "../utils/dom.js"

export class PageSocialLinkComponent extends PageComponent {
   template() {
      const { link, icon } = this.props
      const attrs = {
         class: 'page__social-link',
         href: link,
         target: '_blank'
      }
      const iconElement = h('span', { class: 'page__social-link-icon' })

      if (icon) {
         iconElement.innerHTML = icon
      }

      return h('a', attrs, iconElement)
   }
}
