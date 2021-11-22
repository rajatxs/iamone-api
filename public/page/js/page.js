import { PageRootComponent } from './components/PageRoot.js'
import { PageContentComponent } from './components/PageContent.js'
import { PageUserAvatarComponent } from './components/PageUserAvatar.js'
import { PageUserProfileComponent } from './components/PageUserProfile.js'
import { PageSocialsComponent } from './components/PageSocials.js'
import { PageSocialLinkComponent } from './components/PageSocialLink.js'
import { PageCustomLinksComponent } from './components/PageCustomLinks.js'
import { PageCustomLinkComponent } from './components/PageCustomLink.js'
import { store } from './utils/store.js'

window.onload = () => {
   window.customElements.define('page-root', PageRootComponent);
   window.customElements.define('page-content', PageContentComponent);
   window.customElements.define('page-user-avatar', PageUserAvatarComponent);
   window.customElements.define('page-user-profile', PageUserProfileComponent);
   window.customElements.define('page-socials', PageSocialsComponent);
   window.customElements.define('page-social-link', PageSocialLinkComponent);
   window.customElements.define('page-custom-links', PageCustomLinksComponent);
   window.customElements.define('page-custom-link', PageCustomLinkComponent);
}

Reflect.set(window, 'store', store);
