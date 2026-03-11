<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { adminAPI } from '@/api/admin'
import type { AdminTelegramBroadcast } from '@/api/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { formatDate } from '@/utils/format'
import { Loader2, Send } from 'lucide-vue-next'

const { t } = useI18n()

const loading = ref(false)
const items = ref<AdminTelegramBroadcast[]>([])
const pagination = ref({
  page: 1,
  page_size: 20,
  total: 0,
  total_page: 1,
})

const fetchBroadcasts = async (page = 1) => {
  loading.value = true
  try {
    const res = await adminAPI.getTelegramBroadcasts({
      page,
      page_size: pagination.value.page_size,
    })
    items.value = res.data?.data || []
    pagination.value = res.data?.pagination || pagination.value
  } catch {
    items.value = []
  } finally {
    loading.value = false
  }
}

const formatRecipientType = (value: string) =>
  value === 'specific' ? t('telegramBot.broadcasts.recipientTypeSpecific') : t('telegramBot.broadcasts.recipientTypeAll')

const formatStatus = (value: string) => {
  const normalized = String(value || '').trim().toLowerCase()
  if (normalized === 'running') return t('telegramBot.broadcasts.statusRunning')
  if (normalized === 'completed') return t('telegramBot.broadcasts.statusCompleted')
  if (normalized === 'failed') return t('telegramBot.broadcasts.statusFailed')
  return t('telegramBot.broadcasts.statusPending')
}

const changePage = (page: number) => {
  if (page < 1 || page > pagination.value.total_page || page === pagination.value.page) return
  fetchBroadcasts(page)
}

onMounted(() => {
  fetchBroadcasts()
})
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-bold tracking-tight">{{ t('telegramBot.broadcasts.title') }}</h2>
        <p class="text-muted-foreground">{{ t('telegramBot.broadcasts.subtitle') }}</p>
      </div>
      <Button as-child>
        <RouterLink to="/telegram-bot/broadcasts/create">
          <Send class="h-4 w-4 mr-2" />
          {{ t('telegramBot.broadcasts.create') }}
        </RouterLink>
      </Button>
    </div>

    <Card>
      <CardContent class="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>{{ t('telegramBot.broadcasts.tableTitle') }}</TableHead>
              <TableHead>{{ t('telegramBot.broadcasts.tableRecipientType') }}</TableHead>
              <TableHead>{{ t('telegramBot.broadcasts.tableStatus') }}</TableHead>
              <TableHead>{{ t('telegramBot.broadcasts.tableRecipientCount') }}</TableHead>
              <TableHead>{{ t('telegramBot.broadcasts.tableSuccessCount') }}</TableHead>
              <TableHead>{{ t('telegramBot.broadcasts.tableFailedCount') }}</TableHead>
              <TableHead>{{ t('telegramBot.broadcasts.tableCreatedAt') }}</TableHead>
              <TableHead>{{ t('telegramBot.broadcasts.tableCompletedAt') }}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-if="loading">
              <TableCell :colspan="9" class="py-10 text-center text-muted-foreground">
                <Loader2 class="mx-auto h-5 w-5 animate-spin" />
              </TableCell>
            </TableRow>
            <TableRow v-else-if="items.length === 0">
              <TableCell :colspan="9" class="py-10 text-center text-muted-foreground">
                {{ t('telegramBot.broadcasts.empty') }}
              </TableCell>
            </TableRow>
            <TableRow v-for="item in items" :key="item.id">
              <TableCell>{{ item.id }}</TableCell>
              <TableCell>
                <div class="space-y-1">
                  <div class="font-medium">{{ item.title }}</div>
                  <div v-if="item.last_error" class="line-clamp-2 text-xs text-destructive">{{ item.last_error }}</div>
                </div>
              </TableCell>
              <TableCell>{{ formatRecipientType(item.recipient_type) }}</TableCell>
              <TableCell>{{ formatStatus(item.status) }}</TableCell>
              <TableCell>{{ item.recipient_count }}</TableCell>
              <TableCell>{{ item.success_count }}</TableCell>
              <TableCell>{{ item.failed_count }}</TableCell>
              <TableCell>{{ formatDate(item.created_at) || '-' }}</TableCell>
              <TableCell>{{ formatDate(item.completed_at || '') || '-' }}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>

    <div class="flex items-center justify-end gap-2">
      <Button variant="outline" size="sm" :disabled="pagination.page <= 1" @click="changePage(pagination.page - 1)">
        {{ t('telegramBot.broadcasts.prevPage') }}
      </Button>
      <span class="text-sm text-muted-foreground">
        {{ t('telegramBot.broadcasts.pageSummary', { page: pagination.page, total: pagination.total_page }) }}
      </span>
      <Button variant="outline" size="sm" :disabled="pagination.page >= pagination.total_page" @click="changePage(pagination.page + 1)">
        {{ t('telegramBot.broadcasts.nextPage') }}
      </Button>
    </div>
  </div>
</template>
