import layout from '@/layout'

export default {
  path: '/outsourcing',
  component: layout,
  redirect: '/outsourcing/manage',
  name: 'projectcosts',
  meta: {
    title: 'outsourcing',
    icon: 'personnel'
  },
  children: [
    {
      path: '/outsourcing/projectcosts',
      name: 'projectcosts',
      component: () => import('@/views/cost/projectcosts/index'),
      meta: {
        title: 'projectcosts',
        icon: 'personnel-manage'
      }
    },
    {
      path: '/outsourcing/projectcostsInfo/:id',
      name: 'projectcostsInfo',
      component: () =>
        import('@/views/cost/projectcosts/components/projectcostsDetail'),
      props: true,
      meta: {
        title: 'projectcostsInfo'
      }
    },
    {
      path: '/outsourcing/projectcostsEdit/:id',
      name: 'projectcostsEdit',
      component: () =>
        import('@/views/cost/projectcosts/components/projectcostsCreateEdit'),
      props: true,
      meta: {
        title: 'projectcostsEdit'
      }
    },
    {
      path: '/outsourcing/projectcostsCreate',
      name: 'projectcostsCreate',
      component: () =>
        import('@/views/cost/projectcosts/components/projectcostsCreateEdit'),
      props: true,
      meta: {
        title: 'projectcostsCreate'
      }
    }
  ]
}
