"use strict";
(() => {
var exports = {};
exports.id = 240;
exports.ids = [240];
exports.modules = {

/***/ 11185:
/***/ ((module) => {

module.exports = require("mongoose");

/***/ }),

/***/ 13685:
/***/ ((module) => {

module.exports = require("http");

/***/ }),

/***/ 95687:
/***/ ((module) => {

module.exports = require("https");

/***/ }),

/***/ 22037:
/***/ ((module) => {

module.exports = require("os");

/***/ }),

/***/ 85477:
/***/ ((module) => {

module.exports = require("punycode");

/***/ }),

/***/ 12781:
/***/ ((module) => {

module.exports = require("stream");

/***/ }),

/***/ 57310:
/***/ ((module) => {

module.exports = require("url");

/***/ }),

/***/ 59796:
/***/ ((module) => {

module.exports = require("zlib");

/***/ }),

/***/ 21304:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  headerHooks: () => (/* binding */ headerHooks),
  originalPathname: () => (/* binding */ originalPathname),
  requestAsyncStorage: () => (/* binding */ requestAsyncStorage),
  routeModule: () => (/* binding */ routeModule),
  serverHooks: () => (/* binding */ serverHooks),
  staticGenerationAsyncStorage: () => (/* binding */ staticGenerationAsyncStorage),
  staticGenerationBailout: () => (/* binding */ staticGenerationBailout)
});

// NAMESPACE OBJECT: ./app/api/webhook/clerk/route.ts
var route_namespaceObject = {};
__webpack_require__.r(route_namespaceObject);
__webpack_require__.d(route_namespaceObject, {
  POST: () => (POST)
});

// EXTERNAL MODULE: ./node_modules/next/dist/server/node-polyfill-headers.js
var node_polyfill_headers = __webpack_require__(42394);
// EXTERNAL MODULE: ./node_modules/next/dist/server/future/route-modules/app-route/module.js
var app_route_module = __webpack_require__(69692);
// EXTERNAL MODULE: ./node_modules/next/dist/server/future/route-kind.js
var route_kind = __webpack_require__(19513);
// EXTERNAL MODULE: ./node_modules/svix/dist/index.js
var dist = __webpack_require__(58777);
// EXTERNAL MODULE: ./node_modules/next/headers.js
var headers = __webpack_require__(40063);
// EXTERNAL MODULE: ./node_modules/next/dist/server/web/exports/next-response.js
var next_response = __webpack_require__(89335);
// EXTERNAL MODULE: ./lib/actions/community.actions.ts
var community_actions = __webpack_require__(93040);
;// CONCATENATED MODULE: ./app/api/webhook/clerk/route.ts
/* eslint-disable camelcase */ // Resource: https://clerk.com/docs/users/sync-data-to-your-backend
// Above article shows why we need webhooks i.e., to sync data to our backend
// Resource: https://docs.svix.com/receiving/verifying-payloads/why
// It's a good practice to verify webhooks. Above article shows why we should do it




const POST = async (request)=>{
    const payload = await request.json();
    const header = (0,headers.headers)();
    const heads = {
        "svix-id": header.get("svix-id"),
        "svix-timestamp": header.get("svix-timestamp"),
        "svix-signature": header.get("svix-signature")
    };
    // Activitate Webhook in the Clerk Dashboard.
    // After adding the endpoint, you'll see the secret on the right side.
    const wh = new dist.Webhook(process.env.NEXT_CLERK_WEBHOOK_SECRET || "");
    let evnt = null;
    try {
        evnt = wh.verify(JSON.stringify(payload), heads);
    } catch (err) {
        return next_response/* default */.Z.json({
            message: err
        }, {
            status: 400
        });
    }
    const eventType = evnt?.type;
    // Listen organization creation event
    if (eventType === "organization.created") {
        // Resource: https://clerk.com/docs/reference/backend-api/tag/Organizations#operation/CreateOrganization
        // Show what evnt?.data sends from above resource
        const { id, name, slug, logo_url, image_url, created_by } = evnt?.data ?? {};
        try {
            // @ts-ignore
            await (0,community_actions.createCommunity)(// @ts-ignore
            id, name, slug, logo_url || image_url, "org bio", created_by);
            return next_response/* default */.Z.json({
                message: "User created"
            }, {
                status: 201
            });
        } catch (err) {
            console.log(err);
            return next_response/* default */.Z.json({
                message: "Internal Server Error"
            }, {
                status: 500
            });
        }
    }
    // Listen organization invitation creation event.
    // Just to show. You can avoid this or tell people that we can create a new mongoose action and
    // add pending invites in the database.
    if (eventType === "organizationInvitation.created") {
        try {
            // Resource: https://clerk.com/docs/reference/backend-api/tag/Organization-Invitations#operation/CreateOrganizationInvitation
            console.log("Invitation created", evnt?.data);
            return next_response/* default */.Z.json({
                message: "Invitation created"
            }, {
                status: 201
            });
        } catch (err) {
            console.log(err);
            return next_response/* default */.Z.json({
                message: "Internal Server Error"
            }, {
                status: 500
            });
        }
    }
    // Listen organization membership (member invite & accepted) creation
    if (eventType === "organizationMembership.created") {
        try {
            // Resource: https://clerk.com/docs/reference/backend-api/tag/Organization-Memberships#operation/CreateOrganizationMembership
            // Show what evnt?.data sends from above resource
            const { organization, public_user_data } = evnt?.data;
            console.log("created", evnt?.data);
            // @ts-ignore
            await (0,community_actions.addMemberToCommunity)(organization.id, public_user_data.user_id);
            return next_response/* default */.Z.json({
                message: "Invitation accepted"
            }, {
                status: 201
            });
        } catch (err) {
            console.log(err);
            return next_response/* default */.Z.json({
                message: "Internal Server Error"
            }, {
                status: 500
            });
        }
    }
    // Listen member deletion event
    if (eventType === "organizationMembership.deleted") {
        try {
            // Resource: https://clerk.com/docs/reference/backend-api/tag/Organization-Memberships#operation/DeleteOrganizationMembership
            // Show what evnt?.data sends from above resource
            const { organization, public_user_data } = evnt?.data;
            console.log("removed", evnt?.data);
            // @ts-ignore
            await (0,community_actions.removeUserFromCommunity)(public_user_data.user_id, organization.id);
            return next_response/* default */.Z.json({
                message: "Member removed"
            }, {
                status: 201
            });
        } catch (err) {
            console.log(err);
            return next_response/* default */.Z.json({
                message: "Internal Server Error"
            }, {
                status: 500
            });
        }
    }
    // Listen organization updation event
    if (eventType === "organization.updated") {
        try {
            // Resource: https://clerk.com/docs/reference/backend-api/tag/Organizations#operation/UpdateOrganization
            // Show what evnt?.data sends from above resource
            const { id, logo_url, name, slug } = evnt?.data;
            console.log("updated", evnt?.data);
            // @ts-ignore
            await (0,community_actions.updateCommunityInfo)(id, name, slug, logo_url);
            return next_response/* default */.Z.json({
                message: "Member removed"
            }, {
                status: 201
            });
        } catch (err) {
            console.log(err);
            return next_response/* default */.Z.json({
                message: "Internal Server Error"
            }, {
                status: 500
            });
        }
    }
    // Listen organization deletion event
    if (eventType === "organization.deleted") {
        try {
            // Resource: https://clerk.com/docs/reference/backend-api/tag/Organizations#operation/DeleteOrganization
            // Show what evnt?.data sends from above resource
            const { id } = evnt?.data;
            console.log("deleted", evnt?.data);
            // @ts-ignore
            await (0,community_actions.deleteCommunity)(id);
            return next_response/* default */.Z.json({
                message: "Organization deleted"
            }, {
                status: 201
            });
        } catch (err) {
            console.log(err);
            return next_response/* default */.Z.json({
                message: "Internal Server Error"
            }, {
                status: 500
            });
        }
    }
};

;// CONCATENATED MODULE: ./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?page=%2Fapi%2Fwebhook%2Fclerk%2Froute&name=app%2Fapi%2Fwebhook%2Fclerk%2Froute&pagePath=private-next-app-dir%2Fapi%2Fwebhook%2Fclerk%2Froute.ts&appDir=D%3A%5CVisual%20Studio%5Cthreads%5Capp&appPaths=%2Fapi%2Fwebhook%2Fclerk%2Froute&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!

// @ts-ignore this need to be imported from next/dist to be external


// @ts-expect-error - replaced by webpack/turbopack loader

const AppRouteRouteModule = app_route_module.AppRouteRouteModule;
// We inject the nextConfigOutput here so that we can use them in the route
// module.
const nextConfigOutput = ""
const routeModule = new AppRouteRouteModule({
    definition: {
        kind: route_kind.RouteKind.APP_ROUTE,
        page: "/api/webhook/clerk/route",
        pathname: "/api/webhook/clerk",
        filename: "route",
        bundlePath: "app/api/webhook/clerk/route"
    },
    resolvedPagePath: "D:\\Visual Studio\\threads\\app\\api\\webhook\\clerk\\route.ts",
    nextConfigOutput,
    userland: route_namespaceObject
});
// Pull out the exports that we need to expose from the module. This should
// be eliminated when we've moved the other routes to the new format. These
// are used to hook into the route.
const { requestAsyncStorage , staticGenerationAsyncStorage , serverHooks , headerHooks , staticGenerationBailout  } = routeModule;
const originalPathname = "/api/webhook/clerk/route";


//# sourceMappingURL=app-route.js.map

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, [3342,4813,2961,9841,5501,8777,5435,3040], () => (__webpack_exec__(21304)));
module.exports = __webpack_exports__;

})();