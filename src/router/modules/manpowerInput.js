import layout from '@/layout'

export default {
  path: '/outsourcing',
  component: layout,
  redirect: '/outsourcing/manage',
  name: 'manpowerInput',
  meta: {
    title: 'outsourcing',
    icon: 'personnel'
  },
  children: [
    {
      path: '/outsourcing/manpowerInput',
      name: 'manpowerInput',
      component: () => import('@/views/cost/manpowerInput/index'),
      meta: {
        title: 'manpowerInput',
        icon: 'personnel-manage'
      }
    },
    {
      path: '/outsourcing/manpowerInputInfo/:id',
      name: 'manpowerInputInfo',
      component: () =>
        import('@/views/cost/manpowerInput/components/manpowerInputDetail'),
      props: true,
      meta: {
        title: 'manpowerInputInfo'
      }
    },
    {
      path: '/outsourcing/manpowerInputEdit/:id',
      name: 'manpowerInputEdit',
      component: () =>
        import('@/views/cost/manpowerInput/components/manpowerInputCreateEdit'),
      props: true,
      meta: {
        title: 'manpowerInputEdit'
      }
    },
    {
      path: '/outsourcing/manpowerInputCreate',
      name: 'manpowerInputCreate',
      component: () =>
        import('@/views/cost/manpowerInput/components/manpowerInputCreateEdit'),
      props: true,
      meta: {
        title: 'manpowerInputCreate'
      }
    }
  ]
}
