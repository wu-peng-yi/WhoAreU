const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()
const _ = db.command

/**
 * 用户云函数
 */
exports.main = async (event, context) => {
  const { OPENID } = cloud.getWXContext()
  const { action } = event

  try {
    if (action === 'getInfo') {
      // 获取用户信息
      const userResult = await db.collection('users').where({
        openid: OPENID
      }).get()

      if (userResult.data.length === 0) {
        // 创建新用户
        const userData = {
          openid: OPENID,
          nickname: '新用户',
          avatar: '',
          created_at: new Date().toISOString(),
          coins: 10
        }
        await db.collection('users').add({
          data: userData
        })
        return {
          success: true,
          data: userData
        }
      }

      return {
        success: true,
        data: userResult.data[0]
      }
    }

    return {
      success: false,
      error: '未知操作'
    }

  } catch (error) {
    console.error('User error:', error)
    return {
      success: false,
      error: error.message
    }
  }
}
