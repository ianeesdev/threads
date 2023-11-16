"use strict";
exports.id = 6297;
exports.ids = [6297];
exports.modules = {

/***/ 99805:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Ho: () => (/* binding */ addCommentToThread),
/* harmony export */   gK: () => (/* binding */ createThread)
/* harmony export */ });
/* unused harmony exports fetchPosts, deleteThread, fetchThreadById */
/* harmony import */ var next_dist_client_app_call_server__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(56937);
/* harmony import */ var next_dist_client_app_call_server__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_client_app_call_server__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var private_next_rsc_action_proxy__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(53009);
/* harmony import */ var private_next_rsc_action_client_wrapper__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(61324);



function __build_action__(action, args) {
  return callServer(action.$$id, args)
}

/* __next_internal_action_entry_do_not_use__ fetchPosts,createThread,deleteThread,fetchThreadById,addCommentToThread */ 

var fetchPosts = (0,private_next_rsc_action_client_wrapper__WEBPACK_IMPORTED_MODULE_2__/* ["default"] */ .Z)("9119082451624675866be88db37e9caba14479ae");
var createThread = (0,private_next_rsc_action_client_wrapper__WEBPACK_IMPORTED_MODULE_2__/* ["default"] */ .Z)("f73053d2de9e1667d0b5f2f6e0d62fafa1a171fc");
var deleteThread = (0,private_next_rsc_action_client_wrapper__WEBPACK_IMPORTED_MODULE_2__/* ["default"] */ .Z)("ea5a98f10beb6798ec2b5de59f87e9b999a28aaa");
var fetchThreadById = (0,private_next_rsc_action_client_wrapper__WEBPACK_IMPORTED_MODULE_2__/* ["default"] */ .Z)("b4540bd1a75c2cca185376da985691a980fe76de");
var addCommentToThread = (0,private_next_rsc_action_client_wrapper__WEBPACK_IMPORTED_MODULE_2__/* ["default"] */ .Z)("14546084250cfbae5acbf403ab2cdce6b058d75d");



/***/ }),

/***/ 91555:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   f: () => (/* binding */ ThreadValidation),
/* harmony export */   g: () => (/* binding */ CommentValidation)
/* harmony export */ });
/* harmony import */ var zod__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(19098);

const ThreadValidation = zod__WEBPACK_IMPORTED_MODULE_0__/* .object */ .Ry({
    thread: zod__WEBPACK_IMPORTED_MODULE_0__/* .string */ .Z_().nonempty().min(3, {
        message: "Minimum 3 characters"
    }),
    accountId: zod__WEBPACK_IMPORTED_MODULE_0__/* .string */ .Z_()
});
const CommentValidation = zod__WEBPACK_IMPORTED_MODULE_0__/* .object */ .Ry({
    thread: zod__WEBPACK_IMPORTED_MODULE_0__/* .string */ .Z_().nonempty().min(3, {
        message: "Minimum 3 characters"
    })
});


/***/ })

};
;