
export const store = {
   _data: new Map(),

   /**
    * Use values from specified object
    * @param obj - Values
    */
   use(obj = {}) {
      Object
         .keys(obj)
         .forEach(key => this._data.set(key, Reflect.get(obj, key)))
   },

   /**
    * Get value of specified property
    * @param {string} key - Keyname
    * @returns {any}
    */
   get(key) {
      return this._data.get(key)
   },

   /**
    * Set new key or update existing value
    * @param {string} key - Keyname
    * @param {any} value - Value
    */
   set(key, value) {
      this._data.set(key, value)
   }
}
