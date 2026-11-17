/* @jsxImportSource preact */
import { GlobalRegistrator } from "@happy-dom/global-registrator";
import { act, cleanup, render } from "@testing-library/preact";
import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  expect,
  spyOn,
  test,
  vi,
} from "bun:test";
import { AUTO_GO_BACK_EVENT, AutoGoBack } from "./auto-go-back.client";

//

const { advanceTimersByTime, useFakeTimers, useRealTimers } = vi;

beforeAll(() => {
  GlobalRegistrator.register();
});

beforeEach(() => {
  useFakeTimers();
});

afterEach(() => {
  cleanup();
  useRealTimers();
});

afterAll(() => {
  GlobalRegistrator.unregister();
});

//

test("goes back 2 seconds after the event", () => {
  const back = spyOn(history, "back").mockImplementation(() => {});
  const { getByText, queryByText } = render(<AutoGoBack />);
  expect(queryByText("Retour immédiat")).toBeNull();

  act(() => {
    document.body.dispatchEvent(new CustomEvent(AUTO_GO_BACK_EVENT));
  });
  getByText("Retour immédiat");

  advanceTimersByTime(1_999);
  expect(back).not.toHaveBeenCalled();
  advanceTimersByTime(1);
  expect(back).toHaveBeenCalledTimes(1);
  back.mockRestore();
});

test("« Annuler » hides the callout and stays on the page", () => {
  const back = spyOn(history, "back").mockImplementation(() => {});
  const { getByText, queryByText } = render(<AutoGoBack />);

  act(() => {
    document.body.dispatchEvent(new CustomEvent(AUTO_GO_BACK_EVENT));
  });
  act(() => {
    getByText("Annuler").click();
  });

  expect(queryByText("Annuler")).toBeNull();
  advanceTimersByTime(2_000);
  expect(back).not.toHaveBeenCalled();
  back.mockRestore();
});
