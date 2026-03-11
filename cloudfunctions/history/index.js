const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()
const _ = db.command

/**
 * 获取历史记录云函数
 */
exports.main = async (event, context) => {
  const { OPENID } = cloud.getWXContext()
  const { page = 1, pageSize = 20 } = event

  try {
    const offset = (page - 1) * pageSize

    const records = await db.collection('draws')
      .where({
        openid: OPENID
      })
      .orderBy('draw_date', 'desc')
      .skip(offset)
      .limit(pageSize)
      .get()

    // 获取人格详情
    const personalityIds = records.data.map(item => item.personality_id)
    const personalities = await db.collection('personalities')
      .where({
        id: _.in(personalityIds)
      })
      .get()

    // 关联人格数据
    const enrichedRecords = records.data.map(record => {
      const personality = personalities.data.find(p => p.id === record.personality_id)
      return {
        ...record,
        personality
      }
    })

    // 获取总数
    const total = await db.collection('draws')
      .where({
        openid: OPENID
      })
      .count()

    return {
      success: true,
      data: {
        records: enrichedRecords,
        total: total.total,
        page,
        pageSize
      }
    }

  } catch (error) {
    console.error('History error:', error)
    return {
      success: false,
      error: error.message
    }
  }
}
