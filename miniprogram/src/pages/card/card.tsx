import { useState, useEffect } from 'react'
import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import CloudUtil from '../../utils/cloud'
import './card.scss'

export default function Card() {
  const [record, setRecord] = useState<any>(null)
  const [personality, setPersonality] = useState<any>(null)
  const [checkinRating, setCheckinRating] = useState(0)
  const [hasCheckin, setHasCheckin] = useState(false)
  const [recordId, setRecordId] = useState('')

  useEffect(() => {
    loadPersonality()
  }, [])

  const loadPersonality = async () => {
    try {
      // 从 URL 参数获取 recordId
      const event = Taro.getCurrentInstance()
      const { recordId } = event.router?.params || {}

      console.log('Card page recordId:', recordId)

      if (!recordId) {
        Taro.showToast({
          title: '参数错误',
          icon: 'none'
        })
        return
      }

      setRecordId(recordId)

      // 获取记录详情
      const result = await CloudUtil.getRecord(recordId)
      console.log('Get record result:', result)

      if (result.success && result.data) {
        setRecord(result.data)
        setPersonality(result.data.personality)
        setHasCheckin(result.data.is_checkin)
        if (result.data.checkin_rating) {
          setCheckinRating(result.data.checkin_rating)
        }
      } else if (result.data && result.data.personality) {
        // 兼容直接返回 data 的情况
        setRecord(result.data)
        setPersonality(result.data.personality)
        setHasCheckin(result.data.is_checkin)
        if (result.data.checkin_rating) {
          setCheckinRating(result.data.checkin_rating)
        }
      }
    } catch (error) {
      console.error('Load personality error:', error)
      Taro.showToast({
        title: '加载失败',
        icon: 'none'
      })
    }
  }

  const handleCheckin = async () => {
    if (checkinRating === 0) {
      Taro.showToast({
        title: '请选择评分',
        icon: 'none'
      })
      return
    }

    try {
      const result = await CloudUtil.checkin(recordId, checkinRating)
      if (result.success) {
        setHasCheckin(true)
        Taro.showToast({
          title: '打卡成功',
          icon: 'success'
        })
      }
    } catch (error: any) {
      Taro.showToast({
        title: error.message || '打卡失败',
        icon: 'none'
      })
    }
  }

  const handleShare = () => {
    // TODO: 生成分享海报
    Taro.showToast({
      title: '分享功能开发中',
      icon: 'none'
    })
  }

  if (!personality) {
    return (
      <View className='card-loading'>
        <Text>加载中...</Text>
      </View>
    )
  }

  return (
    <View className='card-container'>
      {/* 导航栏 */}
      <View className='card-header'>
        <Text className='back-btn' onClick={() => Taro.navigateBack()}>←</Text>
        <Text className='card-title'>🎭 {personality.name}</Text>
        <Text className='share-btn' onClick={handleShare}>📤</Text>
      </View>

      {/* 卡片内容 */}
      <View className='card-content'>
        {/* 核心特点 */}
        <View className='card-section'>
          <Text className='section-icon'>📌</Text>
          <Text className='section-text'>{personality.description}</Text>
        </View>

        {/* 今日任务 */}
        <View className='card-section'>
          <Text className='section-title'>✅ 今日任务</Text>
          {personality.tasks.map((task: string, index: number) => (
            <View key={index} className='task-item'>
              <Text className='task-text'>• {task}</Text>
            </View>
          ))}
        </View>

        {/* 说话方式 */}
        <View className='card-section'>
          <Text className='section-title'>💬 说话方式</Text>
          <View className='speech-compare'>
            <View className='speech-dont'>
              <Text className='speech-label'>❌</Text>
              <Text className='speech-text'>{personality.speech_dont[0]}</Text>
            </View>
            <View className='speech-do'>
              <Text className='speech-label'>✅</Text>
              <View className='speech-examples'>
                {personality.speech_do.map((example: string, index: number) => (
                  <Text key={index} className='speech-example'>{example}</Text>
                ))}
              </View>
            </View>
          </View>
        </View>

        {/* 穿搭建议 */}
        <View className='card-section'>
          <Text className='section-icon'>👕</Text>
          <Text className='section-text'>{personality.outfit}</Text>
        </View>

        {/* 今日禁忌 */}
        <View className='card-section warning'>
          <Text className='section-icon'>⚠️</Text>
          <Text className='section-text warning-text'>{personality.taboo}</Text>
        </View>
      </View>

      {/* 打卡区域 */}
      <View className='checkin-area'>
        <Text className='checkin-title'>今日完成情况</Text>

        {hasCheckin ? (
          <View className='checkin-done'>
            <Text>✅ 已打卡</Text>
          </View>
        ) : (
          <View className='checkin-form'>
            <View className='rating-stars'>
              {[1, 2, 3, 4, 5].map((star) => (
                <Text
                  key={star}
                  className={`star ${checkinRating >= star ? 'active' : ''}`}
                  onClick={() => setCheckinRating(star)}
                >
                  ⭐
                </Text>
              ))}
            </View>
            <View className='btn-checkin' onClick={handleCheckin}>
              确认打卡
            </View>
          </View>
        )}
      </View>
    </View>
  )
}
