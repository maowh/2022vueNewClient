// 数据对应表
export const USER_RELATIONS = {
  姓名: 'name',
  系统名称: 'SystemName',
  客户名称: 'customer',
  年份: 'year',
  月份: 'month',
  系统负荷系数: 'load',
  系统计算负荷金额: 'operationAmount'
}

// 工程师标准对应表
export const ListDisplay = [
  {
    prop: 'systemEngineer',
    label: '系统工程师'
  },
  {
    prop: 'seniorSystemEngineer',
    label: '高级系统工程师'
  },
  {
    prop: 'softwareEngineer',
    label: '软件工程师'
  },
  {
    prop: 'seniorSoftwareEngineer',
    label: '高级软件工程师'
  },
  {
    prop: 'intermediateSap',
    label: '中级SAP'
  },
  {
    prop: 'dbaEngineer',
    label: '高级SAP'
  },
  {
    prop: 'dbaEngineer',
    label: 'DBA'
  },
  {
    prop: 'seniorDbaEngineer',
    label: '高级DBA'
  }
]

// 运维&开发选择
export const lcategorySelect = [
  { value: 'operation', label: '运维' },
  { value: 'developAmount', label: '开发' },
  { value: 'operationDevelopAmount', label: '运维&研发' }
]

// 自定义分类查询选择
export const listSelect = [
  { value: 'customer', label: '客户名称' },
  { value: 'SystemName', label: '系统名称' },
  { value: 'businessDivision', label: '事业部' },
  { value: 'businessLines', label: '业务线' },
  { value: 'domain', label: '领域' },
  { value: 'business', label: '业务域' }
]
