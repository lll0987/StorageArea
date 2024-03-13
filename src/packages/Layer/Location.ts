import { Group } from '@antv/g';
import type { TLayer } from '@/types';
import { useCube, type IShape } from '../Shape';

export const useLocation = (config: TLayer) => {
    const { width, depth, spacing: height, locations } = config;
    const len = locations.filter(i => !i.box).length;
    const group = new Group({ style: { x: 0, y: 0 } });

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
                const iwidth = item.getBounds().max[0] - item.getBounds().min[0];
                x = x + item.getPosition()[0] + iwidth;
            }
            if (verticalPK) {
                const item = map.get(verticalPK);
                if (!item) break;
                const iheight = item.getBounds().max[1] - item.getBounds().min[1];
                y = y - iheight;
                // y = y - item.y + item.height;
            }

            const { shape: item } = useCube({
                width: w,
                height: h,
                depth: d,
                border: !!box,
                color: box?.color ?? 'transparent'
            });
            item.setPosition(x, y);
            map.set(pk, item);
        }

        for (const item of map.values()) {
            group.appendChild(item);
        }
    }

    return group;
};
