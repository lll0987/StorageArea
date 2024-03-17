<template>
    <div class="main">
        <Item v-for="item in items" :data="item" class="item"></Item>
    </div>
</template>

<script setup lang="ts">
import type { TBox } from '@/types';
import Item from '../Item/index.vue';
import { boxes, data } from './data';

const getBox = (id: string) => boxes.find(box => box.id === id) || ({ width: 0, height: 0, depth: 0 } as TBox);

const items = data.map(({ segments: ss, ...item }) => {
    const segments = ss.map(({ locations: ls, ...segment }) => {
        const locations = ls.map(({ box: id, ...location }) => {
            const box = id ? getBox(id) : undefined;
            return { ...location, box };
        });
        return { ...segment, locations };
    });
    return { ...item, segments };
});
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
