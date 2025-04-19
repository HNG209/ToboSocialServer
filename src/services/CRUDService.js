const connection = require("../config/database")

const getAllUsers = async () => {
    let [results, fields] = await connection.query('select * from Users')
    return results

}

const getUserById = async (userId) => {
    let [results, fields] = await connection.query('select * from Users where id = ?', [userId])

    let user = results && results.length > 0 ? results[0] : {}

    return user
}

const updateUserByID = async (userId, email, name, city) => {
    let [results, fields] = await connection.query(
        `UPDATE Users SET email = ?, name = ?, city = ? WHERE id = ?`,
        [email, name, city, userId]
    );

}

const deleteUserByID = async (userId) => {
    const [result, fields] = await connection.query(
        'DELETE FROM Users WHERE id = ?',
        [userId]
    );
}

module.exports = {
    getAllUsers, getUserById, updateUserByID, deleteUserByID
}