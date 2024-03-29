import layout from '@/layout'

export default {
  path: '/personnelManage',
  component: layout,
  redirect: '/personnelManage/personnel',
  name: 'personnel',
  meta: {
    title: 'personnelManage',
    icon: 'personnel'
  },
  children: [
    {
      path: '/personnelManage/personnel',
      name: 'personnel',
      component: () => import('@/views/cost/personnel/index'),
      meta: {
        title: 'personnel',
        icon: 'personnel-manage'
      }
    }
  ]
}
