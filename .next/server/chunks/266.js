exports.id = 266;
exports.ids = [266];
exports.modules = {

/***/ 22670:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

Promise.resolve(/* import() eager */).then(__webpack_require__.bind(__webpack_require__, 52990));
Promise.resolve(/* import() eager */).then(__webpack_require__.bind(__webpack_require__, 54390));
Promise.resolve(/* import() eager */).then(__webpack_require__.bind(__webpack_require__, 84102));
Promise.resolve(/* import() eager */).then(__webpack_require__.bind(__webpack_require__, 16373));
Promise.resolve(/* import() eager */).then(__webpack_require__.bind(__webpack_require__, 92384));
Promise.resolve(/* import() eager */).then(__webpack_require__.t.bind(__webpack_require__, 73380, 23));
Promise.resolve(/* import() eager */).then(__webpack_require__.t.bind(__webpack_require__, 50954, 23));
Promise.resolve(/* import() eager */).then(__webpack_require__.bind(__webpack_require__, 14319))

/***/ }),

/***/ 14319:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(76931);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(58981);
/* harmony import */ var next_navigation__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(57114);
/* harmony import */ var next_navigation__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_navigation__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var next_link__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(11440);
/* harmony import */ var next_link__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(next_link__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var next_image__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(52451);
/* harmony import */ var next_image__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(next_image__WEBPACK_IMPORTED_MODULE_4__);
/* __next_internal_client_entry_do_not_use__ default auto */ 




function Bottombar() {
    const pathname = (0,next_navigation__WEBPACK_IMPORTED_MODULE_2__.usePathname)();
    return /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("section", {
        className: "bottombar",
        children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
            className: "bottombar_container",
            children: _constants__WEBPACK_IMPORTED_MODULE_1__/* .sidebarLinks */ .A8.map((link)=>{
                const isActive = pathname.includes(link.route) && link.route.length > 1 || pathname === link.route;
                return /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)((next_link__WEBPACK_IMPORTED_MODULE_3___default()), {
                    href: link.route,
                    className: `bottombar_link ${isActive && "bg-primary-500"}`,
                    children: [
                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx((next_image__WEBPACK_IMPORTED_MODULE_4___default()), {
                            src: link.imgURL,
                            alt: link.label,
                            width: 24,
                            height: 24
                        }),
                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("p", {
                            className: "text-subtle-medium text-light-1 max-sm:hidden",
                            children: link.label.split(/\s+/)[0]
                        })
                    ]
                }, link.label);
            })
        })
    });
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Bottombar);


/***/ }),

/***/ 92384:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(76931);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(58981);
/* harmony import */ var next_link__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(11440);
/* harmony import */ var next_link__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_link__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var next_image__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(52451);
/* harmony import */ var next_image__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(next_image__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var next_navigation__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(57114);
/* harmony import */ var next_navigation__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(next_navigation__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _clerk_nextjs__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(63758);
/* harmony import */ var _clerk_nextjs__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(11655);
/* __next_internal_client_entry_do_not_use__ default auto */ 





function LeftSidebar() {
    const router = (0,next_navigation__WEBPACK_IMPORTED_MODULE_4__.useRouter)();
    const pathname = (0,next_navigation__WEBPACK_IMPORTED_MODULE_4__.usePathname)();
    const { userId } = (0,_clerk_nextjs__WEBPACK_IMPORTED_MODULE_5__/* .useAuth */ .aC)();
    return /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("section", {
        className: "custom-scrollbar leftsidebar",
        children: [
            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                className: "flex-w-full flex-1 flex-col gap-6 px-6",
                children: _constants__WEBPACK_IMPORTED_MODULE_1__/* .sidebarLinks */ .A8.map((link)=>{
                    const isActive = pathname.includes(link.route) && link.route.length > 1 || pathname === link.route;
                    if (link.route === "/profile") link.route = `${link.route}/${userId}`;
                    return /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)((next_link__WEBPACK_IMPORTED_MODULE_2___default()), {
                        href: link.route,
                        className: `leftsidebar_link ${isActive && "bg-primary-500"}`,
                        children: [
                            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx((next_image__WEBPACK_IMPORTED_MODULE_3___default()), {
                                src: link.imgURL,
                                alt: link.label,
                                width: 24,
                                height: 24
                            }),
                            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("p", {
                                className: "text-light-1 max-lg:hidden",
                                children: link.label
                            })
                        ]
                    }, link.label);
                })
            }),
            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                className: "mt-10 px-6",
                children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_clerk_nextjs__WEBPACK_IMPORTED_MODULE_6__/* .SignedIn */ .CH, {
                    children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_clerk_nextjs__WEBPACK_IMPORTED_MODULE_5__/* .SignOutButton */ .AM, {
                        signOutCallback: ()=>router.push("/sign-in"),
                        children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                            className: "flex cursor-pointer gap-4 p-4",
                            children: [
                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx((next_image__WEBPACK_IMPORTED_MODULE_3___default()), {
                                    src: "/assets/logout.svg",
                                    alt: "logout",
                                    width: 24,
                                    height: 24
                                }),
                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("p", {
                                    className: "text-light-2 max-lg:hidden",
                                    children: "Logout"
                                })
                            ]
                        })
                    })
                })
            })
        ]
    });
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (LeftSidebar);


