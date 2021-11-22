
import { resolveAttribute } from './common.js'

/**
 * Generate element id
 * @param {string} prefix - Id prefix
 * @returns {string}
 */
export function elementId(prefix = 'e') {
   const random = String(Math.floor(Math.random() * 10e6));
   const id = [prefix, random].join(':');
   return id;
}

/**
 * Resolve utility attributes
 * @param {HTMLElement} el
 * @param {string} attrName - Attribute name
 * @param {any} attrValue - Attribute value
 * @returns {any}
 */
export function resolveAttributeValue(el, attrName, attrValue) {
   const { key, value } = resolveAttribute(attrName, attrValue);
   let result;

   switch (key) {
      case 'bind-text': {
         let textValue = String(value);
         const node = document.createTextNode(textValue);

         el.appendChild(node);
         el.removeAttribute(attrName);
      }

      case 'bind-html': {
         let htmlValue = String(value);
         el.innerHTML = htmlValue;
         el.removeAttribute(attrName);
      }

      case 'style': {
         switch (typeof value) {
            case 'object':
               for (let prop in value) {
                  el.style.setProperty(prop, value[prop]);
               }
               break;

            case 'string':
            case 'number':
               el.style.setProperty(key, String(value));
               break;
         }
         result = null;
         break;
      }

      default:
         result = value;
         break;
   }

   return result;
}

/**
 * Create new element
 * @param {string|HTMLElement} tag - Tagname of node
 * @param {object} [attr] - Attributes
 * @param {HTMLElement[] | string[]} [childs] - Childrens
 * @returns {HTMLElement}
 */
export function h(tag, attr = {}, ...childs) {
   /** @type {HTMLElement} */
   let root;
   let childNodes = [];

   if (tag instanceof HTMLElement) {
      return tag;
   } else {
      root = document.createElement(tag);
   }

   // attach element id
   root.setAttribute('data-elem-id', elementId());

   // assign attributes
   Object.keys(attr).forEach(key => {
      const value = resolveAttributeValue(root, key, Reflect.get(attr, key));

      if (value) {
         root.setAttribute(key, value);
      }
   })

   childNodes = childs.map(/** @param {string|HTMLElement} child */(child) => {
      let node;

      switch (typeof child) {
         case 'string':
         case 'number':
            node = document.createTextNode(String(child));
            break;

         case 'object':
            node = child;
            break;
      }

      return node;
   })


   // append child nodes
   root.append(...childNodes);

   return root;
}
