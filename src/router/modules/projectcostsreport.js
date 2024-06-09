import layout from '@/layout'

export default {
  path: '/outsourcing',
  component: layout,
  redirect: '/outsourcing/manage',
  name: 'projectcostsreport',
  meta: {
    title: 'outsourcing',
    icon: 'personnel'
  },
  children: [
    {
      path: '/outsourcing/projectcostsreport',
      name: 'projectcostsreport',
      component: () => import('@/views/cost/projectcostsreport/index'),
      meta: {
        title: 'projectcostsreport',
        icon: 'personnel-manage'
      }
    }
  ]
}
