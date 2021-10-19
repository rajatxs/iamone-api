const socialIcons = require('../../data/social-icons.json')

export const helpers = {

   // resolve social icons from local icon set
   resolveSocialIcon(key: string) {
      return socialIcons[key] || ''
   }
}
