<template>
  <div id="page-wrap">
    <ProductGrid :products="products" />
  </div>
</template>

<script>
import axios from "axios";
import ProductGrid from "../components/ProductGrid.vue";

export default {
  name: "ProductPage",
  components: {
    ProductGrid,
  },
  data() {
    return {
      products: [],
    };
  },

  async created() {
    const result = await axios.get("/api/products");
    this.products = result.data;
  },
};
</script>