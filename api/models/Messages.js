const connection = require('../middleware/database')
const e = require('escape-html')

class Messages {

  static async push(fromId, toId, body) {
    const sql = 'INSERT INTO messages(from_id, to_id, body, seen) VALUES (?,?,?,0)'
    const newMessage = await connection.query({
        sql,
        timeout: 40000,
        values: [e(fromId), e(toId), e(body)]
    })

    return (!newMessage) ? false : true;
  }

  static async delete(id, fromId) {
    const sql = 'DELETE FROM messages WHERE id = ? AND from_id = ?'
    const deleteMessage = await connection.query({
        sql,
        timeout: 40000,
        values: [e(id), e(fromId)]
    })

    return (!deleteMessage) ? false : true;
  }

  static async getConversation(fromId, toId, limit) {
    const sql = 'SELECT from_id, to_id, body, seen, DATE_FORMAT(created_at, "%d/%m/%Y %H:%i:%s") AS date \
            FROM messages \
            WHERE (from_id = ? AND to_id = ?) OR (from_id = ? AND to_id = ?) \
            ORDER BY created_at DESC \
            LIMIT ?'

    const messages = await connection.query({
        sql,
        timeout: 40000,
        values: [e(fromId), e(toId), e(toId), e(fromId), parseInt(e(limit))]
    })

    return (messages)
  }

  static async setSeen(fromId, toId) {
    const sql = 'UPDATE messages \
                SET seen = 1\
                WHERE (from_id = ? AND to_id = ?)'
    await connection.query({
        sql,
        timeout: 40000,
        values: [e(fromId), e(toId)]
    })
  }

  static async update(id, message, fromId) {
    const sql = 'UPDATE messages \
    SET body = ?, created_at = CURRENT_TIMESTAMP\
    WHERE messages.id = ? AND messages.from_id = ?'
    const newMessage = await connection.query({
        sql,
        timeout: 40000,
        values: [e(message), e(id), e(fromId)]
    })
    return newMessage;
  }


}

module.exports = Messages
