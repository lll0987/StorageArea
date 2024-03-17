import type { TArea } from '@/types';
import { useShelf } from './Shelf';
import { Group } from '@antv/g';

export const useArea = (config: TArea) => {
    const area = new Group();
    const shelf = useShelf(config);
    area.append(shelf);
    shelf.setLocalPosition(0, 0, 0);
    return area;
};
