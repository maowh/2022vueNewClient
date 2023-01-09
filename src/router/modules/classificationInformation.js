import layout from '@/layout'

export default {
  path: '/basics',
  component: layout,
  redirect: '/basics/manage',
  name: 'basicsManage',
  meta: {
    title: 'basics',
    icon: 'personnel'
  },
  children: [
    {
      path: '/basics/manage',
      name: 'basicsManage',
      component: () => import('@/views/cost/classification-information/index'),
      meta: {
        title: 'basicsManage',
        icon: 'personnel-manage'
      }
    }
  ]
}
