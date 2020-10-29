export default [
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      {
        path: '/user',
        redirect: '/user/login',
      },
      {
        path: '/user/login',
        component: './user/login',
      }
    ],
  },
  {
    path: '/',
    component: '../layouts/SecurityLayout',
    routes: [
      {
        path: '/',
        component: '../layouts/BasicLayout',
        authority: ['admin'],
        routes: [
          //业务员
          {
            path: '/salesman',
            name: 'salesman',
            icon: 'dashboard',
            routes: [
              {
                name: 'report',
                icon: '',
                path: '/salesman/report',
                component: './salesman/report',
              },
              {
                path: '/salesman/report/edit',
                component: './salesman/report/edit',
              },
              {
                name: 'mission-list',
                icon: '',
                path: '/salesman/mission-list',
                component: './salesman/mission-list',
              },
              {
                path: '/salesman/mission-list/edit',
                component: './salesman/mission-list/edit',
              },
              {
                name: 'revenue-forecast',
                icon: '',
                path: '/salesman/revenue-forecast',
                component: './salesman/revenue-forecast',
              },
              {
                name: 'revenue-settlement',
                icon: '',
                path: '/salesman/revenue-settlement',
                component: './salesman/revenue-settlement'
              },
              {
                path: '/salesman/revenue-settlement/edit',
                component: './salesman/revenue-settlement/edit'
              },
              {
                name: 'invoice',
                icon: '',
                path: '/salesman/invoice',
                component: './salesman/invoice'
              },
              {
                path: '/salesman/invoice/edit',
                component: './salesman/invoice/edit',
              },
              {
                name: 'contract',
                icon: '',
                path: '/salesman/contract',
                component: './salesman/contract'
              },
              {
                path: '/salesman/contract/edit',
                component: './salesman/contract/edit',
              }
            ]
          },
          //业务内勤
          {
            path: '/ActivityManage',
            name: 'activity-manage',
            icon: 'dashboard',
            routes: [
              {
                name: 'activity-reservation',
                icon: '',
                path: '/ActivityManage/activity-reservation',
                component: './ActivityManage/activity-reservation'
              },
              {
                name: 'take-over',
                icon: '',
                path: '/ActivityManage/take-over',
                component: './ActivityManage/take-over'
              },
              {
                name: 'revenue-estimate',
                icon: '',
                path: '/ActivityManage/revenue-estimate',
                component: './ActivityManage/revenue-estimate'
              },
              {
                name: 'business-config',
                icon: '',
                path: '/ActivityManage/business-config',
                component: './ActivityManage/business-config'
              },
              {
                path: '/ActivityManage/business-config/add',
                component: './ActivityManage/business-config/add'
              },
              {
                name: 'marketing-settlement',
                icon: '',
                path: '/ActivityManage/marketing-settlement',
                component: './ActivityManage/marketing-settlement'
              },
              {
                name: 'activity-type',
                icon: '',
                path: '/ActivityManage/activity-type',
                component: './ActivityManage/activity-type'
              },
              {
                path: '/ActivityManage/activity-type/add',
                component: './ActivityManage/activity-type/add'
              }
            ]
          },
          //营销部长
          {
            path: '/MarketingMinister',
            name: 'marketing-minister',
            icon: 'dashboard',
            routes: [
              {
                name: 'marketing-budget',
                icon: '',
                path: '/MarketingMinister/marketing-budget',
                component: './MarketingMinister/marketing-budget'
              },
              {
                name: 'marketing-settlement',
                icon: '',
                path: '/MarketingMinister/marketing-settlement',
                component: './MarketingMinister/marketing-settlement',
              },
              {
                name: 'contract-initiation',
                icon: '',
                path: '/MarketingMinister/contract-initiation',
                component: './MarketingMinister/contract-initiation',
              },
              {
                name: 'take-over',
                icon: '',
                path: '/MarketingMinister/take-over',
                component: './MarketingMinister/take-over',
              },
              {
                name: 'contract-review',
                icon: '',
                path: '/MarketingMinister/contract-review',
                component: './MarketingMinister/contract-review',
              },
              {
                name: 'business-summary',
                icon: '',
                path: '/MarketingMinister/business-summary',
                component: './MarketingMinister/business-summary'
              },
              {
                name: 'salary-summary',
                icon: '',
                path: '/MarketingMinister/salary-summary',
                component: './MarketingMinister/salary-summary'
              },

            ]
          },
          //执行部长
          {
            path: '/ExecutiveMinister',
            name: 'executive-minister',
            icon: 'dashboard',
            routes: [
              {
                name: 'activity-allocation',
                icon: '',
                path: '/ExecutiveMinister/activity-allocation',
                component: './ExecutiveMinister/activity-allocation',
              },
              {
                path: '/ExecutiveMinister/cost-budget/add',
                component: './ExecutiveMinister/cost-budget/add',
              },
              {
                name: 'cost-budget',
                icon: '',
                path: '/ExecutiveMinister/cost-budget',
                component: './ExecutiveMinister/cost-budget',
              },
              {
                name: 'business-operations',
                icon: '',
                path: '/ExecutiveMinister/business-operations',
                component: './ExecutiveMinister/business-operations',
              },
              {
                name: 'revenue-settlement',
                icon: '',
                path: '/ExecutiveMinister/revenue-settlement',
                component: './ExecutiveMinister/revenue-settlement',
              },
              {
                name: 'distribution',
                icon: '',
                path: '/ExecutiveMinister/distribution',
                component: './ExecutiveMinister/distribution',
              },
              {
                path: '/ExecutiveMinister/distribution/modify',
                component: './ExecutiveMinister/distribution/modify'
              },
              {
                name: 'business-summary',
                icon: '',
                path: '/ExecutiveMinister/business-summary',
                component: './ExecutiveMinister/business-summary',
              },
              {
                name: 'salary-summary',
                icon: '',
                path: '/ExecutiveMinister/salary-summary',
                component: './ExecutiveMinister/salary-summary',
              },
            ]
          },
          //后勤部长
          {
            path: '/LogisticsMinister',
            name: 'logistics-minister',
            icon: 'dashboard',
            routes: [
              {
                name: 'business-cost',
                icon: '',
                path: '/LogisticsMinister/business-cost',
                component: './LogisticsMinister/business-cost'
              },
              {
                name: 'cost-budget',
                icon: '',
                path: '/LogisticsMinister/cost-budget',
                component: './LogisticsMinister/cost-budget'
              }
            ]
          },
          //基地分管领导
          {
            path: '/ChargeLeadership',
            name: 'charge-leadership',
            icon: 'dashboard',
            routes: [
              {
                name: 'business-commission',
                icon: '',
                path: '/ChargeLeadership/charge-business-commission',
                component: './ChargeLeadership/charge-business-commission'
              },
              {
                name: 'contract-review',
                icon: '',
                path: '/ChargeLeadership/charge-contract-review',
                component: './ChargeLeadership/charge-contract-review'
              },
              {
                name: 'staff-profile',
                icon: '',
                path: '/ChargeLeadership/charge-staff-profile',
                component: './ChargeLeadership/charge-staff-profile'
              },
              {
                name: 'business-summary',
                icon: '',
                path: '/ChargeLeadership/business-summary',
                component: './ChargeLeadership/business-summary'
              },
              {
                name: 'salary-summary',
                icon: '',
                path: '/ChargeLeadership/salary-summary',
                component: './ChargeLeadership/salary-summary'
              },
              {
                name: 'order-terminate',
                icon: '',
                path: '/ChargeLeadership/order-terminate',
                component: './ChargeLeadership/order-terminate',
              }
            ]
          },
          //基地领导
          {
            path: '/leadership',
            name: 'leadership',
            icon: 'dashboard',
            routes: [
              {
                name: 'business-commission',
                icon: '',
                path: '/leadership/business-commission',
                component: './leadership/business-commission'
              },
              {
                name: 'contract-review',
                icon: '',
                path: '/leadership/contract-review',
                component: './leadership/contract-review'
              },
              {
                name: 'staff-profile',
                icon: '',
                path: '/leadership/staff-profile',
                component: './leadership/staff-profile'
              },
              {
                name: 'business-summary',
                icon: '',
                path: '/leadership/business-summary',
                component: './leadership/business-summary'
              },
              {
                name: 'salary-summary',
                icon: '',
                path: '/leadership/salary-summary',
                component: './leadership/salary-summary'
              }
            ]
          },
          //综合部
          {
            path: '/GeneralDepartment',
            name: 'general-department',
            icon: 'dashboard',
            routes: [
              {
                name: 'contract-initiation',
                icon: '',
                path: '/GeneralDepartment/contract-initiation',
                component: './GeneralDepartment/contract-initiation',
              },{
                name: 'employee-pool',
                icon: '',
                path: '/GeneralDepartment/employee-pool',
                component: './GeneralDepartment/employee-pool'
              },{
                path: '/GeneralDepartment/employee-pool/add',
                component: './GeneralDepartment/employee-pool/add',
              },{
                name: 'salesman-summary',
                icon: '',
                path: '/GeneralDepartment/salesman-summary',
                component: './GeneralDepartment/salesman-summary',
              },{
                name: 'salary-summary',
                icon: '',
                path: '/GeneralDepartment/salary-summary',
                component: './GeneralDepartment/salary-summary',
              }
            ]
          },
          //财务
          {
            path: '/finance',
            name: 'finance',
            icon: 'dashboard',
            routes: [
              {
                name: 'invoicing-application',
                icon: '',
                path: '/finance/invoicing',
                component: './finance/invoicing'
              }
            ]
          },
          {
            component: './404',
          },
        ],
      },
      {
        component: './404',
      },
    ],
  },
  {
    component: './404',
  }
]
