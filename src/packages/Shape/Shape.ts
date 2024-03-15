import { computed, ref } from 'vue';
import type { TShape } from '@/types';
import { MaterialType, ShapeType, ViewType } from '@/enums';
import { Ellipse, Rect } from '@antv/g';

export type IShape = Ellipse | Rect;

const useShape = (config: TShape) => {
    // 通过视图获取尺寸
    const view = ref(config.view || ViewType.Front);
    const w = ref(config.width || 0);
    const h = ref(config.height || 0);
    const d = ref(config.depth || 0);
    const width = computed(() => (view.value === ViewType.Side ? d.value : w.value));
    const height = computed(() => (view.value === ViewType.Top ? d.value : h.value));

    // 渲染材质
    const color = ref(config.color || 'black');
    const material = ref(config.material || MaterialType.Solid);
    const texture = computed(() => ({ fill: color.value }));

    // 边框
    const border = ref(!!config.border);
    const borderColor = ref(config.borderColor || 'lightgrey');
    const borderWidth = ref(config.borderWidth || 2);
    const highlightColor = ref(config.highlightColor || 'blue');

    // 立方体
    const getCubeSurface = () =>
        new Rect({ style: { x: 0, y: 0, width: width.value, height: height.value, ...texture.value } });
    // 圆柱体
    const getCylinderSurface = () =>
        view.value === ViewType.Top
            ? new Ellipse({
                  style: {
                      cx: 0 + width.value / 2,
                      cy: 0 + height.value / 2,
                      rx: width.value,
                      ry: height.value,
                      ...texture.value
                  }
              })
            : getCubeSurface();

    const getSurface = () => (config.type === ShapeType.Cylinder ? getCylinderSurface() : getCubeSurface());

    // 渲染
    let surface: IShape = getSurface();

    // 修改视图
    const changeView = (val: ViewType) => {
        if (val === view.value) return;
        view.value = val;
        surface = getSurface();
    };

    // 高亮
    const setHighlighting = (highlight: boolean) => {
        if (!border.value || !surface) return;
        surface.style.stroke = highlight ? highlightColor.value : borderColor.value;
        surface.style.strokeWidth = borderWidth.value;
    };

    setHighlighting(false);

    return { shape: surface, changeView, setHighlighting };
};

export const useCube = (config: TShape) => useShape({ ...config, type: ShapeType.Cube });
export const useCylinder = (config: TShape) => useShape({ ...config, type: ShapeType.Cylinder });
