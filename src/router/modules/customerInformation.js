import layout from '@/layout'

export default {
  path: '/basics',
  component: layout,
  redirect: '/basics/manage',
  name: 'customerInformationList',
  meta: {
    title: 'basics',
    icon: 'personnel'
  },
  children: [
    {
      path: '/basics/customerInformation',
      name: 'customerInformation',
      component: () => import('@/views/cost/customer-information/index'),
      meta: {
        title: 'customerInformationList',
        icon: 'personnel-manage'
      }
    }
  ]
}
