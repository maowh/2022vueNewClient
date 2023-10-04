<template>
  <el-dialog
    :title="title"
    :model-value="modelValue"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    @close="closed"
  >
    <!-- <div v-if="props.tableName === 'domaininformation'"> -->
    <el-table
      ref="singleTableRef"
      :data="tableData"
      highlight-current-row
      @current-change="handleCurrentLine"
    >
      <el-table-column prop="id" :label="$t('msg.cost.id')"></el-table-column>
      <el-table-column
        prop="SystemName"
        :label="$t('msg.cost.SystemName')"
      ></el-table-column>
      <el-table-column
        prop="customerName"
        :label="$t('msg.cost.customerName')"
      ></el-table-column>
      <!-- <el-table-column
          prop="businessLines"
          :label="$t('msg.cost.businessLines')"
        ></el-table-column>
        <el-table-column
          prop="domain"
          :label="$t('msg.cost.domain')"
        ></el-table-column>
        <el-table-column
          prop="domainManager"
          :label="$t('msg.cost.domainManager')"
        ></el-table-column> -->
    </el-table>
    <!-- </div> -->
    <!-- <div v-else-if="props.tableName === 'customerinformation'">
      <el-table
        ref="singleTableRef"
        :data="tableData"
        highlight-current-row
        @current-change="handleCurrentLine"
      >
        <el-table-column prop="id" :label="$t('msg.cost.id')"></el-table-column>
        <el-table-column
          prop="customer"
          :label="$t('msg.cost.customerName')"
        ></el-table-column>
      </el-table>
    </div> -->

    <el-pagination
      class="pagination"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="page"
      :page-sizes="[5, 10]"
      :page-size="size"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>
    <div style="margin-top: 20px">
      <el-button type="primary" @click="onConfirm(tableData[1])">{{
        $t('msg.universal.confirm')
      }}</el-button>
      <el-button @click="closed()">{{ $t('msg.universal.cancel') }}</el-button>
    </div>
  </el-dialog>
</template>

<script setup>
import { defineProps, defineEmits, ref } from 'vue'
import { costListDisplay } from '@/api/cost'
import { ElTable, ElMessage } from 'element-plus'
// import { useI18n } from 'vue-i18n'

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  }
})
console.log(props)

const currentRow = ref()
const singleTableRef = ref(ElTable)

const handleCurrentLine = (val) => {
  currentRow.value = val
}

// 确定按钮点击事件
// const i18n = useI18n()
const title = ref()

// 数据相关
const tableData = ref([])
const total = ref(0)
const page = ref(1)
const size = ref(10)
// 获取数据的方法
const getListData = async () => {
  const result = await costListDisplay({
    table: 'systeminformation',
    page: page.value,
    size: size.value
  })
  tableData.value = result.list
  total.value = result.total
  console.log(result.list)
}
getListData()

// 分页相关，size改变触发
const handleSizeChange = (currentSize) => {
  size.value = currentSize
  getListData()
}

// 页码改变触发
const handleCurrentChange = (currentPage) => {
  page.value = currentPage
  getListData()
}

const emits = defineEmits(['update:modelValue', 'costSelect'])
const onConfirm = async (row) => {
  if (currentRow.value === undefined) {
    ElMessage.warning('请选择系统信息')
  } else {
    emits('costSelect', currentRow.value)
    console.log(currentRow.value)
    closed()
    singleTableRef.value.setCurrentRow(row)
  }
}
// 关闭
const closed = () => {
  emits('update:modelValue', false)
}
</script>

<style lang="scss" scoped></style>
