exports.id = 5095;
exports.ids = [5095];
exports.modules = {

/***/ 5095:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


const actions = {
'04d7d7e152e8d43bfe133b1700993e9c36dbb4f8': () => Promise.resolve(/* import() eager */).then(__webpack_require__.bind(__webpack_require__, 18776)).then(mod => mod["fetchUser"]),
'83fcee668a299ee1ced696e4187f18f466498dfe': () => Promise.resolve(/* import() eager */).then(__webpack_require__.bind(__webpack_require__, 18776)).then(mod => mod["updateUser"]),
'ab3efaa7beb509971f347285944bad7f244fc37e': () => Promise.resolve(/* import() eager */).then(__webpack_require__.bind(__webpack_require__, 18776)).then(mod => mod["fetchUserPosts"]),
'649dcaa0dd63a01772deb35a2f8edba38278d1f6': () => Promise.resolve(/* import() eager */).then(__webpack_require__.bind(__webpack_require__, 18776)).then(mod => mod["fetchUsers"]),
'9aa6d06696f86715cd2894a2b977b168150df461': () => Promise.resolve(/* import() eager */).then(__webpack_require__.bind(__webpack_require__, 18776)).then(mod => mod["getActivity"]),
'6b7d8dd8616cf147e2a693797145776d16566ddd': () => Promise.resolve(/* import() eager */).then(__webpack_require__.bind(__webpack_require__, 93040)).then(mod => mod["createCommunity"]),
'443e38cbb599f0715a412cbeb6dfebeaf1292b20': () => Promise.resolve(/* import() eager */).then(__webpack_require__.bind(__webpack_require__, 93040)).then(mod => mod["fetchCommunityDetails"]),
'27271acdc7e713161edbb6d9eb10b9c5ba5c7b6a': () => Promise.resolve(/* import() eager */).then(__webpack_require__.bind(__webpack_require__, 93040)).then(mod => mod["fetchCommunityPosts"]),
'74b2d77455009b3c9df7bb11ceb9663541d0f282': () => Promise.resolve(/* import() eager */).then(__webpack_require__.bind(__webpack_require__, 93040)).then(mod => mod["fetchCommunities"]),
'e23b5a1d45471b962bf2d9bf4469b15a12ae5ccf': () => Promise.resolve(/* import() eager */).then(__webpack_require__.bind(__webpack_require__, 93040)).then(mod => mod["addMemberToCommunity"]),
'f293b114e20a2499a42f1f38bdbef9a083efecaf': () => Promise.resolve(/* import() eager */).then(__webpack_require__.bind(__webpack_require__, 93040)).then(mod => mod["removeUserFromCommunity"]),
'c3cbaa9992841e6acbf16a6f1cb7b5570715225c': () => Promise.resolve(/* import() eager */).then(__webpack_require__.bind(__webpack_require__, 93040)).then(mod => mod["updateCommunityInfo"]),
'73fca39604394fb69fb677f54cdc7473753a3126': () => Promise.resolve(/* import() eager */).then(__webpack_require__.bind(__webpack_require__, 93040)).then(mod => mod["deleteCommunity"]),
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
  '6b7d8dd8616cf147e2a693797145776d16566ddd': endpoint.bind(null, '6b7d8dd8616cf147e2a693797145776d16566ddd'),
  '443e38cbb599f0715a412cbeb6dfebeaf1292b20': endpoint.bind(null, '443e38cbb599f0715a412cbeb6dfebeaf1292b20'),
  '27271acdc7e713161edbb6d9eb10b9c5ba5c7b6a': endpoint.bind(null, '27271acdc7e713161edbb6d9eb10b9c5ba5c7b6a'),
  '74b2d77455009b3c9df7bb11ceb9663541d0f282': endpoint.bind(null, '74b2d77455009b3c9df7bb11ceb9663541d0f282'),
  'e23b5a1d45471b962bf2d9bf4469b15a12ae5ccf': endpoint.bind(null, 'e23b5a1d45471b962bf2d9bf4469b15a12ae5ccf'),
  'f293b114e20a2499a42f1f38bdbef9a083efecaf': endpoint.bind(null, 'f293b114e20a2499a42f1f38bdbef9a083efecaf'),
  'c3cbaa9992841e6acbf16a6f1cb7b5570715225c': endpoint.bind(null, 'c3cbaa9992841e6acbf16a6f1cb7b5570715225c'),
  '73fca39604394fb69fb677f54cdc7473753a3126': endpoint.bind(null, '73fca39604394fb69fb677f54cdc7473753a3126'),
}


/***/ })

};
;