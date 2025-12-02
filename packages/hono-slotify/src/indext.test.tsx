//

//
// Inspired by https://github.com/andrey-skl/react-slotify/blob/6317a858696544c4d17db3d1823625beece3412c/test/slot.test.tsx
//

import { expect, test } from "bun:test";
import type { FC, PropsWithChildren } from "hono/jsx";
import { createSlot } from ".";

test("render basic slot", () => {
  const TestSlot = createSlot();
  const Component: FC<PropsWithChildren> = ({ children }) => {
    return (
      <div>
        beforeslot <TestSlot.Renderer childs={children} /> afterslot;
        ownChildren: {children}
      </div>
    );
  };
  expect(
    (
      <div>
        beforecomponent
        <Component>
          BEFORE_SLOT<TestSlot>IN_SLOT</TestSlot>AFTER_SLOT
        </Component>
        aftercomponent
      </div>
    ).toString(),
  ).toMatchSnapshot();
});

test("render undefined childs", () => {
  const TestSlot = createSlot();
  const Component: FC<PropsWithChildren> = ({ children }) => {
    return (
      <div>
        beforeslot <TestSlot.Renderer childs={undefined} /> afterslot;
        ownChildren: {children}
      </div>
    );
  };
  expect(
    (
      <div>
        beforecomponent
        <Component>
          BEFORE_SLOT<TestSlot>IN_SLOT</TestSlot>AFTER_SLOT
        </Component>
        aftercomponent
      </div>
    ).toString(),
  ).toMatchSnapshot();
});

test("render default content if slot is not used", () => {
  const TestSlot = createSlot();

  const Component: FC<PropsWithChildren> = ({ children }) => {
    return (
      <pre>
        beforeslot
        <TestSlot.Renderer childs={children}>
          DEFAULT_SLOT_CONTENT
        </TestSlot.Renderer>
        afterslot; ownChildren: {children}
      </pre>
    );
  };
  expect(
    (
      <main>
        beforecomponent
        <Component>Slot not used</Component>
        aftercomponent
      </main>
    ).toString(),
  ).toMatchSnapshot();
});

test("pass parameters", () => {
  const TestSlot = createSlot<{ foo: string }>();

  const Component: FC<PropsWithChildren> = ({ children }) => {
    return (
      <pre>
        <TestSlot.Renderer childs={children} foo="bar" />
      </pre>
    );
  };
  expect(
    (
      <main>
        <Component>
          <TestSlot>{(params) => <div>foo={params.foo}</div>}</TestSlot>
        </Component>
      </main>
    ).toString(),
  ).toMatchSnapshot();
});

test("pass default children to function", () => {
  const TestSlot = createSlot();

  const Component: FC<PropsWithChildren> = ({ children }) => {
    return (
      <pre>
        <TestSlot.Renderer childs={children}>
          DEFAULT_SLOT_CONTENT
        </TestSlot.Renderer>
      </pre>
    );
  };
  expect(
    (
      <main>
        <Component>
          <TestSlot>
            {(params) => <div>foo={params.defaultChildren}</div>}
          </TestSlot>
        </Component>
      </main>
    ).toString(),
  ).toMatchSnapshot();
});
