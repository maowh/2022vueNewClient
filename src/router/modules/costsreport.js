import layout from '@/layout'

export default {
  path: '/outsourcing',
  component: layout,
  redirect: '/outsourcing/manage',
  name: 'costsreport',
  meta: {
    title: 'outsourcing',
    icon: 'personnel'
  },
  children: [
    {
      path: '/outsourcing/costsreport',
      name: 'costsreport',
      component: () => import('@/views/cost/costsreport/index'),
      meta: {
        title: 'costsreport',
        icon: 'personnel-manage'
      }
    }
  ]
}
