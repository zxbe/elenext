import { defineComponent, computed, inject, PropType, ref, ComputedRef, CSSProperties } from 'vue'
import { getCompName, getBlockCls } from '../../config'
import { RowInjectKey, GutterTuple } from './Row'
import { normalizeClass } from '../../utils/dom'

type ColPropType = number | string

type SizeProp = {
  span?: ColPropType
  order?: ColPropType
  offset?: ColPropType
  push?: ColPropType
  pull?: ColPropType
}

type FlexType = number | 'none' | 'auto' | string
function parseFlex(flex: FlexType): string {
  if (typeof flex === 'number') {
    return `${flex} ${flex} auto`
  }

  if (/^\d+(\.\d+)?(px|em|rem|%)$/.test(flex)) {
    return `0 0 ${flex}`
  }

  return flex
}

const defalutPropItem = {
  type: [Number, String] as PropType<ColPropType>,
  default: 0
}

const sizePropItem = {
  type: Object as PropType<SizeProp>,
  required: false
}

const blockCls = getBlockCls('col')

const Col = defineComponent({
  name: getCompName('Col'),
  props: {
    span: defalutPropItem,
    order: defalutPropItem,
    offset: defalutPropItem,
    push: defalutPropItem,
    pull: defalutPropItem,
    xs: sizePropItem,
    sm: sizePropItem,
    md: sizePropItem,
    lg: sizePropItem,
    xl: sizePropItem,
    xxl: sizePropItem,
    flex: {
      type: [Number, String] as PropType<FlexType>,
      required: false
    }
  },
  setup(props, { slots }) {
    const { gutter } = inject(RowInjectKey, { gutter: ref([0, 0]) } as { gutter: ComputedRef<GutterTuple> })

    const classes = computed(() => {
      let sizeClassObj = {}
      ;['xs', 'sm', 'md', 'lg', 'xl', 'xxl'].forEach(size => {
        let sizeProps: SizeProp = {}
        const propSize = (props as any)[size]
        if (typeof propSize === 'object') {
          sizeProps = propSize || {}
        }

        sizeClassObj = {
          ...sizeClassObj,
          [`${blockCls}-${size}-${sizeProps.span}`]: sizeProps.span !== undefined,
          [`${blockCls}-${size}-order-${sizeProps.order}`]: sizeProps.order || sizeProps.order === 0,
          [`${blockCls}-${size}-offset-${sizeProps.offset}`]: sizeProps.offset || sizeProps.offset === 0,
          [`${blockCls}-${size}-push-${sizeProps.push}`]: sizeProps.push || sizeProps.push === 0,
          [`${blockCls}-${size}-pull-${sizeProps.pull}`]: sizeProps.pull || sizeProps.pull === 0
        }
      })
      const ret = normalizeClass([
        blockCls,
        {
          [`${blockCls}-${props.span}`]: props.span !== undefined,
          [`${blockCls}-order-${props.order}`]: props.order,
          [`${blockCls}-offset-${props.offset}`]: props.offset,
          [`${blockCls}-push-${props.push}`]: props.push,
          [`${blockCls}-pull-${props.pull}`]: props.pull
        },
        sizeClassObj
      ])
      return ret
    })

    const styles = computed(() => {
      let ret: CSSProperties = {}
      const [x, y] = gutter.value
      ret = {
        ...(x > 0
          ? {
              paddingLeft: x / 2,
              paddingRight: x / 2
            }
          : {}),
        ...(y > 0
          ? {
              paddingTop: y / 2,
              paddingBottom: y / 2
            }
          : {})
      }
      if (props.flex) {
        ret.flex = parseFlex(props.flex)
      }
      return {}
    })

    return () => (
      <div class={classes.value} style={styles.value}>
        {slots.default?.()}
      </div>
    )
  }
})

export default Col