
import { store } from './store.js'

/**
 * @typedef ResolvedAttributeValue
 * @property {string} key
 * @property {any} value
 */

/**
 * Resolve attribute value from store
 * @param {string} attrName - Attribute name
 * @param {any} attrValue - Attribute value
 * @returns {ResolvedAttributeValue}
 */
 export function resolveAttribute(attrName, attrValue) {
   let key, value

   if (attrName.startsWith(':') && 'store' in window) {
      key = attrName.substr(1)
      value = store.get(attrValue)

   } else {
      key = attrName
      value = attrValue
   }

   return { key, value }
}

/**
 * Truncate string
 * @param {string} val - String value
 * @param {number} len - String length
 * @returns {string}
 */
export function truncate(val, len = 28) {
   return val.substring(0, len) + '...'
}
