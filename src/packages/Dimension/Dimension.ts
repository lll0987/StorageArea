import { Group, Line, Path, Rect } from '@antv/g';
import { Arrow } from '@antv/g-components';
import type { TDimension } from '@/types';
import { useText } from '../Text';
import { DirectionType, PositionType } from '@/enums';
import { getBoundsSize } from '@/util';

export const useDimension = (config: TDimension) => {
    const segments = config.segments?.length ? config.segments : [config];

    const lineWidth = 2;
    const lineHeight = 16;
    const group = new Group();
    const content = new Group();
    const textGroup = new Group();
    const lineGroup = new Group();
    content.append(textGroup, lineGroup);
    group.append(content);

    const createArrowHead = (x: number) =>
        new Path({
            style: {
                // draw an angle '<'
                path: `M${10 * Math.cos(Math.PI / 6)},${10 * Math.sin(Math.PI / 6)} L0,0 L${
                    10 * Math.cos(Math.PI / 6)
                },-${10 * Math.sin(Math.PI / 6)}`,
                stroke: 'blue',
                lineWidth,
                transformOrigin: 'center',
                anchor: [x, 0.5]
            }
        });
    const createArrow = (width: number) =>
        new Arrow({
            style: {
                body: new Line({ style: { x1: 0, y1: 0, x2: width - lineWidth * 2, y2: 0 } }),
                lineWidth,
                startHead: createArrowHead(0),
                endHead: createArrowHead(1),
                stroke: 'blue'
            }
        });
    const createLine = () => new Rect({ style: { width: lineWidth, height: lineHeight, fill: 'blue' } });

    // 生成文字和线条
    let pos = 0;
    for (const segment of segments) {
        const value = segment.scaledSpacing || segment.spacing;
        const gap = segment.scaledLength || segment.length;
        let label = `${segment.spacing}`;
        if (config.unit) label += ` ${config.unit}`;

        pos += gap;

        // 生成文字
        const text = useText(label, value);
        textGroup.appendChild(text);
        text.setLocalPosition(pos, 0, 0);

        // 生成线条
        const left = createLine();
        const arrow = createArrow(value);
        lineGroup.append(arrow, left);
        left.setLocalPosition(pos, 0, 0);
        arrow.setLocalPosition(pos + lineWidth, (lineHeight - lineWidth) / 2, 0);

        pos += value;
        const right = createLine();
        lineGroup.append(right);
        right.setLocalPosition(pos - lineWidth, 0, 0);
    }

    const textHeight = getBoundsSize(textGroup).height;

    // 设置文字和线条的相对位置
    const isVertical = (config.direction || DirectionType.Horizontal) === DirectionType.Vertical;
    const isAfter = () => {
        let position = PositionType.After;
        if (config.position) position = config.position;
        else if (isVertical) position = PositionType.Befor;
        return position === PositionType.After;
    };
    if (isAfter()) {
        textGroup.setLocalPosition(0, lineHeight / 2 + 2, 0);
    } else {
        lineGroup.setLocalPosition(0, textHeight - 2, 0);
    }

    // 如果是垂直方向的旋转90度
    if (isVertical) {
        content.rotateLocal(-90);
        content.setLocalPosition(0, getBoundsSize(content).height, 0);
    }

    return group;
};
