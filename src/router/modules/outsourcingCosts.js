import layout from '@/layout'

export default {
  path: '/outsourcing',
  component: layout,
  redirect: '/outsourcing/manage',
  name: 'outsourcingManage',
  meta: {
    title: 'outsourcing',
    icon: 'personnel'
  },
  children: [
    {
      path: '/outsourcing/manage',
      name: 'outsourcingManage',
      component: () => import('@/views/cost/outsourcing-costs/index'),
      meta: {
        title: 'outsourcingManage',
        icon: 'personnel-manage'
      }
    },
    {
      path: '/outsourcing/outsourcingInfo/:id',
      name: 'outsourcingInfo',
      component: () =>
        import('@/views/cost/outsourcing-costs/components/outsourcingDetail'),
      props: true,
      meta: {
        title: 'outsourcingInfo'
      }
    },
    {
      path: '/outsourcing/outsourcingEdit/:id',
      name: 'outsourcingEdit',
      component: () =>
        import(
          '@/views/cost/outsourcing-costs/components/outsourcingCreateEdit'
        ),
      props: true,
      meta: {
        title: 'outsourcingEdit'
      }
    },
    {
      path: '/outsourcing/outsourcingCreate',
      name: 'outsourcingCreate',
      component: () =>
        import(
          '@/views/cost/outsourcing-costs/components/outsourcingCreateEdit'
        ),
      props: true,
      meta: {
        title: 'outsourcingCreate'
      }
    }
  ]
}
