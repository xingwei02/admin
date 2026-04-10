<template>
  <div class="promotion-stats">
    <div class="header">
      <h1>推广统计</h1>
      <p class="subtitle">查看你的下级推广伙伴和佣金统计</p>
    </div>

    <div class="content">
      <!-- 统计卡片 -->
      <div class="stats-cards">
        <div class="stat-card">
          <div class="stat-label">下级总数</div>
          <div class="stat-value">{{ stats.totalSubordinates }}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">待确认佣金</div>
          <div class="stat-value">¥{{ stats.pendingCommission.toFixed(2) }}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">可提现佣金</div>
          <div class="stat-value">¥{{ stats.availableCommission.toFixed(2) }}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">已提现佣金</div>
          <div class="stat-value">¥{{ stats.withdrawnCommission.toFixed(2) }}</div>
        </div>
      </div>

      <!-- 下级列表 -->
      <div class="section">
        <h2>下级推广伙伴</h2>
        <div class="table-wrapper">
          <table class="subordinates-table">
            <thead>
              <tr>
                <th>用户</th>
                <th>当前等级</th>
                <th>返利比例</th>
                <th>升级进度</th>
                <th>本月销售额</th>
                <th>本月订单数</th>
                <th>本月佣金</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="sub in subordinates" :key="sub.id">
                <td>{{ sub.email }}</td>
                <td>
                  <span class="level-badge" :class="`level-${sub.currentLevel}`">
                    {{ getLevelName(sub.currentLevel) }}
                  </span>
                </td>
                <td>{{ sub.currentRate }}%</td>
                <td>
                  <div class="progress-bar">
                    <div class="progress-fill" :style="{ width: sub.progressPercent + '%' }"></div>
                  </div>
                  <span class="progress-text">{{ sub.progressPercent.toFixed(0) }}%</span>
                </td>
                <td>¥{{ sub.monthlySales.toFixed(2) }}</td>
                <td>{{ sub.monthlyOrders }}</td>
                <td>¥{{ sub.monthlyCommission.toFixed(2) }}</td>
              </tr>
              <tr v-if="subordinates.length === 0">
                <td colspan="7" class="empty-state">暂无下级推广伙伴</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- 佣金统计 -->
      <div class="section">
        <h2>佣金统计</h2>
        <div class="commission-stats">
          <div class="stat-item">
            <div class="stat-title">按等级分布</div>
            <div class="stat-content">
              <div v-for="level in [1, 2, 3]" :key="level" class="level-stat">
                <span class="level-name">{{ getLevelName(level) }}</span>
                <span class="level-commission">¥{{ getCommissionByLevel(level).toFixed(2) }}</span>
              </div>
            </div>
          </div>
          <div class="stat-item">
            <div class="stat-title">按状态分布</div>
            <div class="stat-content">
              <div class="status-stat">
                <span>待确认</span>
                <span>¥{{ stats.pendingCommission.toFixed(2) }}</span>
              </div>
              <div class="status-stat">
                <span>可提现</span>
                <span>¥{{ stats.availableCommission.toFixed(2) }}</span>
              </div>
              <div class="status-stat">
                <span>已提现</span>
                <span>¥{{ stats.withdrawnCommission.toFixed(2) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface Subordinate {
  id: number
  email: string
  currentLevel: number
  currentRate: number
  progressPercent: number
  monthlySales: number
  monthlyOrders: number
  monthlyCommission: number
}

interface Stats {
  totalSubordinates: number
  pendingCommission: number
  availableCommission: number
  withdrawnCommission: number
}

const stats = ref<Stats>({
  totalSubordinates: 0,
  pendingCommission: 0,
  availableCommission: 0,
  withdrawnCommission: 0,
})

const subordinates = ref<Subordinate[]>([])

const getLevelName = (level: number): string => {
  const names: Record<number, string> = {
    1: '铜牌',
    2: '银牌',
    3: '金牌',
  }
  return names[level] || '未知'
}

const getCommissionByLevel = (level: number): number => {
  return subordinates.value
    .filter(sub => sub.currentLevel === level)
    .reduce((sum, sub) => sum + sub.monthlyCommission, 0)
}

const loadData = async () => {
  try {
    // 加载下级列表
    const subResponse = await fetch('/api/admin/promotion/subordinates')
    if (subResponse.ok) {
      const data = await subResponse.json()
      subordinates.value = data.data || []
      stats.value.totalSubordinates = subordinates.value.length
    }

    // 加载统计数据
    const statsResponse = await fetch('/api/admin/promotion/stats')
    if (statsResponse.ok) {
      const data = await statsResponse.json()
      stats.value = { ...stats.value, ...data.data }
    }
  } catch (error) {
    console.error('Failed to load data:', error)
  }
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.promotion-stats {
  padding: 24px;
  max-width: 1400px;
  margin: 0 auto;
}

.header {
  margin-bottom: 32px;
}

.header h1 {
  font-size: 24px;
  font-weight: 600;
  margin: 0 0 8px 0;
}

.subtitle {
  color: #666;
  margin: 0;
}

.content {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.stats-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.stat-card {
  background: white;
  border-radius: 8px;
  padding: 20px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.stat-label {
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
}

.stat-value {
  font-size: 28px;
  font-weight: 600;
  color: #1f2937;
}

.section {
  background: white;
  border-radius: 8px;
  padding: 24px;
  border: 1px solid #e5e7eb;
}

.section h2 {
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 20px 0;
  color: #1f2937;
}

.table-wrapper {
  overflow-x: auto;
}

.subordinates-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.subordinates-table th {
  background: #f3f4f6;
  padding: 12px;
  text-align: left;
  font-weight: 600;
  color: #374151;
  border-bottom: 2px solid #e5e7eb;
}

.subordinates-table td {
  padding: 12px;
  border-bottom: 1px solid #e5e7eb;
}

.subordinates-table tr:hover {
  background: #f9fafb;
}

.level-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.level-badge.level-1 {
  background: #fef3c7;
  color: #92400e;
}

.level-badge.level-2 {
  background: #dbeafe;
  color: #0c4a6e;
}

.level-badge.level-3 {
  background: #fce7f3;
  color: #831843;
}

.progress-bar {
  width: 100px;
  height: 6px;
  background: #e5e7eb;
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 4px;
}

.progress-fill {
  height: 100%;
  background: #3b82f6;
  transition: width 0.3s;
}

.progress-text {
  font-size: 12px;
  color: #666;
}

.empty-state {
  text-align: center;
  color: #999;
  padding: 40px 12px !important;
}

.commission-stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.stat-item {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 16px;
  background: #f9fafb;
}

.stat-title {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 12px;
}

.stat-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.level-stat,
.status-stat {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  font-size: 14px;
}

.level-stat span:first-child,
.status-stat span:first-child {
  color: #666;
}

.level-stat span:last-child,
.status-stat span:last-child {
  font-weight: 600;
  color: #1f2937;
}

@media (max-width: 768px) {
  .stats-cards {
    grid-template-columns: 1fr 1fr;
  }

  .commission-stats {
    grid-template-columns: 1fr;
  }

  .subordinates-table {
    font-size: 12px;
  }

  .subordinates-table th,
  .subordinates-table td {
    padding: 8px;
  }
}
</style>
