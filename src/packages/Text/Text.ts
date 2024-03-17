import { Rect, Text } from '@antv/g';
import { getBoundsSize } from '@/util';

export const useText = (text: string, width: number) => {
    const content = new Text({
        style: {
            text,
            wordWrap: true,
            wordWrapWidth: width,
            fill: 'blue',
            fontSize: '12px',
            fontFamily: 'sans-serif',
            fontWeight: 'normal',
            fontVariant: 'normal',
            fontStyle: 'normal',
            textAlign: 'left',
            textBaseline: 'top',
            lineWidth: 0
        }
    });

    const { width: twidth, height: theight } = getBoundsSize(content);

    const x = (width - twidth) / 2;
    const y = 0;
    content.setLocalPosition(x, y);

    const height = theight + y;
    const container = new Rect({ style: { width, height } });
    container.appendChild(content);

    return container;
};
