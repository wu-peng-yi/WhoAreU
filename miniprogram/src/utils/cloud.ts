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
}

export default CloudUtil
