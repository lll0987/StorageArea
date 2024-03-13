<template>
    <div :id="config.id"></div>
</template>

<script setup lang="ts">
import { onMounted, reactive } from 'vue';
import { Canvas, type IChildNode } from '@antv/g';
import { Renderer } from '@antv/g-webgl';
import { Plugin } from '@antv/g-plugin-yoga';
import { data } from './data';
import { useItem } from '@/packages/Item';

const config = reactive({ id: 'container', width: 0, height: 0 });

onMounted(() => {
    const docWidth = document?.documentElement?.clientWidth ?? 1000;
    const docHeight = document?.documentElement?.clientHeight ?? 700;
    config.width = docWidth - 32 - 10;
    config.height = docHeight - 32 - 10;

    const renderer = new Renderer();
    // renderer.registerPlugin(new Plugin());

    const canvas = new Canvas({ container: `${config.id}`, width: config.width, height: config.height, renderer });

    const appendToCanvas = async (children: IChildNode[]) => {
        await canvas.ready;
        children.forEach(child => {
            canvas.appendChild(child);
        });
    };

    appendToCanvas(data.map(item => useItem(item, config)));
});
</script>

<style scoped>
div {
    padding: 16px;
}
</style>
