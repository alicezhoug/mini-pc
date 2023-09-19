<template>
  <div class="container">
    <div class="panel">
      <a-row :gutter="24" style="height: 100%">
        <a-col :span="12" style="height: 100%">
          <Channel />
        </a-col>
        <a-col :span="12" style="height: 100%">
          <ChannelProperties />
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import Channel from '@/views/video/channel/channel.vue';
  import ChannelProperties from '@/views/video/channel/channelProperties.vue';
</script>

<script lang="ts">
  export default {
    name: 'Channel',
  };
</script>

<style scoped>
  .container {
    height: 100%;
    padding: 16px 20px;
    padding-bottom: 0;
    background-color: var(--color-fill-2);
  }

  .panel {
    height: 100%;
    padding: 16px;
    background-color: var(--color-bg-2);
    border-radius: 4px;
  }
</style>