/***/ }),

/***/ 58981:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A8: () => (/* binding */ sidebarLinks)
/* harmony export */ });
/* unused harmony exports profileTabs, communityTabs */
const sidebarLinks = [
    {
        imgURL: "/assets/home.svg",
        route: "/",
        label: "Home"
    },
    {
        imgURL: "/assets/search.svg",
        route: "/search",
        label: "Search"
    },
    {
        imgURL: "/assets/heart.svg",
        route: "/activity",
        label: "Activity"
    },
    {
        imgURL: "/assets/create.svg",
        route: "/create-thread",
        label: "Create Thread"
    },
    {
        imgURL: "/assets/community.svg",
        route: "/communities",
        label: "Communities"
    },
    {
        imgURL: "/assets/user.svg",
        route: "/profile",
        label: "Profile"
    }
];
const profileTabs = [
    {
        value: "threads",
        label: "Threads",
        icon: "/assets/reply.svg"
    },
    {
        value: "replies",
        label: "Replies",
        icon: "/assets/members.svg"
    },
    {
        value: "tagged",
        label: "Tagged",
        icon: "/assets/tag.svg"
    }
];
const communityTabs = [
    {
        value: "threads",
        label: "Threads",
        icon: "/assets/reply.svg"
    },
    {
        value: "members",
        label: "Members",
        icon: "/assets/members.svg"
    },
    {
        value: "requests",
        label: "Requests",
        icon: "/assets/request.svg"
    }
];


/***/ }),

/***/ 57109:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ RootLayout),
  metadata: () => (/* binding */ metadata)
});

// EXTERNAL MODULE: external "next/dist/compiled/react-experimental/jsx-runtime"
var jsx_runtime_ = __webpack_require__(76931);
// EXTERNAL MODULE: ./node_modules/next/font/google/target.css?{"path":"app\\(root)\\layout.tsx","import":"Inter","arguments":[{"subsets":["latin"]}],"variableName":"inter"}
var target_path_app_root_layout_tsx_import_Inter_arguments_subsets_latin_variableName_inter_ = __webpack_require__(94518);
var target_path_app_root_layout_tsx_import_Inter_arguments_subsets_latin_variableName_inter_default = /*#__PURE__*/__webpack_require__.n(target_path_app_root_layout_tsx_import_Inter_arguments_subsets_latin_variableName_inter_);
// EXTERNAL MODULE: ./app/globals.css
var globals = __webpack_require__(67272);
// EXTERNAL MODULE: ./node_modules/@clerk/nextjs/dist/esm/index.js + 22 modules
var esm = __webpack_require__(24425);
;// CONCATENATED MODULE: ./components/shared/RightSidebar.tsx

function RightSidebar() {
    return /*#__PURE__*/ (0,jsx_runtime_.jsxs)("section", {
        className: "custom-scrollbar rightsidebar",
        children: [
            /*#__PURE__*/ jsx_runtime_.jsx("div", {
                className: "flex flex-1 felx-col justify-start",
                children: /*#__PURE__*/ jsx_runtime_.jsx("h3", {
                    className: "text-heading4-medium text-light-1",
                    children: "Suggested Communities"
                })
            }),
            /*#__PURE__*/ jsx_runtime_.jsx("div", {
                className: "flex flex-1 felx-col justify-start",
                children: /*#__PURE__*/ jsx_runtime_.jsx("h3", {
                    className: "text-heading4-medium text-light-1",
                    children: "Suggested Users"
                })
            })
        ]
    });
}
/* harmony default export */ const shared_RightSidebar = (RightSidebar);

// EXTERNAL MODULE: ./node_modules/next/dist/build/webpack/loaders/next-flight-loader/module-proxy.js
var module_proxy = __webpack_require__(61363);
;// CONCATENATED MODULE: ./components/shared/LeftSidebar.tsx

const proxy = (0,module_proxy.createProxy)(String.raw`D:\Visual Studio\threads\components\shared\LeftSidebar.tsx`)

// Accessing the __esModule property and exporting $$typeof are required here.
// The __esModule getter forces the proxy target to create the default export
// and the $$typeof value is for rendering logic to determine if the module
// is a client boundary.
const { __esModule, $$typeof } = proxy;
const __default__ = proxy.default;


