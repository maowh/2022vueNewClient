import layout from '@/layout'

export default {
  path: '/basics',
  component: layout,
  redirect: '/basics/manage',
  name: 'personnel',
  meta: {
    title: 'basics',
    icon: 'personnel'
  },
  children: [
    {
      path: '/basics/personnel',
      name: 'personnel',
      component: () => import('@/views/cost/personnel/index'),
      meta: {
        title: 'personnel',
        icon: 'personnel-manage'
      }
    }
  ]
}
