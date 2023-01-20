import layout from '@/layout'

export default {
  path: '/basics',
  component: layout,
  redirect: '/basics/manage',
  name: 'coefficientInformationList',
  meta: {
    title: 'basics',
    icon: 'personnel'
  },
  children: [
    {
      path: '/basics/coefficientInformation',
      name: 'coefficientInformation',
      component: () => import('@/views/cost/coefficient-information/index'),
      meta: {
        title: 'coefficientInformationList',
        icon: 'personnel-manage'
      }
    },
    {
      path: '/basics/coefficientInformationInfo/:id',
      name: 'coefficientInformationInfo',
      component: () =>
        import(
          '@/views/cost/coefficient-information/components/coefficientInformationDetail'
        ),
      props: true,
      meta: {
        title: 'coefficientInformationInfo'
      }
    },
    {
      path: '/basics/coefficientInformationCreateEdit/:id',
      name: 'coefficientInformationEdit',
      component: () =>
        import(
          '@/views/cost/coefficient-information/components/coefficientInformationCreateEdit'
        ),
      props: true,
      meta: {
        title: 'coefficientInformationEdit'
      }
    },
    {
      path: '/basics/coefficientInformationCreate',
      name: 'coefficientInformationCreate',
      component: () =>
        import(
          '@/views/cost/coefficient-information/components/coefficientInformationCreateEdit'
        ),
      props: true,
      meta: {
        title: 'coefficientInformationCreate'
      }
    }
  ]
}
