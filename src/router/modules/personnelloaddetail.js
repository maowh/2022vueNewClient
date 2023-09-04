import layout from '@/layout'

export default {
  path: '/personnelManage',
  component: layout,
  redirect: '/personnelManage/personnel',
  name: 'personnelloaddetail',
  meta: {
    title: 'personnelManage',
    icon: 'personnel'
  },
  children: [
    {
      path: '/personnelManage/personnelloaddetail',
      name: 'personnelloaddetail',
      component: () => import('@/views/cost/personnelloaddetail/index'),
      meta: {
        title: 'personnelloaddetail',
        icon: 'personnel-manage'
      }
    }
  ]
}
