import Vue from 'vue'
import Router from 'vue-router'

// load page component
import OrderPage from '@/components/main/order'
import CommentPage from '@/components/main/comment'
import SellerPage from '@/components/main/seller'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/order'
    },
    {
      path: '/order',
      name: 'order',
      component: OrderPage
    },
    {
      path: '/comment',
      name: 'comment',
      component: CommentPage
    },
    {
      path: '/seller',
      name: 'seller',
      component: SellerPage
    }
  ],
  linkActiveClass: 'active',
  mode: 'history'
})
