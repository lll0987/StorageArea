<template>
    <NCard title="货架" content-class="fill" class="fill" content-style="padding: 0;" :style="styles">
        <template #header-extra>
            <NButton text style="font-size: 18px" @click="showDimension = !showDimension">
                <NIcon><Dimensions /></NIcon>
            </NButton>
        </template>
        <div ref="dom" class="fill"></div>
    </NCard>
</template>

<script setup lang="ts">
import { onMounted, ref, watch, type Ref } from 'vue';
import { NButton, NCard, NIcon } from 'naive-ui';
import { Dimensions } from '@vicons/tabler';
import { Canvas } from '@antv/g';
import { Renderer } from '@antv/g-webgl';
import { Plugin } from '@antv/g-plugin-yoga';
import type { TItem } from '@/types';
import { getBoundsSize } from '@/util';
import { useFrame } from './Frame';
import { useContent } from './Content';
import { useDimensions } from './Dimensions';

const props = defineProps<{ data: TItem }>();

const dom: Ref<HTMLDivElement | null> = ref(null);
const styles = ref({ width: '100%' });
const showDimension = ref(false);

const getMulti = (maxHeight: number) => {
    const { segments, height } = props.data;
    const max = maxHeight - 0;
    const topLayer = segments[segments.length - 1];
    const h = topLayer.locations.reduce((res, item, ind, arr) => {
        if (!item.box) return res;

        let { height } = item.box;

        if (item.verticalPK) {
            const location = arr.find(i => i.pk === item.verticalPK);
            if (!location?.box) return res;

            height += location.box.height;
        }

        res = Math.max(res, height - topLayer.spacing);
        return res;
    }, 0);
    return Math.floor(max / (height + h));
};

onMounted(async () => {
    const { width: w, height: h, depth: d, segments } = props.data;
    const padding = [20, 36];

    const contentHeight = Math.max(dom.value?.clientHeight ?? 0, 0);
    const multi = getMulti(contentHeight - padding[0]);

    const width = w * multi;
    const height = h * multi;
    const depth = d * multi;
    segments.forEach(segment => {
        segment.scaledLength = segment.length * multi;
        segment.scaledSpacing = segment.spacing * multi;
    });

    // 框架（竖向）
    const { frame, x: contentX } = useFrame({ width, height, depth });
    frame.setPosition(padding[1], 0);
    const contentWidth = getBoundsSize(frame).width + padding[1] * 2;

    // 库位（横向）
    const content = useContent({ width, height, depth, multi, segments });
    content.setPosition(padding[1] + contentX, 0);

    // 尺寸标注
    const { dimension, showOrHidden } = useDimensions(
        [contentWidth, contentHeight],
        [w, h, d],
        [width, height, depth],
        segments,
        [padding[1], padding[1] + contentX]
    );
    dimension.setPosition(0, 0);
    watch(showDimension, showOrHidden);

    // 宽度跟随内容
    styles.value.width = `${contentWidth}px`;

    const renderer = new Renderer();
    // renderer.registerPlugin(new Plugin());
    const canvas = new Canvas({
        container: dom.value || undefined,
        width: contentWidth,
        height: contentHeight,
        renderer
    });
    window.__g_instances__ = [canvas];
    await canvas.ready;
    [frame, content, dimension].forEach(child => {
        canvas.appendChild(child);
    });
});
</script>

<style>
.fill {
    height: 100%;
}
</style>
