import NodeCache from 'node-cache';

export default new NodeCache({
   maxKeys: 160,
   deleteOnExpire: true,
   forceString: false,
   errorOnMissing: false
});
