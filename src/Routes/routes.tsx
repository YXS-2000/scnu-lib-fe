import SignIn from '../Pages/Login/SignIn';
import SignUp from '../Pages/Login/SignUp';
import PageNotFound from '../Pages/PageNotFound';
import Activity from '../Pages/Reader/Activity/Activity';
import ActivityDetail from '../Pages/Reader/Activity/ActivityDetail';
import RegisteredAct from '../Pages/Reader/Activity/RegisteredAct';
import { isLogined, isadmin, getRoles } from '../Utils/auth';
import UserSetting from '../Pages/User/UserSetting';
import User from '../Pages/User/User';
import Notions from '../Pages/Reader/Activity/Notions';
import AdminAct from '../pages/Admin/AdminAct';
import AdminUser from '../pages/Admin/AdminUser';
import CreateAct from '../Pages/Admin/CreateAct';
import EditAct from '../Pages/Admin/EditAct';
import ListAct from '../pages/Admin/ListAct';
import { Roles } from '@/Utils/config';
// 主页路由
export const mainRoutes = [
  {
    path: '/login',
    component: SignIn,
  },
  {
    path: '/Signup',
    component: SignUp,
  },
  {
    path: '/404',
    component: PageNotFound,
  },
];
// 活动页路由
export const activityRoutes = [
  {
    path: '/home/activity',
    title: '活动页',
    component: Activity,
    exact: true,
    isShow: true,
  },
  {
    path: '/home/activitydetail/:id',
    title: '活动详情',
    component: ActivityDetail,
    exact: true,
    isShow: false,
  },
  {
    path: '/home/listact',
    title: '活动列表',
    isShow: !(getRoles() === Roles.admin) && !(getRoles() === Roles.librarian),
    exact: false,
  },
  {
    path: '/home/RegisteredAct',
    title: '已报名活动',
    component: RegisteredAct,
    exact: true,
    isShow: isLogined() && !(getRoles() === Roles.admin) && !(getRoles() === Roles.librarian), // 不是管理员才显示，管理员不能报名，只能浏览活动
  },
  {
    path: '/home/adminAct/listact',
    title: '活动管理',
    component: AdminAct,
    isShow: getRoles() === Roles.admin||getRoles() === Roles.librarian, // 管理员才显示
    exact: false,
  },
  {
    path: '/home/adminUser/user',
    title: '用户管理',
    component: AdminUser,
    isShow: getRoles() === Roles.admin||getRoles() === Roles.librarian, // 管理员才显示
    exact: false,
  },
  {
    path: '/home/user',
    component: User,
    isShow: false,
  },
];
// 活动管理路由
export const adminRoutes = [
  {
    path: '/home/adminAct/createact',
    exact: false,
    isShow:getRoles() === Roles.admin||getRoles() === Roles.librarian,
    title: '创建活动',
    component: CreateAct,
  },
  {
    path: '/home/adminAct/listact',
    exact: true,
    isShow:getRoles() === Roles.admin||getRoles() === Roles.librarian,
    title: '活动列表',
    component: ListAct,
  },
];
// 用户管理路由
export const adminUserRoutes = [
  {
    path: '/home/adminUser/user',
    exact: false,
    isShow:getRoles() === Roles.admin,
    title: '用户管理',
    component: CreateAct,
  }
];
