import type { TItem } from '@/types';
import { useArea } from '@/packages/Area';
import { Group } from '@antv/g';
import { useLayer } from '@/packages/Layer/Layer';

export const useItem = (item: TItem) => {
    const multi = 5;
    const width = item.width * multi;
    const height = item.height * multi;
    const depth = item.depth * multi;

    const group = new Group();

    const diameter = 12;
    const innerSize = { width, height, depth };
    const outerSize = {
        width: width + diameter * 2,
        height: height + diameter * 2,
        depth: depth + diameter * 2
    };
    group.appendChild(useArea({ innerSize, outerSize }));

    let pos = height;
    item.segments.forEach(i => {
        const iheight = i.height * multi;
        const ispacing = i.spacing * multi;
        pos = pos - iheight - ispacing;
        const layer = useLayer({ width, height: iheight, depth, spacing: ispacing });
        layer.setPosition(diameter, pos, 0);
        group.appendChild(layer);
    });

    return group;
};
