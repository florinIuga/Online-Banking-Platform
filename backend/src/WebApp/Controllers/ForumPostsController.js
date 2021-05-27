const express = require('express');

const {
    authorizeAndExtractTokenAsync
} = require('../Filters/JWTFilter.js');

const ForumPostsRepository = require('../../Infrastructure/PostgreSQL/Repository/ForumPostsRepository.js');
const StatisticsRepository = require('../../Infrastructure/PostgreSQL/Repository/StatisticsRepository');

const {
    ForumPostBody,
    ForumPostResponse
} = require ('../Models/ForumPosts.js');



const ResponseFilter = require('../Filters/ResponseFilter.js');
const AuthorizationFilter = require('../Filters/AuthorizationFilter.js');
const RoleConstants = require('../Constants/Roles.js');

const Router = express.Router();

/* Get all posts (allowed: user, admin, support) */
Router.get('/',  authorizeAndExtractTokenAsync,  AuthorizationFilter.authorizeRoles(RoleConstants.ADMIN, RoleConstants.USER, RoleConstants.SUPPORT), async (req, res) => {

    console.log("================================");
    const posts = await ForumPostsRepository.getAllAsync();

    ResponseFilter.setResponseDetails(res, 200, posts);
});

/* Create a new post (allowed: user, admin, support) */
Router.post('/',  authorizeAndExtractTokenAsync,  AuthorizationFilter.authorizeRoles(RoleConstants.ADMIN, RoleConstants.USER, RoleConstants.SUPPORT), async (req, res) => {


    const currentDate = new Date()
      .toISOString()
      .replace(/T/, " ")
      .replace(/\..+/, "");

    const postBody = new ForumPostBody(req.body);
    const addedPost = await ForumPostsRepository.createAsync(postBody);
    const addToStatistics = await StatisticsRepository.addPostAsync(postBody.Title, currentDate);
    const postResponse = new ForumPostResponse(addedPost);

    ResponseFilter.setResponseDetails(res, 200, postResponse);

});

/* Answer to a post (allowed: support) */
Router.put('/:id',  authorizeAndExtractTokenAsync, AuthorizationFilter.authorizeRoles(RoleConstants.SUPPORT), async (req, res) => {


    let {id} = req.params;
    id = parseInt(id);

    const response = req.body.response;
    const visible = req.body.visible;

    console.log(visible);
    
    if (visible === true) {
        const updatedPost = await ForumPostsRepository.updateVisibleByIdAsync(id, visible);
        const updatedPostResponse = new ForumPostResponse(updatedPost);

        ResponseFilter.setResponseDetails(res, 200, updatedPostResponse);
    } else {

        const updatedPost = await ForumPostsRepository.updateByIdAsync(id, response);
        const updatedPostResponse = new ForumPostResponse(updatedPost);

        ResponseFilter.setResponseDetails(res, 200, updatedPostResponse);
    }

});

/* Delete a post (allowed: support) */
Router.delete('/:id',  authorizeAndExtractTokenAsync, AuthorizationFilter.authorizeRoles(RoleConstants.SUPPORT), async (req, res) => {

    let {id} = req.params;
    id = parseInt(id);

    const deletedPost = await ForumPostsRepository.deleteByIdAsync(id);
    const deletedPostResponse = new ForumPostResponse(deletedPost);

    ResponseFilter.setResponseDetails(res, 200, deletedPostResponse);
});

module.exports = Router;
