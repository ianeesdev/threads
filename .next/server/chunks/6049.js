exports.id = 6049;
exports.ids = [6049];
exports.modules = {

/***/ 66049:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


const actions = {
'04d7d7e152e8d43bfe133b1700993e9c36dbb4f8': () => Promise.resolve(/* import() eager */).then(__webpack_require__.bind(__webpack_require__, 18776)).then(mod => mod["fetchUser"]),
'83fcee668a299ee1ced696e4187f18f466498dfe': () => Promise.resolve(/* import() eager */).then(__webpack_require__.bind(__webpack_require__, 18776)).then(mod => mod["updateUser"]),
'ab3efaa7beb509971f347285944bad7f244fc37e': () => Promise.resolve(/* import() eager */).then(__webpack_require__.bind(__webpack_require__, 18776)).then(mod => mod["fetchUserPosts"]),
'649dcaa0dd63a01772deb35a2f8edba38278d1f6': () => Promise.resolve(/* import() eager */).then(__webpack_require__.bind(__webpack_require__, 18776)).then(mod => mod["fetchUsers"]),
'9aa6d06696f86715cd2894a2b977b168150df461': () => Promise.resolve(/* import() eager */).then(__webpack_require__.bind(__webpack_require__, 18776)).then(mod => mod["getActivity"]),
}

async function endpoint(id, ...args) {
  const action = await actions[id]()
  return action.apply(null, args)
}

// Using CJS to avoid this to be tree-shaken away due to unused exports.
module.exports = {
  '04d7d7e152e8d43bfe133b1700993e9c36dbb4f8': endpoint.bind(null, '04d7d7e152e8d43bfe133b1700993e9c36dbb4f8'),
  '83fcee668a299ee1ced696e4187f18f466498dfe': endpoint.bind(null, '83fcee668a299ee1ced696e4187f18f466498dfe'),
  'ab3efaa7beb509971f347285944bad7f244fc37e': endpoint.bind(null, 'ab3efaa7beb509971f347285944bad7f244fc37e'),
  '649dcaa0dd63a01772deb35a2f8edba38278d1f6': endpoint.bind(null, '649dcaa0dd63a01772deb35a2f8edba38278d1f6'),
  '9aa6d06696f86715cd2894a2b977b168150df461': endpoint.bind(null, '9aa6d06696f86715cd2894a2b977b168150df461'),
}


/***/ })

};
;