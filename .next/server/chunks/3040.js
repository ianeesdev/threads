"use strict";
exports.id = 3040;
exports.ids = [3040];
exports.modules = {

/***/ 93040:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   addMemberToCommunity: () => (/* binding */ addMemberToCommunity),
/* harmony export */   createCommunity: () => (/* binding */ createCommunity),
/* harmony export */   deleteCommunity: () => (/* binding */ deleteCommunity),
/* harmony export */   fetchCommunities: () => (/* binding */ fetchCommunities),
/* harmony export */   fetchCommunityDetails: () => (/* binding */ fetchCommunityDetails),
/* harmony export */   fetchCommunityPosts: () => (/* binding */ fetchCommunityPosts),
/* harmony export */   removeUserFromCommunity: () => (/* binding */ removeUserFromCommunity),
/* harmony export */   updateCommunityInfo: () => (/* binding */ updateCommunityInfo)
/* harmony export */ });
/* harmony import */ var private_next_rsc_action_proxy__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(44269);
/* harmony import */ var _models_community_model__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(88935);
/* harmony import */ var _models_thread_model__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(42841);
/* harmony import */ var _models_user_model__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(43047);
/* harmony import */ var _mongoose__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(28198);
/* harmony import */ var private_next_rsc_action_validate__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(53559);
/* __next_internal_action_entry_do_not_use__ createCommunity,fetchCommunityDetails,fetchCommunityPosts,fetchCommunities,addMemberToCommunity,removeUserFromCommunity,updateCommunityInfo,deleteCommunity */ 




