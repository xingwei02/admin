<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { adminAPI } from '@/api/admin'
import { Button } from '@/components/ui/button'

const loading = ref(false)
const checkedAt = ref('')
const issues = ref<any[]>([])

const load = async () => {
  loading.value = true
  try {
    const res = await adminAPI.getAffiliateLevelHealth()
    const data = res.data.data || {}
    checkedAt.value = data.checked_at || ''
    issues.value = data.issues || []
  } finally {
    loading.value = false
  }
}

onMounted(load)
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-semibold">伙伴等级返佣健康检查</h1>
        <p class="text-sm text-muted-foreground">检查等级档位、推广关系、无效档位引用和返佣上限倒挂问题。</p>
      </div>
      <Button :disabled="loading" @click="load">{{ loading ? '检查中...' : '重新检查' }}</Button>
    </div>
    <div class="rounded-lg border bg-card p-4 text-sm text-muted-foreground">检查时间：{{ checkedAt || '-' }}</div>
    <div class="overflow-hidden rounded-lg border bg-card">
      <table class="w-full text-sm">
        <thead class="bg-muted/50 text-left">
          <tr>
            <th class="p-3">检查项</th>
            <th class="p-3">异常数</th>
            <th class="p-3">状态</th>
            <th class="p-3">说明</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in issues" :key="item.code" class="border-t">
            <td class="p-3 font-medium">{{ item.title }}</td>
            <td class="p-3">{{ item.count }}</td>
            <td class="p-3"><span :class="item.count > 0 ? 'text-red-600' : 'text-emerald-600'">{{ item.count > 0 ? '异常' : '正常' }}</span></td>
            <td class="p-3 text-muted-foreground">{{ item.message }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>