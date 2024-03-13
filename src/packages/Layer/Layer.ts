import { Group } from '@antv/g';
import type { TLayer } from '@/types';
import { useCube } from '../Shape';
import { useLocation } from './Location';

export const useLayer = (config: TLayer) => {
    const space = useLocation(config);
    space.setPosition(0, 0, 0);

    const { shape: plate } = useCube(config);
    plate.setPosition(0, config.spacing, 0);

    const layer = new Group();
    layer.append(space, plate);
    return layer;
};
