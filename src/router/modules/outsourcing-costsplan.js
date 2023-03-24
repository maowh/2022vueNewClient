import layout from '@/layout'

export default {
  path: '/outsourcing',
  component: layout,
  redirect: '/outsourcing/manage',
  name: 'outsourcingplan',
  meta: {
    title: 'outsourcingplan',
    icon: 'personnel'
  },
  children: [
    {
      path: '/outsourcing/outsourcingplan',
      name: 'outsourcingplan',
      component: () => import('@/views/cost/outsourcing-costsplan/index'),
      meta: {
        title: 'outsourcingplan',
        icon: 'personnel-manage'
      }
    },
    {
      path: '/outsourcing/outsourcingplanInfo/:id',
      name: 'outsourcingplanInfo',
      component: () =>
        import(
          '@/views/cost/outsourcing-costsplan/components/outsourcingplanDetail'
        ),
      props: true,
      meta: {
        title: 'outsourcingplanInfo'
      }
    },
    {
      path: '/outsourcing/outsourcingplanEdit/:id',
      name: 'outsourcingplanEdit',
      component: () =>
        import(
          '@/views/cost/outsourcing-costsplan/components/outsourcingplanCreateEdit'
        ),
      props: true,
      meta: {
        title: 'outsourcingplanEdit'
      }
    },
    {
      path: '/outsourcing/outsourcingplanCreate',
      name: 'outsourcingplanCreate',
      component: () =>
        import(
          '@/views/cost/outsourcing-costsplan/components/outsourcingplanCreateEdit'
        ),
      props: true,
      meta: {
        title: 'outsourcingplanCreate'
      }
    }
  ]
}
