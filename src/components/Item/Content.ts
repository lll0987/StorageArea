import { Group } from '@antv/g';
import type { ISegment, TBox, TSize } from '@/types';
import { useLayer } from '@/packages/Layer';

interface TConfig extends TSize {
    multi: number;
    segments: ISegment[];
}

export const useContent = (config: TConfig) => {
    const { width, height, depth, multi, segments } = config;

    const group = new Group();
    const getBox = (box?: TBox): TBox | undefined => {
        if (!box) return undefined;
        const { width: w, height: h, depth: d, ...cfg } = box;
        return { ...cfg, width: w * multi, height: h * multi, depth: d * multi };
    };

    let pos = height;
    segments.forEach(segment => {
        const iheight = segment.scaledLength || 0;
        const ispacing = segment.scaledSpacing || 0;

        pos = pos - iheight - ispacing;

        const layer = useLayer({
            width,
            height: iheight,
            depth,
            spacing: ispacing,
            locations: segment.locations.map(location => ({
                ...location,
                box: getBox(location.box)
            }))
        });
        layer.setLocalPosition(0, pos, 0);
        group.appendChild(layer);
    });

    return group;
};
