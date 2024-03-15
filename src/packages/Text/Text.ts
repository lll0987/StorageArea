import { Rect, Text } from '@antv/g';

export const useText = (text: string, width: number) => {
    const content = new Text({
        style: {
            text,
            wordWrap: true,
            wordWrapWidth: width,
            fill: 'blue',
            x: 0,
            y: 0,
            fontSize: '12px',
            fontFamily: 'sans-serif',
            fontWeight: 'normal',
            fontVariant: 'normal',
            fontStyle: 'normal',
            textAlign: 'center',
            textBaseline: 'top',
            lineWidth: 0
        }
    });

    const twidth = content.getBounds().max[0] - content.getBounds().min[0];
    const theight = content.getBounds().max[1] - content.getBounds().min[1];

    const x = (width - twidth) / 2;
    const y = 0;
    content.setPosition(x, y);

    const height = theight + y;
    const container = new Rect({ style: { width, height } });
    container.appendChild(content);

    return container;
};
