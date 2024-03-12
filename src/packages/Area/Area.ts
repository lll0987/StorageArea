import type { TArea } from '@/types';
import { useShelf } from './Shelf';
import { Group } from '@antv/g';

export const useArea = (config: TArea) => {
    const shelf = useShelf(config);
    shelf.setPosition(0, 0, 0);

    const area = new Group({ style: { x: 0, y: 0 } });
    area.append(shelf);
    return area;
};
