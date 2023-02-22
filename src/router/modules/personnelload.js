import layout from '@/layout'

export default {
  path: '/outsourcing',
  component: layout,
  redirect: '/outsourcing/manage',
  name: 'personnelload',
  meta: {
    title: 'personnelload',
    icon: 'personnel'
  },
  children: [
    {
      path: '/outsourcing/personnelload',
      name: 'personnelload',
      component: () => import('@/views/cost/personnelload/index'),
      meta: {
        title: 'personnelload',
        icon: 'personnel-manage'
      }
    },
    {
      path: '/outsourcing/personnelloadInfo/:id',
      name: 'personnelloadInfo',
      component: () =>
        import('@/views/cost/personnelload/components/personnelloadDetail'),
      props: true,
      meta: {
        title: 'personnelloadInfo'
      }
    },
    {
      path: '/outsourcing/personnelloadEdit/:id',
      name: 'personnelloadEdit',
      component: () =>
        import('@/views/cost/personnelload/components/personnelloadCreateEdit'),
      props: true,
      meta: {
        title: 'personnelloadEdit'
      }
    },
    {
      path: '/outsourcing/personnelloadCreate',
      name: 'personnelloadCreate',
      component: () =>
        import('@/views/cost/personnelload/components/personnelloadCreateEdit'),
      props: true,
      meta: {
        title: 'personnelloadCreate'
      }
    }
  ]
}
