<template>
  <!-- 支持渲染多级menu菜单 -->
  <el-sub-menu v-if="route.children.length > 0" :index="route.path">
    <template #title>
      <MenuItem :title="route.meta.title" :icon="route.meta.icon"></MenuItem>
    </template>
    <!-- 循环渲染 -->
    <sidebar-item
      v-for="item in route.children"
      :key="item.path"
      :route="item"
    ></sidebar-item>
  </el-sub-menu>
  <!-- 如果不包含子路由则渲染item项 -->
  <el-menu-item v-else :index="route.path">
    <MenuItem :title="route.meta.title" :icon="route.meta.icon"></MenuItem>
  </el-menu-item>
</template>

<script setup>
import { defineProps } from 'vue'
import MenuItem from './MenuItem.vue'

// 定义props
defineProps({
  route: {
    type: Object,
    required: true
  }
})
</script>

<style lang="scss" scoped>
.el-menu-item {
  height: 40px;
  line-height: 40px;
}
.el-sub-menu .el-menu-item {
  height: 40px;
  line-height: 40px;
}
.el-sub-menu__title {
  height: 40px;
  line-height: 40px;
}
</style>
