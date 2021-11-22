import { PageComponent } from "../classes/PageComponent.js"
import { h } from "../utils/dom.js"

export class PageUserProfileComponent extends PageComponent {
   template() {
      const { fullname = '', bio = '' } = this.props

      return h('div', { 
         class: 'page__user-profile', 
         'aria-label': 'User Profile' 
      },
         h('h3', { class: 'page__user-profile-fullname'}, fullname),
         h('p', { class: 'page__user-profile-bio' }, bio)
      )
   }
}