async function createCommunity(id, name, username, image, bio, createdById // Change the parameter name to reflect it's an id
) {
    try {
        (0,_mongoose__WEBPACK_IMPORTED_MODULE_4__/* .connectToDB */ .P)();
        // Find the user with the provided unique id
        const user = await _models_user_model__WEBPACK_IMPORTED_MODULE_3__/* ["default"] */ .Z.findOne({
            id: createdById
        });
        if (!user) {
            throw new Error("User not found"); // Handle the case if the user with the id is not found
        }
        const newCommunity = new _models_community_model__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .Z({
            id,
            name,
            username,
            image,
            bio,
            createdBy: user._id
        });
        const createdCommunity = await newCommunity.save();
        // Update User model
        user.communities.push(createdCommunity._id);
        await user.save();
        return createdCommunity;
    } catch (error) {
        // Handle any errors
        console.error("Error creating community:", error);
        throw error;
    }
}
async function fetchCommunityDetails(id) {
    try {
        (0,_mongoose__WEBPACK_IMPORTED_MODULE_4__/* .connectToDB */ .P)();
        const communityDetails = await _models_community_model__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .Z.findOne({
            id
        }).populate([
            "createdBy",
            {
                path: "members",
                model: _models_user_model__WEBPACK_IMPORTED_MODULE_3__/* ["default"] */ .Z,
                select: "name username image _id id"
            }
        ]);
        return communityDetails;
    } catch (error) {
        // Handle any errors
        console.error("Error fetching community details:", error);
        throw error;
    }
}
async function fetchCommunityPosts(id) {
    try {
        (0,_mongoose__WEBPACK_IMPORTED_MODULE_4__/* .connectToDB */ .P)();
        const communityPosts = await _models_community_model__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .Z.findById(id).populate({
            path: "threads",
            model: _models_thread_model__WEBPACK_IMPORTED_MODULE_2__/* ["default"] */ .Z,
            populate: [
                {
                    path: "author",
                    model: _models_user_model__WEBPACK_IMPORTED_MODULE_3__/* ["default"] */ .Z,
                    select: "name image id"
                },
                {
                    path: "children",
                    model: _models_thread_model__WEBPACK_IMPORTED_MODULE_2__/* ["default"] */ .Z,
                    populate: {
                        path: "author",
                        model: _models_user_model__WEBPACK_IMPORTED_MODULE_3__/* ["default"] */ .Z,
                        select: "image _id"
                    }
                }
            ]
        });
        return communityPosts;
    } catch (error) {
        // Handle any errors
        console.error("Error fetching community posts:", error);
        throw error;
    }
}
async function fetchCommunities({ searchString = "", pageNumber = 1, pageSize = 20, sortBy = "desc" }) {
    try {
        (0,_mongoose__WEBPACK_IMPORTED_MODULE_4__/* .connectToDB */ .P)();
        // Calculate the number of communities to skip based on the page number and page size.
        const skipAmount = (pageNumber - 1) * pageSize;
        // Create a case-insensitive regular expression for the provided search string.
        const regex = new RegExp(searchString, "i");
        // Create an initial query object to filter communities.
        const query = {};
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
        // Define the sort options for the fetched communities based on createdAt field and provided sort order.
        const sortOptions = {
            createdAt: sortBy
        };
        // Create a query to fetch the communities based on the search and sort criteria.
        const communitiesQuery = _models_community_model__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .Z.find(query).sort(sortOptions).skip(skipAmount).limit(pageSize).populate("members");
        // Count the total number of communities that match the search criteria (without pagination).
        const totalCommunitiesCount = await _models_community_model__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .Z.countDocuments(query);
        const communities = await communitiesQuery.exec();
        // Check if there are more communities beyond the current page.
        const isNext = totalCommunitiesCount > skipAmount + communities.length;
        return {
            communities,
            isNext
        };
    } catch (error) {
        console.error("Error fetching communities:", error);
        throw error;
    }
}
async function addMemberToCommunity(communityId, memberId) {
    try {
        (0,_mongoose__WEBPACK_IMPORTED_MODULE_4__/* .connectToDB */ .P)();
        // Find the community by its unique id
        const community = await _models_community_model__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .Z.findOne({
            id: communityId
        });
        if (!community) {
            throw new Error("Community not found");
        }
        // Find the user by their unique id
        const user = await _models_user_model__WEBPACK_IMPORTED_MODULE_3__/* ["default"] */ .Z.findOne({
            id: memberId
        });
        if (!user) {
            throw new Error("User not found");
        }
        // Check if the user is already a member of the community
        if (community.members.includes(user._id)) {
            throw new Error("User is already a member of the community");
        }
        // Add the user's _id to the members array in the community
        community.members.push(user._id);
        await community.save();
        // Add the community's _id to the communities array in the user
        user.communities.push(community._id);
        await user.save();
        return community;
    } catch (error) {
        // Handle any errors
        console.error("Error adding member to community:", error);
        throw error;
    }
}
async function removeUserFromCommunity(userId, communityId) {
    try {
        (0,_mongoose__WEBPACK_IMPORTED_MODULE_4__/* .connectToDB */ .P)();
        const userIdObject = await _models_user_model__WEBPACK_IMPORTED_MODULE_3__/* ["default"] */ .Z.findOne({
            id: userId
        }, {
            _id: 1
        });
        const communityIdObject = await _models_community_model__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .Z.findOne({
            id: communityId
        }, {
            _id: 1
        });
        if (!userIdObject) {
            throw new Error("User not found");
        }
        if (!communityIdObject) {
            throw new Error("Community not found");
        }
        // Remove the user's _id from the members array in the community
        await _models_community_model__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .Z.updateOne({
            _id: communityIdObject._id
        }, {
            $pull: {
                members: userIdObject._id
            }
        });
        // Remove the community's _id from the communities array in the user
        await _models_user_model__WEBPACK_IMPORTED_MODULE_3__/* ["default"] */ .Z.updateOne({
            _id: userIdObject._id
        }, {
            $pull: {
                communities: communityIdObject._id
            }
        });
        return {
            success: true
        };
    } catch (error) {
        // Handle any errors
        console.error("Error removing user from community:", error);
        throw error;
    }
}
async function updateCommunityInfo(communityId, name, username, image) {
    try {
        (0,_mongoose__WEBPACK_IMPORTED_MODULE_4__/* .connectToDB */ .P)();
        // Find the community by its _id and update the information
        const updatedCommunity = await _models_community_model__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .Z.findOneAndUpdate({
            id: communityId
        }, {
            name,
            username,
            image
        });
        if (!updatedCommunity) {
            throw new Error("Community not found");
        }
        return updatedCommunity;
    } catch (error) {
        // Handle any errors
        console.error("Error updating community information:", error);
        throw error;
    }
}
async function deleteCommunity(communityId) {
    try {
        (0,_mongoose__WEBPACK_IMPORTED_MODULE_4__/* .connectToDB */ .P)();
        // Find the community by its ID and delete it
        const deletedCommunity = await _models_community_model__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .Z.findOneAndDelete({
            id: communityId
        });
        if (!deletedCommunity) {
            throw new Error("Community not found");
        }
        // Delete all threads associated with the community
        await _models_thread_model__WEBPACK_IMPORTED_MODULE_2__/* ["default"] */ .Z.deleteMany({
            community: communityId
        });
        // Find all users who are part of the community
        const communityUsers = await _models_user_model__WEBPACK_IMPORTED_MODULE_3__/* ["default"] */ .Z.find({
            communities: communityId
        });
        // Remove the community from the 'communities' array for each user
        const updateUserPromises = communityUsers.map((user)=>{
            user.communities.pull(communityId);
            return user.save();
        });
        await Promise.all(updateUserPromises);
        return deletedCommunity;
    } catch (error) {
        console.error("Error deleting community: ", error);
        throw error;
    }
}

