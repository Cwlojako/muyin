import Vue from 'vue'
import Router from 'vue-router'
import ElementUI from 'element-ui'
import login from './login'
import user from  './user.js'
import baby from "./baby"
import manager from './manager'
import role from './role'
import advice from './advice'
import log from './log'
import version from './version'
import timeZone from "./timeZone"
import pointRule from "./pointRule"
import vaccin from "./vaccin"
import equipment from "./equipment"
import goods from "./goods"
import goodsCategory from './goodsCategory'
import brand from "./brand"
import feedLevel from "./feedLevel"
import evaluate from "./evaluate"
import hotSearch from "./hotSearch"
import sensitiveWord from "./sensitiveWord"
import help from './help'
import information from './information'
import notification from './notification'
import finance from "./finance"
import article from './article'
import order from './order'
import deliver from './deliver'
import logistics from './logistics'
import discount from './discount'
import afterSale from './afterSale'
import advertisement from './advertisement'

Vue.use(Router);
Vue.use(ElementUI);

let routeList = [
  login.routes,
  user.routes,
  baby.routes,
  manager.routes,
  role.routes,
  advice.routes,
  log.routes,
  version.routes,
  timeZone.routes,
  pointRule.routes,
  vaccin.routes,
  notification.routes,
  equipment.routes,
  finance.routes,
  goods.routes,
  goodsCategory.routes,
  brand.routes,
  feedLevel.routes,
  evaluate.routes,
  hotSearch.routes,
  sensitiveWord.routes,
  help.routes,
  information.routes,
  article.routes,
  order.routes,
  deliver.routes,
  logistics.routes,
  discount.routes,
  afterSale.routes,
  advertisement.routes
];

let routes = [];

//拼接路由
routeList.map(s => {
  routes = routes.concat(s);
});

const router = new Router({
  routes: routes
});

router.beforeEach((to,from,next) => {
  const loading = ElementUI.Loading.service({
    lock: true,
    text: '加载中',
    spinner: 'el-icon-loading',
    background: 'rgba(0, 0, 0, 0.7)'
  });

  next();
});

router.afterEach(route => {
  const loading = ElementUI.Loading.service({
    lock: true,
    text: '加载中',
    spinner: 'el-icon-loading',
    background: 'rgba(0, 0, 0, 0.7)'
  });
  //将滚动条恢复到最顶端
  window.scrollTo(0, 0);
  setTimeout(() => {
     loading.close();
  },200);

});

export default router;
