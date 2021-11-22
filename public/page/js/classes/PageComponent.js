import { resolveAttribute } from '../utils/common.js'

/**
 * Utiity class for creating custom elements of template
 * @abstract
 */
export class PageComponent extends HTMLElement {

   /** @type {HTMLElement|null} */
   root = null;
   props = {};

   constructor() {
      super();

      this.init();
      this.inject();
   }

   /** Init component lifecycle */
   init() {
      this.resolveProps();
      this.root = this.template();
   }

   /** Inject template into custom element */
   inject() {
      if (this.root instanceof HTMLElement) {
         this.replaceWith(this.root);
      }
   }

   /** Resolve props */
   resolveProps() {
      const attrs = this.getAttributeNames();

      attrs.forEach(originalKey => {
         const { key, value } = resolveAttribute(
            originalKey, 
            this.getAttribute(originalKey)
         );

         Reflect.set(this.props, key, value);
      })
   }

   /**
    * Get component template
    * @returns {HTMLElement|null}
    */
   template() { return null; }
}
