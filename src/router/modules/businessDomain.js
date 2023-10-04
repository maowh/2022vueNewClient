import layout from '@/layout'

export default {
  path: '/basics',
  component: layout,
  redirect: '/basics/manage',
  name: 'businessDomainList',
  meta: {
    title: 'basics',
    icon: 'personnel'
  },
  children: [
    {
      path: '/basics/businessDomain',
      name: 'businessDomain',
      component: () => import('@/views/cost/businessDomain/index'),
      meta: {
        title: 'businessDomainList',
        icon: 'personnel-manage'
      }
    }
  ]
}
