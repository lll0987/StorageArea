import { Group } from '@antv/g';
import type { TLayer } from '@/types';
import { useCube, type IShape } from '../Shape';
import { getBoundsSize } from '@/util';

export const useLocation = (config: TLayer) => {
    const { width, depth, spacing: height, locations } = config;
    const len = locations.filter(i => !i.box).length;
    const group = new Group();

    if (len > 1 || len === locations.length) {
        const { shape: location } = useCube({ width, height, depth, border: false, color: 'transparent' });
        group.appendChild(location);
    } else {
        // 排序保证先生成边上的
        locations.sort((a, b) => Math.min(a.horizontalPK - b.horizontalPK, a.verticalPK - b.verticalPK));
        // 空余宽度
        const spare = width - locations.reduce((r, n) => (r += n.verticalPK ? 0 : n?.box?.width ?? 0), 0);

        const map = new Map<number, IShape>();
        for (const { pk, horizontalPK, verticalPK, box } of locations) {
            const w = box?.width ?? spare;
            const h = box?.height ?? height;
            const d = box?.depth ?? depth;
            let x = 0;
            let y = height - h;

            if (horizontalPK) {
                const item = map.get(horizontalPK);
                if (!item) break;
                // item.getBoundingClientRect().width
                x = x + item.getLocalPosition()[0] + getBoundsSize(item).width;
            }
            if (verticalPK) {
                const item = map.get(verticalPK);
                if (!item) break;
                y = y - getBoundsSize(item).height;
                // y = y - item.y + item.height;
            }

            const { shape: item } = useCube({
                width: w,
                height: h,
                depth: d,
                border: !!box,
                color: box?.color ?? 'transparent'
            });
            item.setLocalPosition(x, y);
            map.set(pk, item);
        }

        for (const item of map.values()) {
            group.appendChild(item);
        }
    }

    return group;
};
