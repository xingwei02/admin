<template>
  <div class="promotion-plan-setting">
    <div class="header">
      <h1>推广方案设置</h1>
      <p class="subtitle">自定义你的推广返利方案，支持 3 个等级</p>
    </div>

    <div class="content">
      <!-- 表单 -->
      <form @submit.prevent="handleSubmit" class="plan-form">
        <!-- 一级配置 -->
        <div class="level-section">
          <h2>一级等级配置</h2>
          <div class="form-group">
            <label>等级名称</label>
            <input v-model="form.level1Name" type="text" placeholder="如：铜牌" required />
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>返利比例 (%)</label>
              <input v-model.number="form.level1Rate" type="number" step="0.01" min="0" max="100" required />
            </div>
            <div class="form-group">
              <label>升级条件类型</label>
              <select v-model="form.level1CondType" required>
                <option value="amount">按销售额</option>
                <option value="count">按订单数</option>
              </select>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>升级条件值</label>
              <input v-model.number="form.level1CondValue" type="number" step="0.01" min="0" required />
            </div>
            <div class="form-group">
              <label>连续天数</label>
              <input v-model.number="form.level1CondDays" type="number" min="1" required />
            </div>
          </div>
        </div>

        <!-- 二级配置 -->
        <div class="level-section">
          <h2>二级等级配置</h2>
          <div class="form-group">
            <label>等级名称</label>
            <input v-model="form.level2Name" type="text" placeholder="如：银牌" />
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>返利比例 (%)</label>
              <input v-model.number="form.level2Rate" type="number" step="0.01" min="0" max="100" />
            </div>
            <div class="form-group">
              <label>升级条件类型</label>
              <select v-model="form.level2CondType">
                <option value="amount">按销售额</option>
                <option value="count">按订单数</option>
              </select>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>升级条件值</label>
              <input v-model.number="form.level2CondValue" type="number" step="0.01" min="0" />
            </div>
            <div class="form-group">
              <label>连续天数</label>
              <input v-model.number="form.level2CondDays" type="number" min="1" />
            </div>
          </div>
        </div>

        <!-- 三级配置 -->
        <div class="level-section">
          <h2>三级等级配置</h2>
          <div class="form-group">
            <label>等级名称</label>
            <input v-model="form.level3Name" type="text" placeholder="如：金牌" />
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>返利比例 (%)</label>
              <input v-model.number="form.level3Rate" type="number" step="0.01" min="0" max="100" />
            </div>
            <div class="form-group">
              <label>升级条件类型</label>
              <select v-model="form.level3CondType">
                <option value="amount">按销售额</option>
                <option value="count">按订单数</option>
              </select>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>升级条件值</label>
              <input v-model.number="form.level3CondValue" type="number" step="0.01" min="0" />
            </div>
            <div class="form-group">
              <label>连续天数</label>
              <input v-model.number="form.level3CondDays" type="number" min="1" />
            </div>
          </div>
        </div>

        <!-- 按钮 -->
        <div class="form-actions">
          <button type="button" @click="handlePreview" class="btn btn-secondary">预览</button>
          <button type="submit" class="btn btn-primary" :disabled="loading">
            {{ loading ? '保存中...' : '保存方案' }}
          </button>
        </div>
      </form>

      <!-- 预览 -->
      <div v-if="showPreview" class="preview-section">
        <h2>方案预览</h2>
        <div class="preview-table">
          <table>
            <thead>
              <tr>
                <th>等级</th>
                <th>返利比例</th>
                <th>升级条件</th>
                <th>考核周期</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{{ form.level1Name }}</td>
                <td>{{ form.level1Rate }}%</td>
                <td>{{ form.level1CondType === 'amount' ? '销售额' : '订单数' }} ≥ {{ form.level1CondValue }}</td>
                <td>{{ form.level1CondDays }} 天</td>
              </tr>
              <tr v-if="form.level2Rate > 0">
                <td>{{ form.level2Name }}</td>
                <td>{{ form.level2Rate }}%</td>
                <td>{{ form.level2CondType === 'amount' ? '销售额' : '订单数' }} ≥ {{ form.level2CondValue }}</td>
                <td>{{ form.level2CondDays }} 天</td>
              </tr>
              <tr v-if="form.level3Rate > 0">
                <td>{{ form.level3Name }}</td>
                <td>{{ form.level3Rate }}%</td>
                <td>{{ form.level3CondType === 'amount' ? '销售额' : '订单数' }} ≥ {{ form.level3CondValue }}</td>
                <td>{{ form.level3CondDays }} 天</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useMessage } from 'naive-ui'

const message = useMessage()
const loading = ref(false)
const showPreview = ref(false)

const form = reactive({
  level1Name: '铜牌',
  level1Rate: 10,
  level1CondType: 'amount',
  level1CondValue: 500,
  level1CondDays: 3,

  level2Name: '银牌',
  level2Rate: 15,
  level2CondType: 'amount',
  level2CondValue: 1000,
  level2CondDays: 3,

  level3Name: '金牌',
  level3Rate: 20,
  level3CondType: 'amount',
  level3CondValue: 2000,
  level3CondDays: 3,
})

const handlePreview = () => {
  showPreview.value = !showPreview.value
}

const handleSubmit = async () => {
  // 验证返利比例递减
  if (form.level2Rate > 0 && form.level2Rate >= form.level1Rate) {
    message.error('二级返利比例必须小于一级')
    return
  }
  if (form.level3Rate > 0 && form.level3Rate >= form.level2Rate) {
    message.error('三级返利比例必须小于二级')
    return
  }

  loading.value = true
  try {
    const response = await fetch('/api/admin/promotion-plan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })

    if (response.ok) {
      message.success('推广方案已保存')
    } else {
      message.error('保存失败，请重试')
    }
  } catch (error) {
    message.error('网络错误')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.promotion-plan-setting {
  padding: 24px;
  max-width: 1000px;
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
  background: white;
  border-radius: 8px;
  padding: 24px;
}

.plan-form {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.level-section {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 20px;
  background: #f9fafb;
}

.level-section h2 {
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 16px 0;
  color: #1f2937;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
}

.form-group input,
.form-group select {
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  font-family: inherit;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.form-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 24px;
}

.btn {
  padding: 10px 24px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary {
  background: #3b82f6;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #2563eb;
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-secondary {
  background: #e5e7eb;
  color: #374151;
}

.btn-secondary:hover {
  background: #d1d5db;
}

.preview-section {
  margin-top: 32px;
  padding-top: 32px;
  border-top: 1px solid #e5e7eb;
}

.preview-section h2 {
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 16px 0;
}

.preview-table {
  overflow-x: auto;
}

.preview-table table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.preview-table th {
  background: #f3f4f6;
  padding: 12px;
  text-align: left;
  font-weight: 600;
  color: #374151;
  border-bottom: 2px solid #e5e7eb;
}

.preview-table td {
  padding: 12px;
  border-bottom: 1px solid #e5e7eb;
}

.preview-table tr:hover {
  background: #f9fafb;
}
</style>