/* harmony default export */ const LeftSidebar = (__default__);
// EXTERNAL MODULE: ./node_modules/@clerk/nextjs/dist/esm/client-boundary/uiComponents.js
var uiComponents = __webpack_require__(68422);
// EXTERNAL MODULE: ./node_modules/next/image.js
var next_image = __webpack_require__(14178);
var image_default = /*#__PURE__*/__webpack_require__.n(next_image);
// EXTERNAL MODULE: ./node_modules/next/link.js
var next_link = __webpack_require__(25124);
var link_default = /*#__PURE__*/__webpack_require__.n(next_link);
// EXTERNAL MODULE: ./node_modules/@clerk/themes/dist/themes/src/index.js
var src = __webpack_require__(20254);
;// CONCATENATED MODULE: ./components/shared/Topbar.tsx





function Topbar() {
    return /*#__PURE__*/ (0,jsx_runtime_.jsxs)("nav", {
        className: "topbar",
        children: [
            /*#__PURE__*/ (0,jsx_runtime_.jsxs)((link_default()), {
                href: "/",
                className: "flex items-center gap-4",
                children: [
                    /*#__PURE__*/ jsx_runtime_.jsx((image_default()), {
                        src: "/assets/logo.svg",
                        alt: "logo",
                        width: 28,
                        height: 28
                    }),
                    /*#__PURE__*/ jsx_runtime_.jsx("p", {
                        className: "text-heading3-bold text-light-1 max-xs:hidden",
                        children: "Threads"
                    })
                ]
            }),
            /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                className: "flex items-center gap-1",
                children: [
                    /*#__PURE__*/ jsx_runtime_.jsx("div", {
                        className: "block md:hidden",
                        children: /*#__PURE__*/ jsx_runtime_.jsx(esm/* SignedIn */.CH, {
                            children: /*#__PURE__*/ jsx_runtime_.jsx(uiComponents/* SignOutButton */.AM, {
                                children: /*#__PURE__*/ jsx_runtime_.jsx("div", {
                                    className: "flex cursor-pointer",
                                    children: /*#__PURE__*/ jsx_runtime_.jsx((image_default()), {
                                        src: "/assets/logout.svg",
                                        alt: "logout",
                                        width: 24,
                                        height: 24
                                    })
                                })
                            })
                        })
                    }),
                    /*#__PURE__*/ jsx_runtime_.jsx(uiComponents/* OrganizationSwitcher */.Li, {
                        appearance: {
                            baseTheme: src.dark,
                            elements: {
                                organizationSwitcherTrigger: "py-2 px-4"
                            }
                        }
                    })
                ]
            })
        ]
    });
}
/* harmony default export */ const shared_Topbar = (Topbar);

;// CONCATENATED MODULE: ./components/shared/Bottombar.tsx

const Bottombar_proxy = (0,module_proxy.createProxy)(String.raw`D:\Visual Studio\threads\components\shared\Bottombar.tsx`)

// Accessing the __esModule property and exporting $$typeof are required here.
// The __esModule getter forces the proxy target to create the default export
// and the $$typeof value is for rendering logic to determine if the module
// is a client boundary.
const { __esModule: Bottombar_esModule, $$typeof: Bottombar_$$typeof } = Bottombar_proxy;
const Bottombar_default_ = Bottombar_proxy.default;


/* harmony default export */ const Bottombar = (Bottombar_default_);
;// CONCATENATED MODULE: ./app/(root)/layout.tsx








const metadata = {
    title: "Threads",
    description: "A Next.js 13 Meta Threads application"
};
function RootLayout({ children }) {
    return /*#__PURE__*/ jsx_runtime_.jsx(esm/* ClerkProvider */.El, {
        children: /*#__PURE__*/ jsx_runtime_.jsx("html", {
            lang: "en",
            children: /*#__PURE__*/ (0,jsx_runtime_.jsxs)("body", {
                className: (target_path_app_root_layout_tsx_import_Inter_arguments_subsets_latin_variableName_inter_default()).className,
                children: [
                    /*#__PURE__*/ jsx_runtime_.jsx(shared_Topbar, {}),
                    /*#__PURE__*/ (0,jsx_runtime_.jsxs)("main", {
                        className: "flex flex-row",
                        children: [
                            /*#__PURE__*/ jsx_runtime_.jsx(LeftSidebar, {}),
                            /*#__PURE__*/ jsx_runtime_.jsx("section", {
                                className: "main-container",
                                children: /*#__PURE__*/ jsx_runtime_.jsx("div", {
                                    className: "w-full max-w-4xl",
                                    children: children
                                })
                            }),
                            /*#__PURE__*/ jsx_runtime_.jsx(shared_RightSidebar, {})
                        ]
                    }),
                    /*#__PURE__*/ jsx_runtime_.jsx(Bottombar, {})
                ]
            })
        })
    });
}


/***/ })

};
;