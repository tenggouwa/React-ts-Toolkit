import UmbrellaUserList from '@/pages/management/umbrella/user_list';
import UmbrellaContractVol from '@/pages/management/umbrella/contract_vol';
import UmbrellaAccSummary from  '@/pages/management/umbrella/acc_summary';
import UmbrellaContractNetPosition from '@/pages/management/umbrella/contract_net_position'

import ContractVol from '@/pages/management/contract/vol';

import PermissionUser from '@/pages/management/permission/user';
import PermissionRole from '@/pages/management/permission/role';

import PartnerTeam from '@/pages/management/partner/team';
import PartnerCommission from '@/pages/management/partner/commission';

// 存储 路由以及 组件对应关系 在外部筛选

export const ROUTE_LIST = [
  {
    key: 'umbrella/user_list',
    component: UmbrellaUserList,
  },
  {
    key: 'umbrella/contract_vol',
    component: UmbrellaContractVol,
  },
  {
    key: 'umbrella/acc_summary',
    component: UmbrellaAccSummary,
  },
  {
    key: 'umbrella/contract_net_position',
    component: UmbrellaContractNetPosition,
  },
  {
    key: 'contract/vol',
    component: ContractVol,
  },
  {
    key: 'permission/user',
    component: PermissionUser,
  },
  {
    key: 'permission/role',
    component: PermissionRole,
  },
  {
    key: 'partner/team',
    component: PartnerTeam,
  },
  {
    key: 'partner/commission',
    component: PartnerCommission,
  }
]
