import CloudUtil from '../utils/cloud'

/**
 * 人格服务
 */
export const personalityService = {
  /**
   * 抽取人格
   */
  async draw(useResetCoin: boolean = false) {
    return CloudUtil.callFunction('draw', { useResetCoin })
  },

  /**
   * 获取人格详情
   */
  async getDetail(id: string) {
    // TODO: 实现获取人格详情
    return null
  }
}

/**
 * 打卡服务
 */
export const checkinService = {
  /**
   * 提交打卡
   */
  async submit(recordId: string, rating: number, note?: string, photo?: string) {
    return CloudUtil.callFunction('checkin', { recordId, rating, note, photo })
  }
}

/**
 * 历史记录服务
 */
export const historyService = {
  /**
   * 获取历史记录
   */
  async getList(page: number = 1, pageSize: number = 20) {
    return CloudUtil.callFunction('history', { page, pageSize })
  }
}

/**
 * 用户服务
 */
export const userService = {
  /**
   * 获取用户信息
   */
  async getInfo() {
    // TODO: 实现获取用户信息
    return null
  }
}
