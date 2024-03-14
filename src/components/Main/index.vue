<template>
    <div class="main">
        <Item v-for="item in data" :data="item" class="item"></Item>
    </div>
</template>

<script setup lang="ts">
import Item from '../Item/index.vue';
import { data } from './data';
</script>

<style scoped>
.main {
    height: 100vh;
    padding: 16px;
    box-sizing: border-box;
}
.item + .item {
    margin-left: 16px;
}
</style>
