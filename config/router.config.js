export default [
  // user
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      { path: '/user', redirect: '/user/login' },
      { path: '/user/login', component: './User/Login' },
    ],
  },
  // app
  {
    path: '/',
    component: '../layouts/BasicLayout',
    Routes: ['src/pages/Authorized'],
    authority: ['artorias'],
    routes: [
      // dashboard
      { path: '/', redirect: '/dashboard/welcome' },
      {
        path: '/dashboard',
        name: 'dashboard',
        icon: 'dashboard',
        routes: [
          {
            path: '/dashboard/welcome',
            name: 'welcome',
            component: './Dashboard/Welcome',
          },
        ],
      },
      // 用户管理
      {
        path: '/usermanage',
        icon: 'user',
        name: 'usermanage',
        routes: [
          {
            path: '/usermanage/userlist',
            name: 'userlist',
            component: './UserManage/UserList',
          }
        ],
      },
      // 文章管理
      {
        path: '/articlemanage',
        icon: 'file-text',
        name: 'articlemanage',
        routes: [
          {
            path: '/articlemanage/articlelist',
            name: 'articlelist',
            component: './ArticleManage/ArticleList',
          },
          {
            path: '/articlemanage/createarticle',
            name: 'createarticle',
            component: './ArticleManage/CreateArticle',
          }
        ],
      },
      // 分类管理
      {
        path: '/catemanage',
        icon: 'appstore',
        name: 'catemanage',
        routes: [
          {
            path: '/catemanage/catelist',
            name: 'catelist',
            component: './CateManage/CateList',
          }
        ],
      },
      // 标签管理
      {
        path: '/tagsmanage',
        icon: 'tags',
        name: 'tagsmanage',
        routes: [
          {
            path: '/tagsmanage/tagslist',
            name: 'tagslist',
            component: './TagsManage/TagsList',
          }
        ],
      },
      {
        component: '404',
      },
    ],
  },
];
