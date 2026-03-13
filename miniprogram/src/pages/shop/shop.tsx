import { useState, useEffect } from 'react'
import { View, Text, ScrollView, Button } from '@tarojs/components'
import Taro from '@tarojs/taro'
import './shop.scss'

interface PersonalityPack {
  id: string
  name: string
  description: string
  category: string
  price: number
  personalityCount: number
}

export default function Shop() {
  const [packs, setPacks] = useState<PersonalityPack[]>([])
  const [activeTab, setActiveTab] = useState('all')

  // 模拟人格包数据
  const mockPacks: PersonalityPack[] = [
    {
      id: '1',
      name: '职业精英包',
      description: '霸道总裁、贴心管家、精英律师',
      category: '职业系',
      price: 5,
      personalityCount: 5
    },
    {
      id: '2',
      name: '性格探索包',
      description: '毒舌评论家、戏精本精、高冷学霸',
      category: '性格系',
      price: 5,
      personalityCount: 5
    },
    {
      id: '3',
      name: '奇幻冒险包',
      description: '末日幸存者、外星人访客、穿越古代人',
      category: '场景系',
      price: 5,
      personalityCount: 5
    },
    {
      id: '4',
      name: '经典角色包',
      description: '侦探推理王、美食评论家、禅修大师',
      category: '职业系',
      price: 8,
      personalityCount: 8
    }
  ]

  useEffect(() => {
    // 加载模拟数据
    setPacks(mockPacks)
  }, [])

  const handleBuy = (pack: PersonalityPack) => {
    Taro.showModal({
      title: '确认购买',
      content: `确定要购买「${pack.name}」吗？`,
      success: (res) => {
        if (res.confirm) {
          Taro.showToast({
            title: '购买功能开发中',
            icon: 'none'
          })
        }
      }
    })
  }

  const tabs = [
    { id: 'all', name: '全部' },
    { id: '性格系', name: '性格系' },
    { id: '职业系', name: '职业系' },
    { id: '场景系', name: '场景系' }
  ]

  const filteredPacks = activeTab === 'all'
    ? packs
    : packs.filter(pack => pack.category === activeTab)

  return (
    <View className='shop-container'>
      <View className='shop-header'>
        <Text className='header-title'>🏪 人格商店</Text>
      </View>

      {/* 分类标签 */}
      <View className='shop-tabs'>
        <ScrollView scrollX className='tab-scroll'>
          <View className='tab-list'>
            {tabs.map((tab) => (
              <View
                key={tab.id}
                className={`tab-item ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <Text>{tab.name}</Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* 人格包列表 */}
      <View className='shop-content'>
        {filteredPacks.length === 0 ? (
          <View className='empty-state'>
            <Text className='empty-text'>暂无内容</Text>
          </View>
        ) : (
          <View className='pack-list'>
            {filteredPacks.map((pack) => (
              <View key={pack.id} className='pack-card'>
                <View className='pack-header'>
                  <Text className='pack-name'>{pack.name}</Text>
                  <Text className='pack-category'>{pack.category}</Text>
                </View>

                <Text className='pack-desc'>{pack.description}</Text>

                <View className='pack-footer'>
                  <View className='pack-info'>
                    <Text className='pack-count'>{pack.personalityCount}个人格</Text>
                  </View>
                  <View className='pack-price'>
                    <Text className='price'>¥{pack.price}</Text>
                  </View>
                </View>

                <View className='pack-action'>
                  <Button className='btn-buy' onClick={() => handleBuy(pack)}>
                    立即购买
                  </Button>
                </View>
              </View>
            ))}
          </View>
        )}
      </View>

      {/* 会员入口 */}
      <View className='vip-entry'>
        <View className='vip-card'>
          <View className='vip-content'>
            <View className='vip-info'>
              <Text className='vip-title'>💎 开通会员</Text>
              <Text className='vip-desc'>解锁全部人格，无限次抽取</Text>
            </View>
            <View className='vip-price'>
              <Text className='price'>¥9.9/月</Text>
              <Text className='price-sub'>年费¥99</Text>
            </View>
          </View>
          <Button className='btn-vip'>立即开通</Button>
        </View>
      </View>
    </View>
  )
}
