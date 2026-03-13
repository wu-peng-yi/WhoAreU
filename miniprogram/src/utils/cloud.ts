import Taro from '@tarojs/taro'

/**
 * 云开发工具类
 */
class CloudUtil {
  /**
   * 调用云函数
   */
  static async callFunction(name: string, data: any = {}) {
    try {
      const res = await Taro.cloud.callFunction({
        name,
        data
      })

      const result: any = res.result

      if (result.success) {
        return result.data
      } else {
        throw new Error(result.error || '云函数调用失败')
      }
    } catch (error) {
      console.error(`Cloud function [${name}] error:`, error)
      throw error
    }
  }

  /**
   * 初始化云开发环境
   */
  static init(env?: string) {
    Taro.cloud.init({
      env,
      traceUser: true
    })
  }

  /**
   * 抽取人格
   */
  static async draw(useResetCoin: boolean = false) {
    return CloudUtil.callFunction('draw', { useResetCoin })
  }

  /**
   * 获取用户信息
   */
  static async getUserInfo() {
    return CloudUtil.callFunction('user', { action: 'getInfo' })
  }

  /**
   * 获取历史记录列表
   */
  static async getHistory(page: number = 1, pageSize: number = 20) {
    return CloudUtil.callFunction('history', { page, pageSize })
  }

  /**
   * 获取单个记录详情
   */
  static async getRecord(recordId: string) {
    return CloudUtil.callFunction('history', { action: 'getRecord', recordId })
  }

  /**
   * 提交打卡
   */
  static async checkin(recordId: string, rating: number, note: string = '', photo: string = '') {
    return CloudUtil.callFunction('checkin', { recordId, rating, note, photo })
  }

  /**
   * 初始化人格数据
   */
  static async initPersonalities() {
    return CloudUtil.callFunction('init')
  }
}

export default CloudUtil
