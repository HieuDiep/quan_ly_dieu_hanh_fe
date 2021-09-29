<template>
  <div :class="wrapperClass">
    <slot name="avatar"></slot>
  </div>
</template>

<script>
export default {
  props: {
    wrapperClass: {
      type: String,
      default: "",
    },
  },
};
</script>

<style></style>
