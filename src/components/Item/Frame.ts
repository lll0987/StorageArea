import type { TSize } from '@/types';
import { useArea } from '@/packages/Area';

export const useFrame = (size: TSize) => {
    const { width, height, depth } = size;
    const diameter = 12;

    const innerSize = { width, height, depth };
    const outerSize = {
        width: width + diameter * 2,
        height: height,
        depth: depth + diameter * 2
    };

    return { frame: useArea({ innerSize, outerSize }), x: diameter };
};
