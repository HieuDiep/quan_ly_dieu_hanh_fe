<template>
  <div class="comment-wrapper">
    <div
      v-for="comment in listDataComputed"
      :key="comment.id"
      class="each-comment mb-2"
    >
      <TicketComment :comment="comment" />
    </div>
  </div>
</template>

<script>
import TicketComment from '@/components/Comments/TicketComment';
export default {
  components: { TicketComment },
  props: {
    listData: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  computed: {
    listDataComputed() {
      const arr = [...this.listData];
      return arr ? arr : [];
    }
  }
};
</script>

<style lang="scss" scopped>
.comment-wrapper {
  padding-top: 16px;
  border-top: 1px solid #eaeaea;
}
</style>
