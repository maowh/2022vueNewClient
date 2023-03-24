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
      name: 'coststandardList',
      component: () => import('@/views/cost/cost-standard/index'),
      meta: {
        title: 'coststandardList',
        icon: 'personnel-manage'
      }
    },
    {
      path: '/basics/coststandardInfo/:id',
      name: 'coststandardInfo',
      component: () =>
        import('@/views/cost/cost-standard/components/coststandardDetail'),
      props: true,
      meta: {
        title: 'coststandardInfo'
      }
    },
    {
      path: '/basics/coststandardEdit/:id',
      name: 'coststandardEdit',
      component: () =>
        import('@/views/cost/cost-standard/components/coststandardCreateEdit'),
      props: true,
      meta: {
        title: 'coststandardEdit'
      }
    },
    {
      path: '/basics/coststandardCreate',
      name: 'coststandardCreate',
      component: () =>
        import('@/views/cost/cost-standard/components/coststandardCreateEdit'),
      props: true,
      meta: {
        title: 'coststandardCreate'
      }
    }
  ]
}
