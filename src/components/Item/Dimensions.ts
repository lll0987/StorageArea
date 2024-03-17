import { Group, Rect } from '@antv/g';
import { useDimension } from '@/packages/Dimension';
import { DirectionType, PositionType } from '@/enums';
import { getBoundsSize } from '@/util';
import type { TSegment } from '@/types';

export const useDimensions = (
    config: [number, number],
    size: [number, number, number],
    scaledSize: [number, number, number],
    segments?: TSegment[],
    left?: [number, number],
    top?: number
) => {
    const [width, height] = config;
    const [w, h, d] = size;
    const [sw, sh, sd] = scaledSize;
    const [lOut, lIn] = left || [0, 0];
    top = top || 0;

    const unit = 'cm';
    const group = new Group({ style: { opacity: 0 } });
    const bg = new Rect({ style: { width, height, fill: 'rgba(255, 255, 255, .65)', strokeWidth: 0 } });

    const wd = useDimension({ spacing: w, scaledSpacing: sw, length: 0, unit });
    const hd = useDimension({ spacing: h, scaledSpacing: sh, length: 0, unit, direction: DirectionType.Vertical });

    group.append(bg, wd, hd);

    wd.setLocalPosition(lIn, Math.min(height - getBoundsSize(wd).height, sh), 0);
    hd.setLocalPosition(Math.max(lOut - getBoundsSize(hd).width, 0), top, 0);

    if (segments && segments.length) {
        const sd = useDimension({
            length: 0,
            spacing: 0,
            segments,
            unit,
            direction: DirectionType.Vertical,
            position: PositionType.After
        });
        group.append(sd);
        sd.setLocalPosition(width - Math.max(getBoundsSize(sd).width, lOut), top, 0);
    }

    const showOrHidden = (val: boolean) => {
        let start = { opacity: 0 };
        let end = { opacity: 1 };

        if (!val) [start, end] = [end, start];

        group.animate([start, end], {
            duration: 300,
            easing: 'ease-in-out',
            fill: 'both'
        });
    };

    return { dimension: group, showOrHidden };
};
