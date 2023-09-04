import layout from '@/layout'

export default {
  path: '/outsourcing',
  component: layout,
  redirect: '/outsourcing/manage',
  name: 'costsfinish',
  meta: {
    title: 'costsfinish',
    icon: 'personnel'
  },
  children: [
    {
      path: '/outsourcing/costsfinish',
      name: 'costsfinish',
      component: () => import('@/views/cost/costsfinish/index'),
      meta: {
        title: 'costsfinish',
        icon: 'personnel-manage'
      }
    }
  ]
}
