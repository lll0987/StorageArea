export const boxes = [
    { id: 'HZDS', width: 14, height: 13, depth: 14, color: 'grey' },
    { id: 'HZDM', width: 14, height: 13, depth: 28, color: 'grey' },
    { id: 'HZDL', width: 28, height: 13, depth: 28, color: 'grey' },
    { id: 'HCW', width: 9, height: 7, depth: 24, color: 'deepskyblue' },
    { id: 'HSP', width: 16, height: 8, depth: 23, color: 'mediumseagreen' },
    { id: 'HBX', width: 10, height: 10, depth: 29.5 },
    { id: 'WL', width: 25, height: 18, depth: 26 }
];

export const data = [
    {
        width: 100,
        height: 120,
        depth: 35,
        segments: [
            { height: 0, spacing: 20, locations: [] },
            { height: 2, spacing: 23, locations: [{ pk: 1, verticalPK: 0, horizontalPK: 0, frontPK: 0 }] },
            {
                height: 2,
                spacing: 24,
                locations: [
                    { pk: 1, verticalPK: 0, horizontalPK: 0, frontPK: 0, box: 'HZDL' },
                    { pk: 2, verticalPK: 0, horizontalPK: 1, frontPK: 0, box: 'HZDM' },
                    { pk: 3, verticalPK: 0, horizontalPK: 2, frontPK: 0, box: 'HZDL' },
                    { pk: 4, verticalPK: 0, horizontalPK: 3, frontPK: 0, box: 'HZDL' }
                ]
            },
            {
                height: 2,
                spacing: 25,
                locations: [
                    { pk: 1, verticalPK: 0, horizontalPK: 0, frontPK: 0, box: 'HZDM' },
                    { pk: 2, verticalPK: 0, horizontalPK: 1, frontPK: 0, box: 'HZDM' },
                    { pk: 3, verticalPK: 0, horizontalPK: 2, frontPK: 0, box: 'HZDM' },
                    { pk: 4, verticalPK: 0, horizontalPK: 3, frontPK: 0, box: 'HZDM' },
                    { pk: 5, verticalPK: 0, horizontalPK: 4, frontPK: 0 },
                    { pk: 6, verticalPK: 0, horizontalPK: 5, frontPK: 0, box: 'HBX' },
                    { pk: 7, verticalPK: 0, horizontalPK: 6, frontPK: 0, box: 'HZDL' }
                ]
            },
            {
                height: 2,
                spacing: 20,
                locations: [
                    { pk: 1, verticalPK: 0, horizontalPK: 0, frontPK: 0 },
                    { pk: 2, verticalPK: 0, horizontalPK: 1, frontPK: 0, box: 'HCW' },
                    { pk: 3, verticalPK: 2, horizontalPK: 1, frontPK: 0, box: 'HCW' },
                    { pk: 4, verticalPK: 0, horizontalPK: 2, frontPK: 0, box: 'HSP' },
                    { pk: 5, verticalPK: 4, horizontalPK: 2, frontPK: 0, box: 'HSP' },
                    { pk: 6, verticalPK: 0, horizontalPK: 4, frontPK: 0, box: 'WL' }
                ]
            }
        ]
    }
];
