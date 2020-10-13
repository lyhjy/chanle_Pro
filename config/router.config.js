export default [
  // {
  //   path: '/user',
  //   component: '../layouts/UserLayout',
  //   routes: [
  //     {
  //       name: 'login',
  //       path: '/user/login',
  //       component: './user/login',
  //     },
  //   ],MarketingMinister
  // },
  {
    path: '/',
    // component: '../layouts/SecurityLayout',
    routes: [
      {
        path: '/',
        component: '../layouts/BasicLayout',
        authority: ['admin', 'user'],
        routes: [
          {
            path: '/',
            redirect: '/',
          },
          {
            path: '/finance',
            name: 'finance',
            icon: 'dashboard',
            authority: ['j','a'],
            routes: [
              {
                name: 'invoicing-application',
                icon: '',
                path: '/finance/invoicing',
                component: './finance/invoicing'
              }
            ]
          },
          // {
          //   path: '/GroupMember',
          //   name: 'group-member',
          //   icon: 'dashboard',
          //   authority: ['a'],
          //   routes: [
          //     {
          //       name: 'business-operations',
          //       icon: '',
          //       path: '/GroupMember/business',
          //       component: './GroupMember/business'
          //     },
          //     {
          //       name: 'business-feedback',
          //       icon: '',
          //       path: '/GroupMember/feedback-form',
          //       component: './GroupMember/feedback-form'
          //     }
          //   ]
          // },
          {
            path: '/LogisticsMinister',
            name: 'logistics-minister',
            icon: 'dashboard',
            authority: ['h','a'],
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
          {
            path: '/ActivityManage',
            name: 'activity-manage',
            icon: 'dashboard',
            authority: ['e','a'],
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
          {
            path: '/leadership',
            name: 'leadership',
            icon: 'dashboard',
            authority: ['a'],
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
          {
            path: '/ChargeLeadership',
            name: 'charge-leadership',
            icon: 'dashboard',
            authority: ['a'],
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
              }
            ]
          },
          {
            path: '/MarketingMinister',
            name: 'marketing-minister',
            icon: 'dashboard',
            authority: ['d','a'],
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
          {
            path: '/ExecutiveMinister',
            name: 'executive-minister',
            icon: 'dashboard',
            authority: ['c','a'],
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
              }
            ]
          },
          {
            path: '/GeneralDepartment',
            name: 'general-department',
            icon: 'dashboard',
            authority: ['b','a'],
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
          // {
          //   path: '/welcome',
          //   name: 'welcome',
          //   icon: 'smile',
          //   component: './Welcome',
          // },
          // {
          //   path: '/admin',
          //   name: 'admin',
          //   icon: 'crown',
          //   component: './Admin',
          //   authority: ['admin'],
          //   routes: [
          //     {
          //       path: '/admin/sub-page',
          //       name: 'sub-page',
          //       icon: 'smile',
          //       component: './Welcome',
          //       authority: ['admin'],
          //     },
          //   ],
          // },
          // {
          //   name: 'list.table-list',
          //   icon: 'table',
          //   path: '/list',
          //   component: './ListTableList',
          // },
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
