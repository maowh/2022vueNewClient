import layout from '@/layout'

export default {
  path: '/outsourcing',
  component: layout,
  redirect: '/outsourcing/manage',
  name: 'costschart',
  meta: {
    title: 'outsourcing',
    icon: 'personnel'
  },
  children: [
    {
      path: '/outsourcing/costschart',
      name: 'costschart',
      component: () => import('@/views/cost/costschart/index'),
      meta: {
        title: 'costschart',
        icon: 'personnel-manage'
      }
    }
  ]
}
