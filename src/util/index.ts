import type { DisplayObject } from '@antv/g';

export const getBoundsSize = (node: DisplayObject) => {
    const { max, min } = node.getBounds();
    const width = max[0] - min[0];
    const height = max[1] - min[1];
    const depth = max[2] - min[2];
    return { width, height, depth };
};
