import { Group } from '@antv/g';
import { computed, inject } from 'vue';
import type { TBox, TItem } from '@/types';
import { useArea } from '@/packages/Area';
import { useLayer } from '@/packages/Layer';
import { boxes } from '@/components/Main/data';

const getBox = (id: string) => boxes.find(box => box.id === id) || ({} as TBox);

const getMulti = (item: TItem, config: { height: number }) => {
    const max = config.height - 0;
    const topLayer = item.segments[item.segments.length - 1];
    const height = topLayer.locations.reduce((res, item, ind, arr) => {
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
    return Math.floor(max / (item.height + height));
};

export const useItem = (item: TItem, config: { height: number }) => {
    const multi = getMulti(item, config);

    const width = item.width * multi;
    const height = item.height * multi;
    const depth = item.depth * multi;

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
    const boxMap = computed(() =>
        item.segments.reduce((res, next) => {
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
        }, {} as Record<string, TBox>)
    );
    let pos = height;
    item.segments.forEach(segment => {
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
                box: location.box ? boxMap.value[location.box] : undefined
            }))
        });
        layer.setPosition(diameter, pos, 0);
        group.appendChild(layer);
    });

    return group;
};
