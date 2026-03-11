const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

// 初始化人格数据
const personalities = [
  {
    "id": "personality_001",
    "name": "冷酷杀手",
    "category": "性格系",
    "difficulty": 3,
    "description": "话少、果断、不拖泥带水",
    "tasks": ["说话不超过 10 个字/句", "做决定不超过 30 秒", "拒绝一个不必要的请求"],
    "speech_do": ["行。", "不行。", "晚点说。"],
    "speech_dont": ["我觉得可能 maybe 大概可以试试..."],
    "outfit": "黑/灰/深蓝色系",
    "taboo": "不要解释、不要道歉、不要犹豫",
    "unlock_type": "free"
  },
  {
    "id": "personality_002",
    "name": "热情推销员",
    "category": "性格系",
    "difficulty": 3,
    "description": "自来熟、正能量、感染力十足",
    "tasks": ["主动和 3 个陌生人打招呼", "用 enthusiastic 的语气说话", "给身边的人一个赞美"],
    "speech_do": ["太棒了！", "我相信你！", "一起来吧！"],
    "speech_dont": ["随便吧", "无所谓", "好累"],
    "outfit": "亮色系、有活力的穿搭",
    "taboo": "不要消极、不要冷漠、不要敷衍",
    "unlock_type": "free"
  },
  {
    "id": "personality_003",
    "name": "佛系青年",
    "category": "性格系",
    "difficulty": 2,
    "description": "无所谓、都可以、随遇而安",
    "tasks": ["遇到选择时 3 秒内决定", "被人误解不解释", "接受一个平时会拒绝的请求"],
    "speech_do": ["都行", "可以", "没关系"],
    "speech_dont": ["必须", "一定", "绝对"],
    "outfit": "舒适、宽松的棉麻质地",
    "taboo": "不要纠结、不要争执、不要抱怨",
    "unlock_type": "free"
  },
  {
    "id": "personality_004",
    "name": "毒舌评论家",
    "category": "性格系",
    "difficulty": 4,
    "description": "犀利、直接、一针见血",
    "tasks": ["给出一个直接的负面评价", "用讽刺的语气说话", "指出一个别人没发现的问题"],
    "speech_do": ["这也能叫作品？", "你是认真的吗？", "让我无语"],
    "speech_dont": ["挺好的", "还不错", "可以的"],
    "outfit": "黑色高领衫、艺术家风格",
    "taboo": "不要客套、不要委婉、不要附和",
    "unlock_type": "free"
  },
  {
    "id": "personality_005",
    "name": "阳光小天使",
    "category": "性格系",
    "difficulty": 2,
    "description": "温暖、治愈、笑容满面",
    "tasks": ["对每个人微笑", "主动帮助一个人", "说一句温暖的话"],
    "speech_do": ["加油！", "你一定可以的！", "谢谢~"],
    "speech_dont": ["烦死了", "关我什么事", "无语"],
    "outfit": "浅色系、温暖的穿搭",
    "taboo": "不要冷脸、不要抱怨、不要消极",
    "unlock_type": "free"
  }
]

/**
 * 初始化数据库云函数
 * 用于创建初始人格数据
 */
exports.main = async (event, context) => {
  try {
    // 检查集合是否已存在数据
    const existing = await db.collection('personalities').count()

    if (existing.total > 0) {
      return {
        success: false,
        message: `数据库中已有 ${existing.total} 条数据，跳过初始化`
      }
    }

    // 批量插入数据
    const tasks = personalities.map(item =>
      db.collection('personalities').add({
        data: item
      })
    )

    await Promise.all(tasks)

    return {
      success: true,
      message: `成功初始化 ${personalities.length} 条人格数据`,
      count: personalities.length
    }

  } catch (error) {
    console.error('Init error:', error)
    return {
      success: false,
      error: error.message
    }
  }
}
