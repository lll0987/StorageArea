import { Group } from '@antv/g';
import type { TLayer } from '@/types';
import { useCube } from '../Shape';
import { useLocation } from './Location';

export const useLayer = (config: TLayer) => {
    const layer = new Group();

    const space = useLocation(config);
    layer.append(space);
    space.setLocalPosition(0, 0, 0);

    if (config.height) {
        const { shape: plate } = useCube(config);
        layer.append(plate);
        plate.setLocalPosition(0, config.spacing, 0);
    }

    return layer;
};
