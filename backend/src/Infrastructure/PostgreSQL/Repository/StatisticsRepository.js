const { queryAsync } = require("..");

const getRegistersByDayAsync = async () => {
  return await queryAsync(`select
    to_char(date_trunc('day', register_date), 'dd-mm-yyyy') as register_date, count(*) as register_count
    from
        "Register"
    group by
        date_trunc('day', register_date)
    order by
    date_trunc('day', register_date) asc`);
};

const addRegisterAsync = async (username, register_date) => {
    const registers = await queryAsync(`INSERT INTO "Register" (username, register_date) VALUES ($1, $2)`, [username, register_date]);
    return registers[0];
};

const getLoginsByDayAsync = async () => {
    return await queryAsync(`select
      to_char(date_trunc('day', login_date), 'dd-mm-yyyy') as login_date, count(*) as login_count
      from
          "Login"
      group by
          date_trunc('day', login_date)
      order by
      date_trunc('day', login_date) asc`);
};

const addLoginAsync = async (username, login_date) => {
    const logins = await queryAsync(`INSERT INTO "Login" (username, login_date) VALUES ($1, $2)`, [username, login_date]);
    return logins[0];
};

const getPostsByDayAsync = async () => {
    return await queryAsync(`select
      to_char(date_trunc('day', post_date), 'dd-mm-yyyy') as post_date, count(*) as post_count
      from
          "ForumStatistics"
      group by
          date_trunc('day', post_date)
      order by
      date_trunc('day', post_date) asc`);
};

const addPostAsync = async (title, post_date) => {
    const posts = await queryAsync(`INSERT INTO "ForumStatistics" (title, post_date) VALUES ($1, $2)`, [title, post_date]);
    return posts[0];
};

const getTransactionsByDayAsync = async () => {
    return await queryAsync(`select
      to_char(date_trunc('day', transfer_date), 'dd-mm-yyyy') as transfer_date, count(*) as transfer_count
      from
          transactions
      group by
          date_trunc('day', transfer_date)
      order by
      date_trunc('day', transfer_date) asc`);
};

const getUserTransactionsByDayAsync = async (id) => {
    return await queryAsync(`select
      to_char(date_trunc('day', transfer_date), 'dd-mm-yyyy') as transfer_date, count(*) as transfer_count
      from
          transactions
      where id_sender = $1 or id_receiver = $1
      group by
          date_trunc('day', transfer_date) 
      order by
      date_trunc('day', transfer_date) asc`, [id]);
};

module.exports = {
    getLoginsByDayAsync,
    getRegistersByDayAsync,
    getTransactionsByDayAsync,
    getUserTransactionsByDayAsync,
    addLoginAsync,
    addRegisterAsync,
    getPostsByDayAsync,
    addPostAsync
}

