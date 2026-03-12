import { useState, useEffect } from 'react'
import { View, Text, Button, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import './index.scss'

export default function Index() {
  const [todayPersonality, setTodayPersonality] = useState<any>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [resetCoins, setResetCoins] = useState(3)
  const [hasDrawnToday, setHasDrawnToday] = useState(false)

  // 模拟人格数据
  const mockPersonalities = [
    { id: '1', name: '冷酷杀手', category: '性格系', difficulty: 3, description: '话少、果断、不拖泥带水' },
    { id: '2', name: '热情推销员', category: '性格系', difficulty: 3, description: '自来熟、正能量、感染力十足' },
    { id: '3', name: '佛系青年', category: '性格系', difficulty: 2, description: '无所谓、都可以、随遇而安' },
    { id: '4', name: '毒舌评论家', category: '性格系', difficulty: 4, description: '犀利、直接、一针见血' },
    { id: '5', name: '霸道总裁', category: '职业系', difficulty: 3, description: '掌控一切、说一不二' },
  ]

  useEffect(() => {
    // 模拟加载用户信息
    setResetCoins(3)
  }, [])

  // 检查今日是否已抽取 - 静态版本
  const checkTodayDraw = () => {
    // 静态页面暂时不实现
  }

  // 抽取人格
  const handleDraw = async () => {
    setIsDrawing(true)

    // 模拟抽取
    setTimeout(() => {
      const random = mockPersonalities[Math.floor(Math.random() * mockPersonalities.length)]
      setTodayPersonality(random)
      setHasDrawnToday(true)
      setIsDrawing(false)
      Taro.showToast({
        title: `抽中${random.name}!`,
        icon: 'success'
      })
    }, 800)
  }

  // 使用重置币
  const handleReset = async () => {
    if (resetCoins <= 0) {
      Taro.showToast({
        title: '重置币不足',
        icon: 'none'
      })
      return
    }

    Taro.showModal({
      title: '确认重置',
      content: `将消耗 1 个重置币，当前剩余：${resetCoins}`,
      success: (res) => {
        if (res.confirm) {
          setIsDrawing(true)
          setTimeout(() => {
            const random = mockPersonalities[Math.floor(Math.random() * mockPersonalities.length)]
            setTodayPersonality(random)
            setResetCoins(prev => prev - 1)
            setIsDrawing(false)
            Taro.showToast({
              title: `重置为${random.name}!`,
              icon: 'success'
            })
          }, 800)
        }
      }
    })
  }

  return (
    <View className='index-container'>
      {/* 头部 */}
      <View className='header'>
        <Text className='title'>🎭 今天演谁？</Text>
        <Text className='date'>{formatDate(new Date())}</Text>
      </View>

      {/* 抽卡区域 */}
      <View className='draw-area'>
        {isDrawing ? (
          <View className='drawing-animation'>
            <View className='card-flip'>
              <Text className='question'>？？？</Text>
            </View>
          </View>
        ) : todayPersonality ? (
          <View className='personality-card' onClick={() => {
            Taro.navigateTo({
              url: `/pages/card/card?id=${todayPersonality.id}`
            })
          }}>
            <Text className='personality-name'>{todayPersonality.name}</Text>
            <Text className='personality-desc'>{todayPersonality.description}</Text>
          </View>
        ) : (
          <View className='draw-placeholder'>
            <Text className='question'>🎭</Text>
            <Text className='hint'>抽取今日人格</Text>
          </View>
        )}
      </View>

      {/* 操作按钮 */}
      <View className='action-area'>
        {!hasDrawnToday ? (
          <Button className='btn-draw' onClick={handleDraw}>
            抽取今日人格
          </Button>
        ) : (
          <View className='drawn-info'>
            <Text className='info-text'>今日已抽取</Text>
            <Button className='btn-reset' onClick={handleReset}>
              使用重置币
            </Button>
          </View>
        )}

        <Text className='reset-coins'>剩余免费重置：{resetCoins} 次</Text>
      </View>

      {/* 底部导航 */}
      <View className='bottom-nav'>
        <Text className='nav-item' onClick={() => Taro.switchTab({ url: '/pages/history/history' })}>
          📜 历史
        </Text>
        <Text className='nav-item' onClick={() => Taro.switchTab({ url: '/pages/shop/shop' })}>
          🏪 商店
        </Text>
      </View>
    </View>
  )
}

function formatDate(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}年${month}月${day}日`
}
