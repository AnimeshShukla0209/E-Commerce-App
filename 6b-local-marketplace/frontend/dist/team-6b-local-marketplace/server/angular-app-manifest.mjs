
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/',
  locale: undefined,
  routes: [
  {
    "renderMode": 2,
    "route": "/"
  },
  {
    "renderMode": 2,
    "route": "/login"
  },
  {
    "renderMode": 2,
    "route": "/buyer-dashboard"
  },
  {
    "renderMode": 2,
    "route": "/vendor-dashboard"
  },
  {
    "renderMode": 2,
    "route": "/wishlist"
  },
  {
    "renderMode": 2,
    "route": "/cart"
  },
  {
    "renderMode": 2,
    "route": "/orders"
  },
  {
    "renderMode": 2,
    "route": "/checkout"
  },
  {
    "renderMode": 2,
    "route": "/vendor-orders"
  },
  {
    "renderMode": 2,
    "route": "/refund"
  },
  {
    "renderMode": 2,
    "route": "/track-order"
  },
  {
    "renderMode": 2,
    "route": "/profile"
  }
],
  entryPointToBrowserMapping: undefined,
  assets: {
    'index.csr.html': {size: 16925, hash: 'f2e24298f1a8d39c4c24658776622ea794347456eebe025c533cd5b78cd07770', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 17210, hash: 'a42ab88081c3ea70f68fb7445092c16625c82644ca5d3f02b388a2bf2d2874aa', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'login/index.html': {size: 28414, hash: '9f403041d1ab4bb3c3b0107f1eb9fe0b0c84f04bdb4284512aeb3093e5587e61', text: () => import('./assets-chunks/login_index_html.mjs').then(m => m.default)},
    'wishlist/index.html': {size: 24358, hash: 'cc2c4d1f2d742ff28853530d6a6543a6009cc58c409cc429e73d766cf4aa64cf', text: () => import('./assets-chunks/wishlist_index_html.mjs').then(m => m.default)},
    'cart/index.html': {size: 24986, hash: 'bb2bb9c67ed35dd6feb108f2702e7446d38330cfac27152b1ab45ad275aa35b5', text: () => import('./assets-chunks/cart_index_html.mjs').then(m => m.default)},
    'index.html': {size: 44173, hash: 'b022b8b5baba9d67e17399aa3c11dd1375c1b6679013adfc3c560d39245f5725', text: () => import('./assets-chunks/index_html.mjs').then(m => m.default)},
    'orders/index.html': {size: 24318, hash: 'fb6dd198e656c12b0f07663b0c8ea64a2ac6e7600eeff4293546978663684231', text: () => import('./assets-chunks/orders_index_html.mjs').then(m => m.default)},
    'vendor-orders/index.html': {size: 26741, hash: 'b368f2590af94bb303adb2c096dee03d9803188f8bd6846bd0ffaf415fd16fa8', text: () => import('./assets-chunks/vendor-orders_index_html.mjs').then(m => m.default)},
    'checkout/index.html': {size: 24617, hash: 'f53f255751a2e144e33d8a5baa24514455f97a5ca107c41d2700145b65b4de43', text: () => import('./assets-chunks/checkout_index_html.mjs').then(m => m.default)},
    'refund/index.html': {size: 27385, hash: '4ffb7ed962e45444fbb33fe04afb78105a34773aa065ddbc52bda3100bdb22c3', text: () => import('./assets-chunks/refund_index_html.mjs').then(m => m.default)},
    'track-order/index.html': {size: 24318, hash: 'fb6dd198e656c12b0f07663b0c8ea64a2ac6e7600eeff4293546978663684231', text: () => import('./assets-chunks/track-order_index_html.mjs').then(m => m.default)},
    'profile/index.html': {size: 22623, hash: '60d1ecdf253a6ebc82cbe201eed62e2b89d5cf6fe2e5be9090ef9806cc74810d', text: () => import('./assets-chunks/profile_index_html.mjs').then(m => m.default)},
    'vendor-dashboard/index.html': {size: 35410, hash: '882e97abf3dc0e7baf10d803d73c3257703be14dc55a2f20d5901c50e3e95e8e', text: () => import('./assets-chunks/vendor-dashboard_index_html.mjs').then(m => m.default)},
    'buyer-dashboard/index.html': {size: 47988, hash: 'ded7d72cf402780cf8c9cbab6166b3671bf01833662462e7d334edea1e671f5c', text: () => import('./assets-chunks/buyer-dashboard_index_html.mjs').then(m => m.default)},
    'styles-HSQPAD6F.css': {size: 103, hash: 'CJ9R42ChzfQ', text: () => import('./assets-chunks/styles-HSQPAD6F_css.mjs').then(m => m.default)}
  },
};
