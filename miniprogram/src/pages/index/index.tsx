import { useState, useEffect } from 'react'
import { View, Text, Button, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import './index.scss'

export default function Index() {
  const [todayPersonality, setTodayPersonality] = useState<any>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [resetCoins, setResetCoins] = useState(1)
  const [hasDrawnToday, setHasDrawnToday] = useState(false)

  useEffect(() => {
    checkTodayDraw()
  }, [])

  // 检查今日是否已抽取
  const checkTodayDraw = async () => {
    try {
      const res = await Taro.cloud.callFunction({
        name: 'history',
        data: { page: 1, pageSize: 1 }
      })

      const result: any = res.result

      if (result.success && result.data.records.length > 0) {
        const today = new Date()
        const recordDate = new Date(result.data.records[0].draw_date)

        if (recordDate.toDateString() === today.toDateString()) {
          setHasDrawnToday(true)
          setTodayPersonality(result.data.records[0].personality)
        }
      }
    } catch (error) {
      console.error('Check today draw error:', error)
    }
  }

  // 抽取人格
  const handleDraw = async () => {
    setIsDrawing(true)

    try {
      const res = await Taro.cloud.callFunction({
        name: 'draw',
        data: { useResetCoin: false }
      })

      const result: any = res.result

      if (result.success) {
        setTodayPersonality(result.data)
        setHasDrawnToday(true)
        Taro.navigateTo({
          url: `/pages/card/card?id=${result.data.id}`
        })
      } else {
        Taro.showToast({
          title: result.error || '抽取失败',
          icon: 'none'
        })
      }
    } catch (error) {
      console.error('Draw error:', error)
      Taro.showToast({
        title: '抽取失败，请稍后重试',
        icon: 'none'
      })
    } finally {
      setIsDrawing(false)
    }
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
      success: async (res) => {
        if (res.confirm) {
          setIsDrawing(true)

          try {
            const drawRes = await Taro.cloud.callFunction({
              name: 'draw',
              data: { useResetCoin: true }
            })

            const result: any = drawRes.result

            if (result.success) {
              setTodayPersonality(result.data)
              setResetCoins(prev => prev - 1)
              Taro.navigateTo({
                url: `/pages/card/card?id=${result.data.id}`
              })
            } else {
              Taro.showToast({
                title: result.error || '重置失败',
                icon: 'none'
              })
            }
          } catch (error) {
            console.error('Reset error:', error)
            Taro.showToast({
              title: '重置失败，请稍后重试',
              icon: 'none'
            })
          } finally {
            setIsDrawing(false)
          }
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
