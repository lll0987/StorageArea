import { MaterialType, ShapeType, ShelfType, ViewType } from '@/dicts';

export interface TSize {
    width: number;
    height: number;
    depth: number;
}

export interface TMaterial {
    color?: string;
    material?: MaterialType;
}

export interface TShape extends TSize, TMaterial {
    type?: ShapeType;
    view?: ViewType;
    border?: boolean;
    borderColor?: string;
    borderWidth?: number;
    highlightColor?: string;
}

export interface TDimension extends TSize {
    scaledSize: TSize;
}

export interface TShelf extends TMaterial {
    type?: ShelfType;
    innerSize: TSize;
    outerSize: TSize;
}

export interface TArea extends TShelf {}

export interface TBox extends TSize, TMaterial {
    id: string;
}

export interface TPostion {
    pk: number;
    verticalPK: number;
    horizontalPK: number;
    frontPK: number;
}

export interface TLocation extends TPostion {
    box?: TBox;
}

export interface TLayer extends TSize {
    spacing: number;
    locations: TLocation[];
}

export interface TPlate extends TSize, TMaterial {}

interface ILocation extends TPostion {
    box?: string;
}
export interface TItem extends TSize {
    segments: Array<{ height: number; spacing: number; locations: ILocation[] }>;
}