(0,private_next_rsc_action_validate__WEBPACK_IMPORTED_MODULE_5__/* ["default"] */ .Z)([
    createCommunity,
    fetchCommunityDetails,
    fetchCommunityPosts,
    fetchCommunities,
    addMemberToCommunity,
    removeUserFromCommunity,
    updateCommunityInfo,
    deleteCommunity
]);
(0,private_next_rsc_action_proxy__WEBPACK_IMPORTED_MODULE_0__/* .createActionProxy */ .U)("6b7d8dd8616cf147e2a693797145776d16566ddd", null, createCommunity);
(0,private_next_rsc_action_proxy__WEBPACK_IMPORTED_MODULE_0__/* .createActionProxy */ .U)("443e38cbb599f0715a412cbeb6dfebeaf1292b20", null, fetchCommunityDetails);
(0,private_next_rsc_action_proxy__WEBPACK_IMPORTED_MODULE_0__/* .createActionProxy */ .U)("27271acdc7e713161edbb6d9eb10b9c5ba5c7b6a", null, fetchCommunityPosts);
(0,private_next_rsc_action_proxy__WEBPACK_IMPORTED_MODULE_0__/* .createActionProxy */ .U)("74b2d77455009b3c9df7bb11ceb9663541d0f282", null, fetchCommunities);
(0,private_next_rsc_action_proxy__WEBPACK_IMPORTED_MODULE_0__/* .createActionProxy */ .U)("e23b5a1d45471b962bf2d9bf4469b15a12ae5ccf", null, addMemberToCommunity);
(0,private_next_rsc_action_proxy__WEBPACK_IMPORTED_MODULE_0__/* .createActionProxy */ .U)("f293b114e20a2499a42f1f38bdbef9a083efecaf", null, removeUserFromCommunity);
(0,private_next_rsc_action_proxy__WEBPACK_IMPORTED_MODULE_0__/* .createActionProxy */ .U)("c3cbaa9992841e6acbf16a6f1cb7b5570715225c", null, updateCommunityInfo);
(0,private_next_rsc_action_proxy__WEBPACK_IMPORTED_MODULE_0__/* .createActionProxy */ .U)("73fca39604394fb69fb677f54cdc7473753a3126", null, deleteCommunity);


/***/ })

};
;