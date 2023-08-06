import layout from '@/layout'

export default {
  path: '/personnelManage',
  component: layout,
  redirect: '/personnelManage/personnel',
  name: 'personnelloadreport',
  meta: {
    title: 'personnelManage',
    icon: 'personnel'
  },
  children: [
    {
      path: '/personnelManage/personnelloadreport',
      name: 'personnelloadreport',
      component: () => import('@/views/cost/personnelloadreport/index'),
      meta: {
        title: 'personnelloadreport',
        icon: 'personnel-manage'
      }
    }
  ]
}
