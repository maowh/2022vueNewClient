import layout from '@/layout'

export default {
  path: '/basics',
  component: layout,
  redirect: '/basics/manage',
  name: 'coststandardList',
  meta: {
    title: 'basics',
    icon: 'personnel'
  },
  children: [
    {
      path: '/basics/coststandard',
      name: 'coststandard',
      component: () => import('@/views/cost/cost-standard/index'),
      meta: {
        title: 'coststandardList',
        icon: 'personnel-manage'
      }
    }
  ]
}
