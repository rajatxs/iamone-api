import { PageComponent } from "../classes/PageComponent.js"
import { h } from "../utils/dom.js"

export class PageUserAvatarComponent extends PageComponent {

   template() {
      const { src } = this.props

      return h('div', { 
         class: 'page__user-avatar', 
         'aria-label': 'User Avatar' 
      },
         h('div', 
         { 
            class: 'page__user-avatar-image',
            style: {
               'background-image': `url(${src})`
            }
         })
      )
   }
}
