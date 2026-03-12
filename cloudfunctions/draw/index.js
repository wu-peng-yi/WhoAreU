const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()
const _ = db.command

/**
 * 抽取人格云函数
 * 业务规则：
 * - 每天只能抽取 1 次（凌晨 0 点刷新）
 * - 可使用重置币重新抽取
 * - 30 天内不重复
 */
exports.main = async (event, context) => {
  const { OPENID } = cloud.getWXContext()
  const { useResetCoin = false } = event

  try {
    // 获取用户信息
    const userResult = await db.collection('users').where({
      openid: OPENID
    }).get()

    if (userResult.data.length === 0) {
      // 创建新用户
      await db.collection('users').add({
        data: {
          openid: OPENID,
          nickname: '新用户',
          avatar: '',
          created_at: new Date().toISOString(),
          coins: 10
        }
      })
    }

    const user = userResult.data.length > 0 ? userResult.data[0] : { coins: 10 }

    // 检查今日是否已抽取
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const todayDraw = await db.collection('draws').where({
      openid: OPENID,
      draw_date: _.gte(today.toISOString())
    }).orderBy('draw_date', 'desc').limit(1).get()

    // 如果已抽取且不使用重置币，返回已有记录
    if (todayDraw.data.length > 0 && !useResetCoin) {
      return {
        success: true,
        isRedraw: false,
        data: todayDraw.data[0]
      }
    }

    // 使用重置币逻辑
    if (useResetCoin) {
      if (user.coins < 1) {
        return {
          success: false,
          error: '重置币不足'
        }
      }

      // 扣除重置币
      await db.collection('users').where({
        openid: OPENID
      }).update({
        data: {
          coins: _.inc(-1)
        }
      })
    }

    // 获取 30 天内已抽取的人格 ID
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const recentDraws = await db.collection('draws').where({
      openid: OPENID,
      draw_date: _.gte(thirtyDaysAgo.toISOString())
    }).get()

    const excludedIds = recentDraws.data.map(item => item.personality_id)

    // 随机抽取人格（排除 30 天内的）
    let personalityQuery = db.collection('personalities')
    if (excludedIds.length > 0) {
      personalityQuery = personalityQuery.where({
        id: _.nin(excludedIds)
      })
    }

    const personalities = await personalityQuery.get()

    if (personalities.data.length === 0) {
      // 如果所有人格都抽过了，清空排除列表
      const allPersonalities = await db.collection('personalities').get()
      const randomIndex = Math.floor(Math.random() * allPersonalities.data.length)
      var selectedPersonality = allPersonalities.data[randomIndex]
    } else {
      const randomIndex = Math.floor(Math.random() * personalities.data.length)
      var selectedPersonality = personalities.data[randomIndex]
    }

    // 创建抽取记录
    const drawResult = await db.collection('draws').add({
      data: {
        openid: OPENID,
        personality_id: selectedPersonality.id,
        draw_date: new Date().toISOString(),
        is_checkin: false,
        created_at: new Date().toISOString()
      }
    })

    return {
      success: true,
      isRedraw: useResetCoin,
      data: {
        _id: drawResult._id,
        recordId: drawResult._id,
        ...selectedPersonality
      }
    }

  } catch (error) {
    console.error('Draw error:', error)
    return {
      success: false,
      error: error.message
    }
  }
}
