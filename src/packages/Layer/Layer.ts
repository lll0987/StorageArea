import { Group } from '@antv/g';
import type { TLayer } from '@/types';
import { useCube } from '../Shape';

export const useLayer = (config: TLayer) => {
    const { shape: plate } = useCube(config);
    plate.setPosition(0, config.spacing, 0);

    const space = new Group({ style: { x: 0, y: 0 } });

    const layer = new Group();
    layer.append(space, plate);
    return layer;
};
