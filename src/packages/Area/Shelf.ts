import { computed, ref } from 'vue';
import { Group } from '@antv/g';
import type { TShelf } from '@/types';
import { ShelfType } from '@/enums';
import { useCube, useCylinder } from '../Shape';

export const useShelf = (config: TShelf) => {
    const type = ref(config.type || ShelfType.cylinder);
    const isSurface = computed(() => type.value === ShelfType.Surface);
    const shelf = new Group();

    const dw = computed(() => (config.outerSize.width - config.innerSize.width) / 2);
    const dp = computed(() => (config.outerSize.depth - config.innerSize.depth) / 2);
    const xr = computed(() => dw.value + config.innerSize.width);
    const z = computed(() => -(dp.value + config.innerSize.depth));

    if (isSurface.value) {
        const { shape: left } = useCube({
            width: dw.value,
            height: config.outerSize.height,
            depth: config.outerSize.depth,
            border: false
        });
        const { shape: right } = useCube({
            width: dw.value,
            height: config.outerSize.height,
            depth: config.outerSize.depth,
            border: false
        });
        const { shape: backboard } = useCube({
            width: config.innerSize.width,
            height: config.outerSize.height,
            depth: dp.value,
            border: false
        });

        shelf.append(left, right, backboard);

        left.setLocalPosition(0, 0, 0);
        right.setLocalPosition(xr.value, 0, 0);
        backboard.setLocalPosition(dw.value, 0, z.value);
    } else {
        const getShape = type.value === ShelfType.Pillar ? useCube : useCylinder;
        const { shape: pla } = getShape({ width: dw.value, height: config.outerSize.height, depth: dp.value });
        const { shape: plb } = getShape({ width: dw.value, height: config.outerSize.height, depth: dp.value });
        const { shape: pra } = getShape({ width: dw.value, height: config.outerSize.height, depth: dp.value });
        const { shape: prb } = getShape({ width: dw.value, height: config.outerSize.height, depth: dp.value });

        shelf.append(pla, plb, pra, prb);

        pla.setLocalPosition(0, 0, 0);
        plb.setLocalPosition(0, 0, z.value);
        pra.setLocalPosition(xr.value, 0, 0);
        prb.setLocalPosition(xr.value, 0, z.value);
    }

    return shelf;
};
