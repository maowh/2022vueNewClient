import layout from '@/layout'

export default {
  path: '/basics',
  component: layout,
  redirect: '/basics/manage',
  name: 'systemInfomationList',
  meta: {
    title: 'basics',
    icon: 'personnel'
  },
  children: [
    {
      path: '/basics/systemInfomation',
      name: 'systemInfomation',
      component: () => import('@/views/cost/system-information/index'),
      meta: {
        title: 'systemInfomationList',
        icon: 'personnel-manage'
      }
    },
    {
      path: '/basics/systemInfomationInfo/:id',
      name: 'systemInfomationInfo',
      component: () =>
        import(
          '@/views/cost/system-information/components/systemInfomationDetail'
        ),
      props: true,
      meta: {
        title: 'systemInfomationInfo'
      }
    },
    {
      path: '/basics/systemInfomationCreateEdit/:id',
      name: 'systemInfomationEdit',
      component: () =>
        import(
          '@/views/cost/system-information/components/systemInfomationCreateEdit'
        ),
      props: true,
      meta: {
        title: 'systemInfomationEdit'
      }
    },
    {
      path: '/basics/systemInfomationCreate',
      name: 'systemInfomationCreate',
      component: () =>
        import(
          '@/views/cost/system-information/components/systemInfomationCreateEdit'
        ),
      props: true,
      meta: {
        title: 'systemInfomationCreate'
      }
    }
  ]
}
