import layout from '@/layout'

export default {
  path: '/outsourcing',
  component: layout,
  redirect: '/outsourcing/manage',
  name: 'outsourcingAmount',
  meta: {
    title: 'outsourcing',
    icon: 'personnel'
  },
  children: [
    {
      path: '/outsourcing/outsourcingAmount',
      name: 'outsourcingAmount',
      component: () => import('@/views/cost/outsourcingAmount/index'),
      meta: {
        title: 'outsourcingAmount',
        icon: 'personnel-manage'
      }
    },
    {
      path: '/outsourcing/outsourcingAmountInfo/:id',
      name: 'outsourcingAmountInfo',
      component: () =>
        import(
          '@/views/cost/outsourcingAmount/components/outsourcingAmountDetail'
        ),
      props: true,
      meta: {
        title: 'outsourcingAmountInfo'
      }
    },
    {
      path: '/outsourcing/outsourcingAmountEdit/:id',
      name: 'outsourcingAmountEdit',
      component: () =>
        import(
          '@/views/cost/outsourcingAmount/components/outsourcingAmountCreateEdit'
        ),
      props: true,
      meta: {
        title: 'outsourcingAmountEdit'
      }
    },
    {
      path: '/outsourcing/outsourcingAmountCreate',
      name: 'outsourcingAmountCreate',
      component: () =>
        import(
          '@/views/cost/outsourcingAmount/components/outsourcingAmountCreateEdit'
        ),
      props: true,
      meta: {
        title: 'outsourcingAmountCreate'
      }
    }
  ]
}
