import layout from '@/layout'

export default {
  path: '/personnelManage',
  component: layout,
  redirect: '/personnelManage/personnel',
  name: 'personnelmatrix',
  meta: {
    title: 'personnelManage',
    icon: 'personnel'
  },
  children: [
    {
      path: '/personnelManage/personnelmatrix',
      name: 'personnelmatrix',
      component: () => import('@/views/cost/personnelmatrix/index'),
      meta: {
        title: 'personnelmatrix',
        icon: 'personnel-manage'
      }
    },
    {
      path: '/personnelManage/personnelmatrixInfo/:id',
      name: 'personnelmatrixInfo',
      component: () =>
        import('@/views/cost/personnelmatrix/components/personnelmatrixDetail'),
      props: true,
      meta: {
        title: 'personnelmatrixInfo'
      }
    },
    {
      path: '/personnelManage/personnelmatrixEdit/:id',
      name: 'personnelmatrixEdit',
      component: () =>
        import(
          '@/views/cost/personnelmatrix/components/personnelmatrixCreateEdit'
        ),
      props: true,
      meta: {
        title: 'personnelmatrix'
      }
    },
    {
      path: '/personnelManage/personnelmatrixCreate',
      name: 'personnelmatrixCreate',
      component: () =>
        import(
          '@/views/cost/personnelmatrix/components/personnelmatrixCreateEdit'
        ),
      props: true,
      meta: {
        title: 'personnelmatrixCreate'
      }
    }
  ]
}
