import layout from '@/layout'

export default {
  path: '/personnelManage',
  component: layout,
  redirect: '/personnelManage/personnel',
  name: 'personnel',
  meta: {
    title: 'personnelManage',
    icon: 'personnel'
  },
  children: [
    {
      path: '/personnelManage/personnel',
      name: 'personnel',
      component: () => import('@/views/cost/personnel/index'),
      meta: {
        title: 'personnel',
        icon: 'personnel-manage'
      }
    },
    {
      path: '/personnelManage/personnelDetail/:id',
      name: 'personnelDetail',
      component: () =>
        import('@/views/cost/personnel/components/personnelDetail'),
      props: true,
      meta: {
        title: 'personnelDetail'
      }
    },
    {
      path: '/personnelManage/personnelCreateEdit/:id',
      name: 'personnelEdit',
      component: () =>
        import('@/views/cost/personnel/components/personnelCreateEdit'),
      props: true,
      meta: {
        title: 'personnelEdit'
      }
    },
    {
      path: '/personnelManage/personnelCreate',
      name: 'personnelCreate',
      component: () =>
        import('@/views/cost/personnel/components/personnelCreateEdit'),
      props: true,
      meta: {
        title: 'personnelCreate'
      }
    }
  ]
}
