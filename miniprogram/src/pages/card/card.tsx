import { useState, useEffect } from 'react'
import { View, Text, Button, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import './card.scss'

export default function Card() {
  const [personality, setPersonality] = useState<any>(null)
  const [checkinRating, setCheckinRating] = useState(0)
  const [hasCheckin, setHasCheckin] = useState(false)

  // 模拟人格详情数据
  const mockPersonality = {
    id: '1',
    name: '冷酷杀手',
    category: '性格系',
    difficulty: 3,
    description: '话少、果断、不拖泥带水',
    tasks: [
      '说话不超过 10 个字/句',
      '做决定不超过 30 秒',
      '拒绝一个不必要的请求'
    ],
    speech_do: ['行。', '不行。', '晚点说。'],
    speech_dont: ['我觉得可能 maybe 大概可以试试...'],
    outfit: '黑/灰/深蓝色系',
    taboo: '不要解释、不要道歉、不要犹豫'
  }

  useEffect(() => {
    loadPersonality()
  }, [])

  const loadPersonality = async () => {
    // 使用模拟数据
    setTimeout(() => {
      setPersonality(mockPersonality)
    }, 200)
  }

  const handleCheckin = async () => {
    if (checkinRating === 0) {
      Taro.showToast({
        title: '请选择评分',
        icon: 'none'
      })
      return
    }

    // 模拟打卡
    setHasCheckin(true)
    Taro.showToast({
      title: '打卡成功',
      icon: 'success'
    })
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
          <View className='speech对比'>
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
            <Button className='btn-checkin' onClick={handleCheckin}>
              确认打卡
            </Button>
          </View>
        )}
      </View>
    </View>
  )
}
