import layout from '@/layout'

export default {
  path: '/basics',
  component: layout,
  redirect: '/basics/manage',
  name: 'domainInformationList',
  meta: {
    title: 'basics',
    icon: 'personnel'
  },
  children: [
    {
      path: '/basics/domainInformation',
      name: 'domainInformation',
      component: () => import('@/views/cost/domain-information/index'),
      meta: {
        title: 'domainInformationList',
        icon: 'personnel-manage'
      }
    }
  ]
}
