"use strict";
exports.id = 8776;
exports.ids = [8776];
exports.modules = {

/***/ 18776:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   fetchUser: () => (/* binding */ fetchUser),
/* harmony export */   fetchUserPosts: () => (/* binding */ fetchUserPosts),
/* harmony export */   fetchUsers: () => (/* binding */ fetchUsers),
/* harmony export */   getActivity: () => (/* binding */ getActivity),
/* harmony export */   updateUser: () => (/* binding */ updateUser)
/* harmony export */ });
/* harmony import */ var private_next_rsc_action_proxy__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(44269);
/* harmony import */ var next_cache__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6285);
/* harmony import */ var next_cache__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(next_cache__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _models_community_model__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(88935);
/* harmony import */ var _models_thread_model__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(42841);
/* harmony import */ var _models_user_model__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(43047);
/* harmony import */ var _mongoose__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(28198);
/* harmony import */ var private_next_rsc_action_validate__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(53559);
/* __next_internal_action_entry_do_not_use__ fetchUser,updateUser,fetchUserPosts,fetchUsers,getActivity */ 





async function fetchUser(userId) {
    try {
        (0,_mongoose__WEBPACK_IMPORTED_MODULE_5__/* .connectToDB */ .P)();
        return await _models_user_model__WEBPACK_IMPORTED_MODULE_4__/* ["default"] */ .Z.findOne({
            id: userId
        }).populate({
            path: "communities",
            model: _models_community_model__WEBPACK_IMPORTED_MODULE_2__/* ["default"] */ .Z
        });
    } catch (error) {
        throw new Error(`Failed to fetch user: ${error.message}`);
    }
}
async function updateUser({ userId, bio, name, path, username, image }) {
    try {
        (0,_mongoose__WEBPACK_IMPORTED_MODULE_5__/* .connectToDB */ .P)();
        await _models_user_model__WEBPACK_IMPORTED_MODULE_4__/* ["default"] */ .Z.findOneAndUpdate({
            id: userId
        }, {
            username: username.toLowerCase(),
            name,
            bio,
            image,
            onboarded: true
        }, {
            upsert: true
        });
        if (path === "/profile/edit") {
            (0,next_cache__WEBPACK_IMPORTED_MODULE_1__.revalidatePath)(path);
        }
    } catch (error) {
        throw new Error(`Failed to create/update user: ${error.message}`);
    }
}
async function fetchUserPosts(userId) {
    try {
        (0,_mongoose__WEBPACK_IMPORTED_MODULE_5__/* .connectToDB */ .P)();
        // Find all threads authored by the user with the given userId
        const threads = await _models_user_model__WEBPACK_IMPORTED_MODULE_4__/* ["default"] */ .Z.findOne({
            id: userId
        }).populate({
            path: "threads",
            model: _models_thread_model__WEBPACK_IMPORTED_MODULE_3__/* ["default"] */ .Z,
            populate: [
                {
                    path: "community",
                    model: _models_community_model__WEBPACK_IMPORTED_MODULE_2__/* ["default"] */ .Z,
                    select: "name id image _id"
                },
                {
                    path: "children",
                    model: _models_thread_model__WEBPACK_IMPORTED_MODULE_3__/* ["default"] */ .Z,
                    populate: {
                        path: "author",
                        model: _models_user_model__WEBPACK_IMPORTED_MODULE_4__/* ["default"] */ .Z,
                        select: "name image id"
                    }
                }
            ]
        });
        return threads;
    } catch (error) {
        console.error("Error fetching user threads:", error);
        throw error;
    }
}
// Almost similar to Thead (search + pagination) and Community (search + pagination)
async function fetchUsers({ userId, searchString = "", pageNumber = 1, pageSize = 20, sortBy = "desc" }) {
    try {
        (0,_mongoose__WEBPACK_IMPORTED_MODULE_5__/* .connectToDB */ .P)();
        // Calculate the number of users to skip based on the page number and page size.
        const skipAmount = (pageNumber - 1) * pageSize;
        // Create a case-insensitive regular expression for the provided search string.
        const regex = new RegExp(searchString, "i");
        // Create an initial query object to filter users.
        const query = {
            id: {
                $ne: userId
            }
        };
        // If the search string is not empty, add the $or operator to match either username or name fields.
        if (searchString.trim() !== "") {
            query.$or = [
                {
                    username: {
                        $regex: regex
                    }
                },
                {
                    name: {
                        $regex: regex
                    }
                }
            ];
        }
        // Define the sort options for the fetched users based on createdAt field and provided sort order.
        const sortOptions = {
            createdAt: sortBy
        };
        const usersQuery = _models_user_model__WEBPACK_IMPORTED_MODULE_4__/* ["default"] */ .Z.find(query).sort(sortOptions).skip(skipAmount).limit(pageSize);
        // Count the total number of users that match the search criteria (without pagination).
        const totalUsersCount = await _models_user_model__WEBPACK_IMPORTED_MODULE_4__/* ["default"] */ .Z.countDocuments(query);
        const users = await usersQuery.exec();
        // Check if there are more users beyond the current page.
        const isNext = totalUsersCount > skipAmount + users.length;
        return {
            users,
            isNext
        };
    } catch (error) {
        console.error("Error fetching users:", error);
        throw error;
    }
}
async function getActivity(userId) {
    try {
        (0,_mongoose__WEBPACK_IMPORTED_MODULE_5__/* .connectToDB */ .P)();
        // Find all threads created by the user
        const userThreads = await _models_thread_model__WEBPACK_IMPORTED_MODULE_3__/* ["default"] */ .Z.find({
            author: userId
        });
        // Collect all the child thread ids (replies) from the 'children' field of each user thread
        const childThreadIds = userThreads.reduce((acc, userThread)=>{
            return acc.concat(userThread.children);
        }, []);
        // Find and return the child threads (replies) excluding the ones created by the same user
        const replies = await _models_thread_model__WEBPACK_IMPORTED_MODULE_3__/* ["default"] */ .Z.find({
            _id: {
                $in: childThreadIds
            },
            author: {
                $ne: userId
            }
        }).populate({
            path: "author",
            model: _models_user_model__WEBPACK_IMPORTED_MODULE_4__/* ["default"] */ .Z,
            select: "name image _id"
        });
        return replies;
    } catch (error) {
        console.error("Error fetching replies: ", error);
        throw error;
    }
}

(0,private_next_rsc_action_validate__WEBPACK_IMPORTED_MODULE_6__/* ["default"] */ .Z)([
    fetchUser,
    updateUser,
    fetchUserPosts,
    fetchUsers,
    getActivity
]);
(0,private_next_rsc_action_proxy__WEBPACK_IMPORTED_MODULE_0__/* .createActionProxy */ .U)("04d7d7e152e8d43bfe133b1700993e9c36dbb4f8", null, fetchUser);
(0,private_next_rsc_action_proxy__WEBPACK_IMPORTED_MODULE_0__/* .createActionProxy */ .U)("83fcee668a299ee1ced696e4187f18f466498dfe", null, updateUser);
(0,private_next_rsc_action_proxy__WEBPACK_IMPORTED_MODULE_0__/* .createActionProxy */ .U)("ab3efaa7beb509971f347285944bad7f244fc37e", null, fetchUserPosts);
(0,private_next_rsc_action_proxy__WEBPACK_IMPORTED_MODULE_0__/* .createActionProxy */ .U)("649dcaa0dd63a01772deb35a2f8edba38278d1f6", null, fetchUsers);
(0,private_next_rsc_action_proxy__WEBPACK_IMPORTED_MODULE_0__/* .createActionProxy */ .U)("9aa6d06696f86715cd2894a2b977b168150df461", null, getActivity);


/***/ })

};
;