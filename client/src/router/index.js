import Vue from "vue";
import VueRouter from "vue-router";
import CartPage from "../views/CartPage.vue";
import ProductDetail from "../views/ProductDetail.vue";
import Product from "../views/Product.vue";
import NotFoundPage from "../views/NotFoundPage.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/product",
    name: "Product",
    component: Product,
  },
  {
    path: "/product/:id",
    name: "ProductDetail",
    component: ProductDetail,
  },
  {
    path: "/cart",
    name: "Cart",
    component: CartPage,
  },
  {
    path: "/",
    redirect: "/product",
  },
  {
    path: "*",
    component: NotFoundPage,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
