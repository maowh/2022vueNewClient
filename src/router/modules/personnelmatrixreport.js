import layout from '@/layout'

export default {
  path: '/personnelManage',
  component: layout,
  redirect: '/personnelManage/personnel',
  name: 'personnelmatrixreport',
  meta: {
    title: 'personnelManage',
    icon: 'personnel'
  },
  children: [
    {
      path: '/personnelManage/personnelmatrixreport',
      name: 'personnelmatrixreport',
      component: () => import('@/views/cost/personnelmatrixreport/index'),
      meta: {
        title: 'personnelmatrixreport',
        icon: 'personnel-manage'
      }
    }
  ]
}
