const ServerError = require('./ServerError.js');

class ForumPostBody {

    constructor(postBody) {
        
        if (!postBody.user_id) {
            throw new ServerError("Publisher ID is missing", 400);
        }

        if (!postBody.title) {
            throw new ServerError("Title is missing", 400);
        }

        if (!postBody.description) {
            throw new ServerError("Description is missing", 400);
        }

        this.userId = postBody.user_id;
        this.title = postBody.title;
        this.description = postBody.description;
        this.response = '';
        this.visible = false;
    }

    get UserID() {
        return this.userId;
    }

    get Title() {
        return this.title;
    }

    get Description() {
        return this.description;
    }

    get Response() {
        return this.response;
    }

    get Visible() {
        return this.visible;
    }
}

class ForumPostResponse {

    constructor(post) {
        this.user_id = post.user_id;
        this.title = post.title;
        this.description = post.description;
        this.response = post.response;
        this.visible = post.visible;
    }
}

module.exports = {
    ForumPostBody,
    ForumPostResponse
}