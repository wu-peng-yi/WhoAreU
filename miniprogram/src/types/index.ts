/**
 * 人格类型定义
 */
export interface Personality {
  id: string
  name: string
  category: '性格系' | '职业系' | '场景系'
  difficulty: 1 | 2 | 3 | 4 | 5
  description: string
  tasks: string[]
  speech_do: string[]
  speech_dont: string[]
  outfit: string
  taboo: string
  unlock_type: 'free' | 'premium'
  image?: string
}

/**
 * 用户类型定义
 */
export interface User {
  id: string
  openid: string
  nickname: string
  avatar: string
  created_at: string
  vip_expire?: string
  coins: number
}

/**
 * 抽取记录类型定义
 */
export interface DrawRecord {
  id: string
  user_id: string
  personality_id: string
  draw_date: string
  is_checkin: boolean
  checkin_rating?: number
  checkin_note?: string
  checkin_photo?: string
  created_at: string
  personality?: Personality
}

/**
 * 打卡记录类型定义
 */
export interface Checkin {
  id: string
  record_id: string
  user_id: string
  rating: number
  note?: string
  photo?: string
  created_at: string
  updated_at: string
}

/**
 * 人格包类型定义
 */
export interface PersonalityPack {
  id: string
  name: string
  description: string
  category: '性格系' | '职业系' | '场景系'
  price: number
  unlock_type: 'premium' | 'pack'
  personalities: Personality[]
}

/**
 * 成就类型定义
 */
export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  condition: string
  is_unlocked: boolean
  unlocked_at?: string
}
