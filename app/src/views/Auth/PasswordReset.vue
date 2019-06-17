<template>
     <div class="mt-32">
        <password-reset :email="email" :hash="hash"/>
    </div>
</template>

<script>

export default {
  name: "password_reset",
  data() {
    return {
      email: this.$route.params.email,
      hash: this.$route.params.hash
    }
  }
};
</script>