<template>
  <div id="page-wrap" v-if="product">
    <div id="img-wrap">
      <img v-bind:src="product.imageUrl" />
    </div>
    <div id="product-details">
      <h1>{{ product.name }}</h1>
      <h3 id="price">${{ product.price }}</h3>
      <p>Average rating: {{ product.averageRating }}</p>
      <button
        id="add-to-cart"
        v-if="!itemIsInCart && !showSuccessMessage"
        v-on:click="addToCart"
      >
        Add to Cart
      </button>
      <button
        id="add-to-cart"
        class="green-button"
        v-if="!itemIsInCart && showSuccessMessage"
      >
        Successfully added item to cart!
      </button>
      <button id="add-to-cart" class="gray-button" v-if="itemIsInCart">
        Item Already in Cart!
      </button>
      <h4>Description</h4>
      <p>{{ product.description }}</p>
    </div>
  </div>
  <NotFoundPage v-else />
</template>

<script>
import axios from "axios";
import NotFoundPage from "./NotFoundPage";
export default {
  name: "ProductDetailPage",
  component: { NotFoundPage },
  data() {
    return {
      product: {},
      cartItems: [],
      showSuccessMessage: false,
    };
  },
  async created() {
    const result = await axios.get(`/api/products/${this.$route.params.id}`);
    this.product = result.data[0];

    const cartData = await axios.get(`/api/users/12345/cart`);
    console.log(cartData.data.cartItems);
    this.cartItems = cartData.data.cartItems;
  },

  computed: {
    itemIsInCart() {
      return this.cartItems.some((item) => item.id === this.product.id);
    },
  },
  methods: {
    async addToCart() {
      await axios.post(`/api/users/12345/cart`, { product: this.product });
      this.showSuccessMessage = true;
      setTimeout(() => {
        this.$router.push("/product");
      }, 1500);
    },
  },
};
</script>

<style scoped>
#page-wrap {
  margin-top: 16px;
  padding: 16px;
  max-width: 600px;
}

#img-wrap {
  text-align: center;
}

img {
  width: 400px;
}

#product-details {
  padding: 16px;
  position: relative;
}

#add-to-cart {
  width: 100%;
}

#price {
  position: absolute;
  top: 24px;
  right: 16px;
}
.green-button {
  background-color: green;
}
.gray-button {
  background-color: gray;
}
</style>
