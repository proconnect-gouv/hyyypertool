//

import {
  Children,
  cloneElement,
  isValidElement,
  type Child,
  type FC,
} from "hono/jsx";
import { raw } from "hono/utils/html";

//
// Inspired by https://github.com/andrey-skl/react-slotify/blob/6317a858696544c4d17db3d1823625beece3412c/src/index.tsx
//

interface RendererProps {
  childs: Child | undefined;
  children?: Child | undefined;
}

type RendererType<P> = FC<RendererProps & P>;

type SlotProps<P> = {
  showChildren?: boolean;
  restProps?: P & { defaultChildren: Child };
};

type FunctionChild<P> = (
  props: P & { defaultChildren: Child | undefined },
) => Child | undefined;
type NormalOrFunctionChildren<P> = FunctionChild<P> | Child | undefined;

export type SlotType<P> = FC<
  SlotProps<P> & { children?: NormalOrFunctionChildren<P> }
> & {
  Renderer: RendererType<P>;
};
export function createSlot<P extends {}>() {
  const Slot: SlotType<P> = (({ children, showChildren, restProps }) => {
    if (!showChildren) {
      return null;
    }

    const children_array = Children.toArray(children as Child[]) as
      Child[] | [FunctionChild<P>];

    if (
      restProps &&
      children_array[0] &&
      typeof children_array[0] === "function"
    ) {
      return children_array[0](restProps);
    }

    return raw(children);
  }) as SlotType<P>;

  const Renderer: RendererType<P> = ({ childs, children, ...restProps }) => {
    if (childs === undefined) {
      return raw(children);
    }
    const slotted = Children.toArray(childs).find((child) => {
      return isValidElement(child) && child.tag === Slot;
    });

    if (!slotted || !isValidElement(slotted)) {
      return raw(children);
    }

    return raw(
      cloneElement(
        slotted,
        {
          restProps: { ...restProps, defaultChildren: children },
          showChildren: true,
        } satisfies SlotProps<unknown>,
        slotted.children,
      ),
    );
  };
  Slot.Renderer = Renderer;
  return Slot;
}
