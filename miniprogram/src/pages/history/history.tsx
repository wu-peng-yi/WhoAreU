import { useState, useEffect } from 'react'
import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
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

  // 模拟历史记录数据
  const mockRecords: Record[] = [
    {
      _id: '1',
      draw_date: '2026-03-12T10:00:00Z',
      personality: {
        id: '1',
        name: '冷酷杀手',
        difficulty: 3,
        description: '话少、果断、不拖泥带水'
      },
      is_checkin: true,
      checkin_rating: 4
    },
    {
      _id: '2',
      draw_date: '2026-03-11T10:00:00Z',
      personality: {
        id: '2',
        name: '热情推销员',
        difficulty: 3,
        description: '自来熟、正能量、感染力十足'
      },
      is_checkin: true,
      checkin_rating: 5
    },
    {
      _id: '3',
      draw_date: '2026-03-10T10:00:00Z',
      personality: {
        id: '3',
        name: '佛系青年',
        difficulty: 2,
        description: '无所谓、都可以、随遇而安'
      },
      is_checkin: false
    },
    {
      _id: '4',
      draw_date: '2026-03-09T10:00:00Z',
      personality: {
        id: '4',
        name: '毒舌评论家',
        difficulty: 4,
        description: '犀利、直接、一针见血'
      },
      is_checkin: true,
      checkin_rating: 3
    },
    {
      _id: '5',
      draw_date: '2026-03-08T10:00:00Z',
      personality: {
        id: '5',
        name: '霸道总裁',
        difficulty: 3,
        description: '掌控一切、说一不二'
      },
      is_checkin: false
    }
  ]

  useEffect(() => {
    loadHistory()
  }, [])

  const loadHistory = async () => {
    setLoading(true)
    // 使用模拟数据
    setTimeout(() => {
      setRecords(mockRecords)
      setLoading(false)
    }, 300)
  }

  const goToDetail = (recordId: string) => {
    Taro.navigateTo({
      url: `/pages/card/card?id=${recordId}`
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
