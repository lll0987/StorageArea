<template>
    <NCard title="货架" content-class="fill" class="fill" :style="styles">
        <template #header-extra>
            <NButton text style="font-size: 18px">
                <NIcon><Dimensions /></NIcon>
            </NButton>
        </template>
        <div ref="dom" class="fill"></div>
    </NCard>
</template>

<script setup lang="ts">
import { onMounted, ref, type Ref } from 'vue';
import { NButton, NCard, NIcon } from 'naive-ui';
import { Dimensions } from '@vicons/tabler';
import { Canvas, Group } from '@antv/g';
import { Renderer } from '@antv/g-webgl';
import { Plugin } from '@antv/g-plugin-yoga';
import type { TBox, TItem } from '@/types';
import { boxes } from '@/components/Main/data';
import { useArea } from '@/packages/Area';
import { useLayer } from '@/packages/Layer';

const props = defineProps<{ data: TItem }>();

const dom: Ref<HTMLDivElement | null> = ref(null);

const styles = ref({ width: '100%' });

const getBox = (id: string) => boxes.find(box => box.id === id) || ({} as TBox);

const getMulti = (domHeight: number) => {
    const { segments, height } = props.data;
    const max = domHeight - 0;
    const topLayer = segments[segments.length - 1];
    const h = topLayer.locations.reduce((res, item, ind, arr) => {
        if (!item.box) return res;

        let height = getBox(item.box).height || 0;

        if (item.verticalPK) {
            const location = arr.find(i => i.pk === item.verticalPK);
            if (!location?.box) return res;

            height += getBox(location.box).height || 0;
        }

        res = Math.max(res, height - topLayer.spacing);
        return res;
    }, 0);
    return Math.floor(max / (height + h));
};

onMounted(async () => {
    const domHeight = Math.max(dom.value?.clientHeight ?? 0 - 20, 0);
    const multi = getMulti(domHeight);

    const width = props.data.width * multi;
    const height = props.data.height * multi;
    const depth = props.data.depth * multi;

    const group = new Group();

    // 框架（竖向）
    const diameter = 12;
    const innerSize = { width, height, depth };
    const outerSize = {
        width: width + diameter * 2,
        height: height + diameter * 2,
        depth: depth + diameter * 2
    };
    group.appendChild(useArea({ innerSize, outerSize }));

    // 库位（横向）
    const boxMap = props.data.segments.reduce((res, next) => {
        for (const location of next.locations) {
            if (!location.box || res[location.box]) continue;
            const box = getBox(location.box);
            res[location.box] = {
                ...box,
                width: multi * (box.width || 0),
                height: multi * (box.height || 0),
                depth: multi * (box.depth || 0)
            };
        }
        return res;
    }, {} as Record<string, TBox>);
    let pos = height;
    props.data.segments.forEach(segment => {
        const iheight = segment.height * multi;
        const ispacing = segment.spacing * multi;
        pos = pos - iheight - ispacing;
        const layer = useLayer({
            width,
            height: iheight,
            depth,
            spacing: ispacing,
            locations: segment.locations.map(location => ({
                ...location,
                box: location.box ? boxMap[location.box] : undefined
            }))
        });
        layer.setPosition(diameter, pos, 0);
        group.appendChild(layer);
    });

    styles.value.width = `${outerSize.width + 24 * 2}px`;

    const renderer = new Renderer();
    // renderer.registerPlugin(new Plugin());
    const canvas = new Canvas({
        container: dom.value || undefined,
        width: outerSize.width,
        height: domHeight,
        renderer
    });
    await canvas.ready;
    canvas.appendChild(group);
});
</script>

<style>
.fill {
    height: 100%;
}
</style>
