const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

// 初始化人格数据 - 20 条完整数据
const personalities = [
  { "id": "personality_001", "name": "冷酷杀手", "category": "性格系", "difficulty": 3, "description": "话少、果断、不拖泥带水", "tasks": ["说话不超过 10 个字/句", "做决定不超过 30 秒", "拒绝一个不必要的请求"], "speech_do": ["行。", "不行。", "晚点说。"], "speech_dont": ["我觉得可能 maybe 大概可以试试..."], "outfit": "黑/灰/深蓝色系", "taboo": "不要解释、不要道歉、不要犹豫", "unlock_type": "free" },
  { "id": "personality_002", "name": "热情推销员", "category": "性格系", "difficulty": 3, "description": "自来熟、正能量、感染力十足", "tasks": ["主动和 3 个陌生人打招呼", "用 enthusiastic 的语气说话", "给身边的人一个赞美"], "speech_do": ["太棒了！", "我相信你！", "一起来吧！"], "speech_dont": ["随便吧", "无所谓", "好累"], "outfit": "亮色系、有活力的穿搭", "taboo": "不要消极、不要冷漠、不要敷衍", "unlock_type": "free" },
  { "id": "personality_003", "name": "佛系青年", "category": "性格系", "difficulty": 2, "description": "无所谓、都可以、随遇而安", "tasks": ["遇到选择时 3 秒内决定", "被人误解不解释", "接受一个平时会拒绝的请求"], "speech_do": ["都行", "可以", "没关系"], "speech_dont": ["必须", "一定", "绝对"], "outfit": "舒适、宽松的棉麻质地", "taboo": "不要纠结、不要争执、不要抱怨", "unlock_type": "free" },
  { "id": "personality_004", "name": "毒舌评论家", "category": "性格系", "difficulty": 4, "description": "犀利、直接、一针见血", "tasks": ["给出一个直接的负面评价", "用讽刺的语气说话", "指出一个别人没发现的问题"], "speech_do": ["这也能叫作品？", "你是认真的吗？", "让我无语"], "speech_dont": ["挺好的", "还不错", "可以的"], "outfit": "黑色高领衫、艺术家风格", "taboo": "不要客套、不要委婉、不要附和", "unlock_type": "free" },
  { "id": "personality_005", "name": "阳光小天使", "category": "性格系", "difficulty": 2, "description": "温暖、治愈、笑容满面", "tasks": ["对每个人微笑", "主动帮助一个人", "说一句温暖的话"], "speech_do": ["加油！", "你一定可以的！", "谢谢~"], "speech_dont": ["烦死了", "关我什么事", "无语"], "outfit": "浅色系、温暖的穿搭", "taboo": "不要冷脸、不要抱怨、不要消极", "unlock_type": "free" },
  { "id": "personality_006", "name": "高冷学霸", "category": "性格系", "difficulty": 3, "description": "理性、克制、智商在线", "tasks": ["用数据和逻辑说服一个人", "纠正一个知识性错误", "推荐一本书/一部纪录片"], "speech_do": ["根据数据显示", "从逻辑上讲", "我建议你看一下"], "speech_dont": ["我感觉", "我觉得", "大概是吧"], "outfit": "简洁、知性的学院风", "taboo": "不要情绪化、不要模糊表达、不要无知", "unlock_type": "free" },
  { "id": "personality_007", "name": "戏精本精", "category": "性格系", "difficulty": 4, "description": "随时随地在演戏，人生如戏", "tasks": ["用戏剧化的方式表达情绪", "给一个日常场景加台词", "演一个古装剧角色"], "speech_do": ["苍天啊！", "这日子没法过了！", "你听我解释！"], "speech_dont": ["哦", "好的", "知道了"], "outfit": "夸张、有舞台感的穿搭", "taboo": "不要平淡、不要无趣、不要正常", "unlock_type": "free" },
  { "id": "personality_008", "name": "社恐患者", "category": "性格系", "difficulty": 1, "description": "能不说就不说，默默观察世界", "tasks": ["独处 1 小时不碰手机", "避免眼神接触", "在人群中保持安静"], "speech_do": ["嗯", "好", "......"], "speech_dont": ["大家好！", "一起来玩吧！", "加个微信！"], "outfit": "低调、不显眼的穿搭", "taboo": "不要主动社交、不要引人注目", "unlock_type": "free" },
  { "id": "personality_009", "name": "霸道总裁", "category": "职业系", "difficulty": 3, "description": "掌控一切、说一不二", "tasks": ["做一个不容置疑的决定", "安排别人的任务", "用命令的语气说话"], "speech_do": ["就这么定了", "照我说的做", "我没时间听解释"], "speech_dont": ["你觉得呢？", "要不这样？", "可以吗？"], "outfit": "西装、精致商务风", "taboo": "不要犹豫、不要商量、不要示弱", "unlock_type": "free" },
  { "id": "personality_010", "name": "贴心管家", "category": "职业系", "difficulty": 2, "description": "细致周到、无微不至", "tasks": ["记住并复述别人的需求", "提前准备好所需物品", "主动提供帮助"], "speech_do": ["您需要什么？", "我已经准备好了", "请注意"], "speech_dont": ["随便", "不知道", "你自己来"], "outfit": "整洁、得体的制服风", "taboo": "不要粗心、不要怠慢、不要敷衍", "unlock_type": "free" },
  { "id": "personality_011", "name": "摇滚明星", "category": "职业系", "difficulty": 4, "description": "张扬不羁、自由奔放", "tasks": ["做一件出格的事", "用夸张的方式表达", "享受成为焦点"], "speech_do": ["Rock & Roll！", "爽！", "管他呢！"], "speech_dont": ["好的收到", "遵命", "不好意思"], "outfit": "皮衣、铆钉、夸张配饰", "taboo": "不要拘谨、不要守规矩、不要低调", "unlock_type": "free" },
  { "id": "personality_012", "name": "禅修大师", "category": "职业系", "difficulty": 2, "description": "平静如水、超脱世俗", "tasks": ["冥想 10 分钟", "说话放慢一倍", "在冲突中保持平静"], "speech_do": ["一切都是缘分", "放下即自在", "慢一点，没关系"], "speech_dont": ["快点！", "烦死了！", "急死我了！"], "outfit": "素色、宽松、禅意穿搭", "taboo": "不要急躁、不要动怒、不要执着", "unlock_type": "free" },
  { "id": "personality_013", "name": "侦探推理王", "category": "职业系", "difficulty": 3, "description": "观察入微、逻辑缜密", "tasks": ["从细节推断出真相", "发现一个别人没注意的线索", "用演绎法分析一件事"], "speech_do": ["根据我的观察", "这很奇怪", "真相只有一个"], "speech_dont": ["可能吧", "大概", "也许是"], "outfit": "风衣、复古英伦风", "taboo": "不要武断、不要粗心、不要肤浅", "unlock_type": "free" },
  { "id": "personality_014", "name": "美食评论家", "category": "职业系", "difficulty": 2, "description": "挑剔品味、专业点评", "tasks": ["认真品尝一餐饭", "用专业术语点评食物", "发现一道新餐厅"], "speech_do": ["口感层次丰富", "火候稍欠", "食材新鲜"], "speech_dont": ["好吃", "还行", "填饱肚子"], "outfit": "精致、有品位的穿搭", "taboo": "不要将就、不要狼吞虎咽、不要敷衍", "unlock_type": "free" },
  { "id": "personality_015", "name": "第一天上班", "category": "场景系", "difficulty": 3, "description": "紧张又兴奋，小心翼翼", "tasks": ["主动自我介绍", "记住一个新名字", "问一个问题"], "speech_do": ["请问...", "初次见面", "请多指教"], "speech_dont": ["老子的话", "随便", "我懒得说"], "outfit": "正式、得体的通勤装", "taboo": "不要放肆、不要散漫、不要无礼", "unlock_type": "free" },
  { "id": "personality_016", "name": "度假模式中", "category": "场景系", "difficulty": 2, "description": "放松享受，什么都不急", "tasks": ["拍一张风景照", "喝一杯饮料慢慢品味", "说一句'不急着走'"], "speech_do": ["慢慢来", "享受当下", "太美了"], "speech_dont": ["快点", "烦死了", "还有事要办"], "outfit": "休闲、度假风穿搭", "taboo": "不要工作、不要焦虑、不要匆忙", "unlock_type": "free" },
  { "id": "personality_017", "name": "末日幸存者", "category": "场景系", "difficulty": 4, "description": "警惕谨慎、生存第一", "tasks": ["检查周围环境", "储备一些物资", "制定一个逃生计划"], "speech_do": ["小心", "有动静", "先躲起来"], "speech_dont": ["没事的", "别担心", "放松点"], "outfit": "工装、战术风、耐磨", "taboo": "不要大意、不要轻信、不要暴露", "unlock_type": "free" },
  { "id": "personality_018", "name": "穿越古代人", "category": "场景系", "difficulty": 3, "description": "对现代充满好奇", "tasks": ["用古文说话", "对一件现代物品表示惊讶", "行一个古代礼"], "speech_do": ["此乃何物？", "在下...", "敢问"], "speech_dont": ["手机", "WiFi", "牛逼"], "outfit": "古风、汉服元素", "taboo": "不要用现代词汇、不要习以为常", "unlock_type": "free" },
  { "id": "personality_019", "name": "外星人访客", "category": "场景系", "difficulty": 3, "description": "观察学习地球文化", "tasks": ["问一个关于地球的问题", "模仿一个地球行为", "记录一个观察发现"], "speech_do": ["这是什么意思？", "地球人真有趣", "我要学习"], "speech_dont": ["我知道", "很正常", "没什么"], "outfit": "未来感、科技风", "taboo": "不要装作了解、不要习以为常", "unlock_type": "free" },
  { "id": "personality_020", "name": "超级英雄", "category": "场景系", "difficulty": 2, "description": "正义感爆棚，保护弱小", "tasks": ["帮助一个需要帮助的人", "制止一件不文明行为", "说一句英雄台词"], "speech_do": ["我来保护你", "正义必胜！", "交给我吧"], "speech_dont": ["关我什么事", "我懒得管", "随便吧"], "outfit": "有力量感的穿搭", "taboo": "不要冷漠、不要退缩、不要自私", "unlock_type": "free" }
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
