import { useState, useEffect } from 'react'
import { View, Text, Button, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import CloudUtil from '../../utils/cloud'
import './index.scss'

export default function Index() {
  const [todayPersonality, setTodayPersonality] = useState<any>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [resetCoins, setResetCoins] = useState(3)
  const [hasDrawnToday, setHasDrawnToday] = useState(false)
  const [todayRecordId, setTodayRecordId] = useState('')
  const [showInit, setShowInit] = useState(false)

  useEffect(() => {
    loadUserData()
  }, [])

  // 初始化人格数据
  const handleInit = async () => {
    try {
      const result = await CloudUtil.initPersonalities()
      if (result.success) {
        Taro.showToast({
          title: result.message || '初始化成功',
          icon: 'success'
        })
        setShowInit(false)
      } else {
        Taro.showToast({
          title: result.message || result.error,
          icon: 'none'
        })
      }
    } catch (error: any) {
      Taro.showToast({
        title: error.message || '初始化失败',
        icon: 'none'
      })
    }
  }

  // 加载用户数据和今日抽取状态
  const loadUserData = async () => {
    try {
      // 获取用户信息
      const userInfo = await CloudUtil.getUserInfo()
      if (userInfo.success) {
        setResetCoins(userInfo.data?.coins || 3)
      }

      // 检查今日是否已抽取
      await checkTodayDraw()
    } catch (error) {
      console.error('Load user data error:', error)
    }
  }

  // 检查今日是否已抽取
  const checkTodayDraw = async () => {
    try {
      const result = await CloudUtil.getHistory(1, 1)
      if (result.success && result.data.records && result.data.records.length > 0) {
        const today = new Date().toISOString().split('T')[0]
        const latestRecord = result.data.records[0]
        const drawDate = new Date(latestRecord.draw_date).toISOString().split('T')[0]

        if (drawDate === today) {
          setTodayPersonality(latestRecord.personality)
          setTodayRecordId(latestRecord._id)
          setHasDrawnToday(true)
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
      const result = await CloudUtil.draw(false)

      if (result.success && result.data) {
        setTodayPersonality(result.data.personality || result.data)
        setTodayRecordId(result.data._id || result.data.recordId)
        setHasDrawnToday(true)

        Taro.showToast({
          title: `抽中${result.data.personality?.name || result.data.name}!`,
          icon: 'success'
        })
      }
    } catch (error: any) {
      Taro.showToast({
        title: error.message || '抽取失败',
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
            const result = await CloudUtil.draw(true)

            if (result.success && result.data) {
              setTodayPersonality(result.data.personality || result.data)
              setResetCoins(prev => prev - 1)
              Taro.showToast({
                title: `重置为${result.data.personality?.name || result.data.name}!`,
                icon: 'success'
              })
            }
          } catch (error: any) {
            Taro.showToast({
              title: error.message || '重置失败',
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
              url: `/pages/card/card?recordId=${todayRecordId}`
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

      {/* 调试按钮 - 初始化数据 */}
      <View className='debug-area'>
        <Text className='debug-btn' onClick={() => setShowInit(true)}>
          🔧 初始化人格数据
        </Text>
        {showInit && (
          <View className='init-confirm'>
            <Text>确定要初始化人格数据吗？</Text>
            <View className='init-btns'>
              <Text className='init-cancel' onClick={() => setShowInit(false)}>取消</Text>
              <Text className='init-confirm-btn' onClick={handleInit}>确定</Text>
            </View>
          </View>
        )}
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
