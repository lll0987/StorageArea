<template>
    <div :id="config.id"></div>
</template>

<script setup lang="ts">
import { onMounted, reactive } from 'vue';
import { Canvas, type IChildNode } from '@antv/g';
import { Renderer } from '@antv/g-canvas';
import { Plugin } from '@antv/g-plugin-yoga';
import { data } from './data';
import { useItem } from './item';

const config = reactive({ id: 'container' });

onMounted(() => {
    const docWidth = document?.documentElement?.clientWidth ?? 1000;
    const docHeight = document?.documentElement?.clientHeight ?? 700;
    const width = 1000;
    const height = 700;

    const renderer = new Renderer();
    // const plugin = new Plugin({});
    // renderer.registerPlugin(plugin);

    const canvas = new Canvas({ container: `${config.id}`, width, height, renderer });

    const appendToCanvas = async (children: IChildNode[]) => {
        await canvas.ready;
        children.forEach(child => {
            canvas.appendChild(child);
        });
    };

    appendToCanvas(data.map(item => useItem(item)));
});
</script>

<style scoped>
div {
    padding: 16px;
}
</style>
