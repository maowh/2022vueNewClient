import layout from '@/layout'

export default {
  path: '/basics',
  component: layout,
  redirect: '/basics/manage',
  name: 'projectInfomationList',
  meta: {
    title: 'basics',
    icon: 'personnel'
  },
  children: [
    {
      path: '/basics/projectInfomation',
      name: 'projectInfomation',
      component: () => import('@/views/cost/project-information/index'),
      meta: {
        title: 'projectInfomationList',
        icon: 'personnel-manage'
      }
    },
    {
      path: '/basics/projectInfomationInfo/:id',
      name: 'projectInfomationInfo',
      component: () =>
        import('@/views/cost/project-information/components/projectDetail'),
      props: true,
      meta: {
        title: 'projectInfomationInfo'
      }
    },
    {
      path: '/basics/projectInfomationCreateEdit/:id',
      name: 'projectInfomationEdit',
      component: () =>
        import('@/views/cost/project-information/components/projectCreateEdit'),
      props: true,
      meta: {
        title: 'projectInfomationEdit'
      }
    },
    {
      path: '/basics/projectInfomationCreate',
      name: 'projectInfomationCreate',
      component: () =>
        import('@/views/cost/project-information/components/projectCreateEdit'),
      props: true,
      meta: {
        title: 'projectInfomationCreate'
      }
    }
  ]
}
