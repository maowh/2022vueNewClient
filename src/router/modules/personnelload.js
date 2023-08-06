import layout from '@/layout'

export default {
  path: '/personnelManage',
  component: layout,
  redirect: '/personnelManage/personnel',
  name: 'personnelload',
  meta: {
    title: 'personnelManage',
    icon: 'personnel'
  },
  children: [
    {
      path: '/personnelManage/personnelload',
      name: 'personnelload',
      component: () => import('@/views/cost/personnelload/index'),
      meta: {
        title: 'personnelload',
        icon: 'personnel-manage'
      }
    },
    {
      path: '/personnelManage/personnelloadInfo/:id',
      name: 'personnelloadInfo',
      component: () =>
        import('@/views/cost/personnelload/components/personnelloadDetail'),
      props: true,
      meta: {
        title: 'personnelloadInfo'
      }
    },
    {
      path: '/personnelManage/personnelloadEdit/:id',
      name: 'personnelloadEdit',
      component: () =>
        import('@/views/cost/personnelload/components/personnelloadCreateEdit'),
      props: true,
      meta: {
        title: 'personnelloadEdit'
      }
    },
    {
      path: '/personnelManage/personnelloadCreate',
      name: 'personnelloadCreate',
      component: () =>
        import('@/views/cost/personnelload/components/personnelloadCreateEdit'),
      props: true,
      meta: {
        title: 'personnelloadCreate'
      }
    }
  ]
}
