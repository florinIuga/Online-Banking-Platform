const {
    queryAsync
} = require('..');

const getAllAsync = async () => {
    console.info('Getting all forum posts from database');

    return await queryAsync(`SELECT u.username AS publisher,
                                    post.id As id,
                                    post.title AS title,
                                    post.description AS description,
                                    post.visible AS visible,
                                    post.response AS response
                            FROM forum_posts post JOIN users u ON post.user_id = u.id`);

}

const createAsync = async (postBody) => {

    console.info('Publishing a new post in forum');

    const posts = await queryAsync(`INSERT INTO forum_posts
                                    (title, description, response, user_id)
                                    VALUES ($1, $2, $3, $4) RETURNING *`, 
                                    [postBody.Title, postBody.Description, postBody.Response, postBody.UserID]);

    return posts[0];
}

const updateByIdAsync = async (id, response) => {

    console.info(`Giving a response to the post with id: ${id}`);

    const posts = await queryAsync(`UPDATE forum_posts SET response = $2 WHERE id = $1 RETURNING *`, [id, response]);

    return posts[0];
}

const updateVisibleByIdAsync = async (id, visible) => {

    console.info(`Marking post as visible with id: ${id}`);

    const posts = await queryAsync(`UPDATE forum_posts SET visible = $2 WHERE id = $1 RETURNING *`, [id, visible]);

    return posts[0];
}

/* Operation allowed only for Moderator and Admin */
const deleteByIdAsync = async (id) => {

    console.info(`Deleting post with id: ${id} from forum`);

    const posts = await queryAsync(`DELETE FROM forum_posts WHERE id = $1 RETURNING *`, [id]);
    return posts[0];
}

const deletePostsByUserIdAsync = async (userId) => {

    console.info (`Deleting posts for user: ${userId}`);

    const res = await queryAsync(`DELETE FROM forum_posts WHERE user_id = $1`, [userId]);
    return res;
}

module.exports = {
    getAllAsync,
    createAsync,
    updateByIdAsync,
    deleteByIdAsync,
    deletePostsByUserIdAsync,
    updateVisibleByIdAsync
}