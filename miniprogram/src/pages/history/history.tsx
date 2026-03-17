import { useState, useEffect } from 'react'
import { View, Text } from '@tarojs/components'
import Taro, { useDidShow } from '@tarojs/taro'
import CloudUtil from '../../utils/cloud'
import './history.scss'

interface Record {
  _id: string
  draw_date: string
  personality: {
    id: string
    name: string
    difficulty: number
    description: string
  }
  is_checkin: boolean
  checkin_rating?: number
}

export default function History() {
  const [records, setRecords] = useState<Record[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadHistory()
  }, [])

  useDidShow(() => {
    // 每次页面显示时刷新数据
    loadHistory()
  })

  const loadHistory = async () => {
    setLoading(true)
    try {
      const result = await CloudUtil.getHistory(1, 50)
      console.log('History result:', result)
      if (result.success && result.data.records) {
        console.log('History records:', result.data.records)
        // 检查并输出每条记录的 _id
        result.data.records.forEach((record: any, index: number) => {
          console.log(`Record ${index} _id:`, record._id)
        })
        setRecords(result.data.records)
      }
    } catch (error) {
      console.error('Load history error:', error)
      Taro.showToast({
        title: '加载失败',
        icon: 'none'
      })
    } finally {
      setLoading(false)
    }
  }

  const goToDetail = (recordId: string) => {
    console.log('Navigate to card with recordId:', recordId)
    Taro.navigateTo({
      url: `/pages/card/card?recordId=${recordId}`
    })
  }

  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr)
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${month}/${day}`
  }

  const renderStars = (rating?: number) => {
    if (!rating) return null
    return '⭐'.repeat(rating)
  }

  if (loading) {
    return (
      <View className='history-loading'>
        <Text>加载中...</Text>
      </View>
    )
  }

  return (
    <View className='history-container'>
      <View className='history-header'>
        <Text className='header-title'>📜 人格历史</Text>
      </View>

      {records.length === 0 ? (
        <View className='empty-state'>
          <Text className='empty-icon'>🎭</Text>
          <Text className='empty-text'>还没有抽取记录</Text>
          <Text className='empty-hint'>快去首页抽取今日人格吧</Text>
        </View>
      ) : (
        <View className='record-list'>
          {records.map((record) => (
            <View
              key={record._id}
              className='record-card'
              onClick={() => goToDetail(record._id)}
            >
              <View className='record-date'>
                <Text className='date-text'>{formatDate(record.draw_date)}</Text>
              </View>

              <View className='record-content'>
                <View className='record-header'>
                  <Text className='record-name'>{record.personality?.name || '未知人格'}</Text>
                  {record.personality?.difficulty && (
                    <Text className='record-difficulty'>
                      {'⭐'.repeat(record.personality.difficulty)}
                    </Text>
                  )}
                </View>

                <Text className='record-desc'>
                  {record.personality?.description || ''}
                </Text>

                <View className='record-footer'>
                  <View className='checkin-status'>
                    {record.is_checkin ? (
                      <View className='checkin-done'>
                        <Text className='status-icon'>✅</Text>
                        <Text className='status-text'>已打卡</Text>
                        <Text className='rating'>{renderStars(record.checkin_rating)}</Text>
                      </View>
                    ) : (
                      <View className='checkin-pending'>
                        <Text className='status-text'>未打卡</Text>
                      </View>
                    )}
                  </View>
                  <Text className='arrow'>›</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
  )
}
