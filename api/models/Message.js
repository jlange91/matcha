const connection = require('../middleware/database')
const e = require('escape-html')

class Message {

  static async push(fromId, toId, body) {
    try {
      const sql = 'INSERT INTO messages(from_id, to_id, body, seen) VALUES (?,?,?,0)'
      const newMessage = await connection.query({
          sql,
          timeout: 40000,
          values: [e(fromId), e(toId), e(body)]
      })

      return (!newMessage) ? false : true;
    } catch (error) {
        throw new Error('INSERT failed in model Message.push ' + error)
    }
  }

  static async delete(id, fromId) {
    try {
      const sql = 'DELETE FROM messages WHERE id = ? AND from_id = ?'
      const deleteMessage = await connection.query({
          sql,
          timeout: 40000,
          values: [e(id), e(fromId)]
      })

      return (!deleteMessage) ? false : true;
    } catch (error) {
        throw new Error('DELETE failed in model Message.delete ' + error)
    }
  }

  static async getConversation(fromId, toId, limit) {
    try {
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
    } catch (error) {
        throw new Error('SELECT failed in model Message.getConversation ' + error)
    }
  }

  static async setSeen(fromId, toId) {
    try {
      const sql = 'UPDATE messages \
                  SET seen = 1\
                  WHERE (from_id = ? AND to_id = ?)'
      await connection.query({
          sql,
          timeout: 40000,
          values: [e(fromId), e(toId)]
      })
    } catch (error) {
        throw new Error('UPDATE failed in model Message.setSeen ' + error)
    }
  }

  static async update(id, message, fromId) {
    try {
      const sql = 'UPDATE messages \
      SET body = ?, created_at = CURRENT_TIMESTAMP\
      WHERE messages.id = ? AND messages.from_id = ?'
      const newMessage = await connection.query({
          sql,
          timeout: 40000,
          values: [e(message), e(id), e(fromId)]
      })
      return newMessage;
    } catch (error) {
        throw new Error('UPDATE failed in model Message.update ' + error)
    }
  }

  static async getLastFromId(fromId, toId) {
    try {
      const sql = 'SELECT body, DATE_FORMAT(created_at, "%m/%d/%Y %H:%i:%s") AS date \
              FROM messages \
              WHERE (from_id = ? AND to_id = ?) OR (from_id = ? AND to_id = ?) \
              ORDER BY created_at DESC \
              LIMIT 1;'
      const message = await connection.query({
          sql,
          timeout: 40000,
          values: [e(fromId), e(toId), e(toId), e(fromId)]
      })
      return message;
    } catch (error) {
        throw new Error('SELECT failed in model Message.getLastFromId ' + error)
    }
  }


}

module.exports = Message
