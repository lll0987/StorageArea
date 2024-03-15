import { Group, Line, Path, Rect, Text } from '@antv/g';
import { Arrow } from '@antv/g-components';
import type { TDimension } from '@/types';
import { useText } from '../Text';
import { DirectionType, PositionType } from '@/enums';

export const useDimension = (config: TDimension) => {
    const segments = config.segments?.length
        ? config.segments
        : [{ length: config.length, scaledLength: config.scaledLength, spacing: 0 }];

    const lineWidth = 2;
    const lineHeight = 16;
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
    const createLine = (pos: number) =>
        new Rect({ style: { x: pos, y: 0, width: lineWidth, height: lineHeight, fill: 'blue' } });

    // 生成文字和线条
    const textGroup = new Group();
    const lineGroup = new Group();
    let pos = 0;
    for (const segment of segments) {
        const gap = segment.scaledSpacing || segment.spacing;
        const value = segment.scaledLength || segment.length;
        let label = `${segment.length}`;
        if (config.unit) label += ` ${config.unit}`;

        pos += gap;

        // 生成文字
        textGroup.appendChild(useText(label, value));

        // 生成线条
        const left = createLine(pos);
        const arrow = new Arrow({
            style: {
                body: new Line({ style: { x1: 0, y1: 0, x2: value - lineWidth * 2, y2: 0 } }),
                lineWidth,
                startHead: createArrowHead(0),
                endHead: createArrowHead(1),
                stroke: 'blue'
            }
        });
        arrow.setPosition(pos + lineWidth, (lineHeight - lineWidth) / 2);
        pos += value;
        const right = createLine(pos - lineWidth);
        lineGroup.append(arrow, left, right);
    }

    const textHeight = textGroup.getBounds().max[1] - textGroup.getBounds().min[1];

    // 设置文字和线条的相对位置
    const isVertical = (config.direction || DirectionType.Horizontal) === DirectionType.Vertical;
    const isAfter = () => {
        let position = PositionType.After;
        if (config.position) position = config.position;
        else if (isVertical) position = PositionType.Befor;
        return position === PositionType.After;
    };
    if (isAfter()) {
        textGroup.setPosition(0, lineHeight);
    } else {
        lineGroup.setPosition(0, textHeight);
    }

    // 生成整体图像
    const group = new Group();
    group.append(textGroup, lineGroup);

    // TODO 如果是垂直方向的旋转90度
    if (isVertical) {
        // group.offsetX(pos);
        // group.rotation(-90);
        // group.width(height);
        // group.height(width);
    }

    return group;
};
