const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

/**
 * 提交打卡云函数
 * 业务规则：
 * - 当天 23:59 前有效
 * - 打卡后可修改，但仅限当天
 */
exports.main = async (event, context) => {
  const { OPENID } = cloud.getWXContext()
  const { recordId, rating, note, photo } = event

  try {
    // 验证评分
    if (!rating || rating < 1 || rating > 5) {
      return {
        success: false,
        error: '评分必须在 1-5 星之间'
      }
    }

    // 获取抽取记录
    const drawRecord = await db.collection('draws').doc(recordId).get()

    if (!drawRecord.data) {
      return {
        success: false,
        error: '抽取记录不存在'
      }
    }

    // 验证是否为当天的记录
    const drawDate = new Date(drawRecord.data.draw_date)
    const today = new Date()

    if (drawDate.getDate() !== today.getDate() ||
        drawDate.getMonth() !== today.getMonth() ||
        drawDate.getFullYear() !== today.getFullYear()) {
      return {
        success: false,
        error: '只能为当天的记录打卡'
      }
    }

    // 更新打卡记录
    const updateData = {
      is_checkin: true,
      checkin_rating: rating,
      updated_at: new Date().toISOString()
    }

    if (note) {
      updateData.checkin_note = note
    }

    if (photo) {
      updateData.checkin_photo = photo
    }

    await db.collection('draws').doc(recordId).update({
      data: updateData
    })

    return {
      success: true,
      data: {
        recordId,
        rating,
        note,
        photo
      }
    }

  } catch (error) {
    console.error('Checkin error:', error)
    return {
      success: false,
      error: error.message
    }
  }
}
