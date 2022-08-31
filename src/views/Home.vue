<template>
  <Card>
    <template #title>Title</template>
    <template #content>Content</template>
  </Card>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "Home"
});
</script>

<style scoped>
.p-card {
  height: 100%;
  width: 100%;
}
</style>
