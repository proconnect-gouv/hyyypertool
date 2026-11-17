//

const DARK_FLAG = [
  [240, 86, 74],
  [0, 0, 100],
  [0, 100, 72],
] as const;
const GRADIENT_STOPS = 24;
const LIGHT_FLAG = [
  [240, 100, 28],
  [0, 0, 100],
  [356, 100, 44],
] as const;
const MASK_RESOLUTION = 0.5;
const MIN_LIGHT_DISTANCE = 40;
const MIX_DURATION = 400;
const RAINBOW = [0, 90, 60] as const;
const SHADOW_RESOLUTION = 0.25;
const SHADOW_STEPS = 320;
const SPECTRAL_RAMP = 0.35;
const SUN_DISTANCE = 1.5;

//

for (const sky of document.querySelectorAll<HTMLCanvasElement>(
  ".hyyyperday-sunlight .sky",
)) {
  const title = sky.parentElement?.querySelector<HTMLElement>(".title");
  const context = sky.getContext("2d");
  if (title && context) cast_shadows({ context, sky, title });
}

//

function cast_shadows({
  context,
  sky,
  title,
}: {
  context: CanvasRenderingContext2D;
  sky: HTMLCanvasElement;
  title: HTMLElement;
}) {
  const layer = document.createElement("canvas");
  const layer_context = layer.getContext("2d");
  const beam = document.createElement("canvas");
  const beam_context = beam.getContext("2d");
  const tint = document.createElement("canvas");
  const tint_context = tint.getContext("2d");
  if (!layer_context || !beam_context || !tint_context) return;

  const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let frame = 0;
  let stale = true;
  let scene = measure_scene({ sky, title });
  let inverted = false;
  let pointer = { x: scene.width * 0.3, y: -scene.height * 0.3 };
  let tricolore = false;
  let mix = 0;
  let last_time = 0;

  const draw = (time: number) => {
    frame = 0;
    const target = tricolore ? 1 : 0;
    const elapsed = last_time ? time - last_time : 16;
    mix = still
      ? target
      : mix +
        Math.sign(target - mix) *
          Math.min(Math.abs(target - mix), elapsed / MIX_DURATION);
    last_time = mix === target ? 0 : time;
    if (stale) {
      scene = measure_scene({ sky, title });
      layer.width = Math.ceil(scene.width * SHADOW_RESOLUTION);
      layer.height = Math.ceil(scene.height * SHADOW_RESOLUTION);
      beam.width = layer.width;
      beam.height = layer.height;
      tint.width = scene.logo.mask.width;
      tint.height = scene.logo.mask.height;
      stale = false;
    }
    const { dark, logo, mask, origin, ratio, size } = scene;
    const center = {
      x: origin.x + size.width / 2,
      y: origin.y + size.height / 2,
    };
    const toward = { x: pointer.x - center.x, y: pointer.y - center.y };
    const length = Math.hypot(toward.x, toward.y) || 1;
    const direction = { x: toward.x / length, y: toward.y / length };
    const diagonal = Math.hypot(scene.width, scene.height);
    const sun_distance = inverted
      ? Math.max(length, MIN_LIGHT_DISTANCE)
      : diagonal * SUN_DISTANCE;
    const axis = inverted ? direction : { x: -direction.x, y: -direction.y };
    const sun = {
      x: center.x - axis.x * sun_distance,
      y: center.y - axis.y * sun_distance,
    };
    const reach = 1 + (diagonal * 2) / sun_distance;
    const floor = 1 - diagonal / sun_distance;
    const extent =
      (Math.abs(direction.x) * size.width +
        Math.abs(direction.y) * size.height) /
      2;
    const beam_start = inverted ? sun_distance + extent : sun_distance - extent;
    const title_start = inverted
      ? Math.max(sun_distance - extent, 1)
      : sun_distance + extent;
    const end = sun_distance * (inverted ? reach : floor);

    const spectrum = (
      target: CanvasRenderingContext2D,
      [hue, saturation, lightness]: readonly [number, number, number],
      from: number,
    ) => {
      const gradient = target.createLinearGradient(
        sun.x + axis.x * from,
        sun.y + axis.y * from,
        sun.x + axis.x * end,
        sun.y + axis.y * end,
      );
      for (let stop = 0; stop <= GRADIENT_STOPS; stop++) {
        const along = stop / GRADIENT_STOPS;
        const turn =
          (2 * Math.log((from + along * (end - from)) / from)) /
          Math.log(end / from);
        const ramp = Math.min(1, Math.max(0, turn / SPECTRAL_RAMP));
        gradient.addColorStop(
          along,
          `hsl(${(((hue + turn * 360) % 360) + 360) % 360} ${saturation + (RAINBOW[1] - saturation) * ramp}% ${lightness + (RAINBOW[2] - lightness) * ramp}%)`,
        );
      }
      return gradient;
    };

    const paint_shadow = (colored: boolean) => {
      const palette = dark ? DARK_FLAG : LIGHT_FLAG;
      const regions = colored
        ? scene.thirds.map((third, index) => ({
            ...third,
            base: palette[index] ?? RAINBOW,
          }))
        : [{ base: RAINBOW, mask, origin, size }];

      layer_context.setTransform(1, 0, 0, 1, 0, 0);
      layer_context.globalCompositeOperation = "source-over";
      layer_context.clearRect(0, 0, layer.width, layer.height);

      for (const region of regions) {
        beam_context.setTransform(1, 0, 0, 1, 0, 0);
        beam_context.globalCompositeOperation = "source-over";
        beam_context.clearRect(0, 0, beam.width, beam.height);
        beam_context.setTransform(
          SHADOW_RESOLUTION,
          0,
          0,
          SHADOW_RESOLUTION,
          0,
          0,
        );

        for (let step = SHADOW_STEPS; step >= 1; step--) {
          const progress = step / SHADOW_STEPS;
          const scale = (inverted ? reach : floor) ** progress;

          beam_context.globalAlpha = 0.01 + 0.125 * (1 - progress) ** 6;
          beam_context.drawImage(
            region.mask,
            sun.x + (region.origin.x - sun.x) * scale,
            sun.y + (region.origin.y - sun.y) * scale,
            region.size.width * scale,
            region.size.height * scale,
          );
        }

        beam_context.globalAlpha = 1;
        beam_context.globalCompositeOperation = "source-in";
        beam_context.fillStyle = spectrum(
          beam_context,
          region.base,
          colored ? beam_start : title_start,
        );
        beam_context.fillRect(0, 0, scene.width, scene.height);
        layer_context.drawImage(beam, 0, 0);
      }

      if (dark) {
        layer_context.globalCompositeOperation = "lighter";
        layer_context.drawImage(layer, 0, 0);
      }
    };

    const paint_title = (colored: boolean) => {
      tint_context.setTransform(1, 0, 0, 1, 0, 0);
      tint_context.globalCompositeOperation = "source-over";
      tint_context.clearRect(0, 0, tint.width, tint.height);
      tint_context.drawImage(logo.mask, 0, 0);
      tint_context.globalCompositeOperation = "source-in";
      tint_context.setTransform(
        ratio,
        0,
        0,
        ratio,
        (logo.padding - origin.x) * ratio,
        (logo.padding - origin.y) * ratio,
      );
      tint_context.fillStyle = colored
        ? flag({
            dark,
            from: origin.x,
            target: tint_context,
            to: origin.x + size.width,
          })
        : spectrum(tint_context, RAINBOW, title_start);
      tint_context.fillRect(
        origin.x - logo.padding,
        origin.y - logo.padding,
        tint.width / ratio,
        tint.height / ratio,
      );
      if (colored && !dark) {
        tint_context.setTransform(1, 0, 0, 1, 0, 0);
        tint_context.globalCompositeOperation = "destination-over";
        for (const [x, y] of [
          [-1, 0],
          [1, 0],
          [0, -1],
          [0, 1],
        ] as const) {
          tint_context.drawImage(logo.ink, x * logo.outline, y * logo.outline);
        }
      }
    };

    const eased = mix * mix * (3 - 2 * mix);
    const passes = [
      { alpha: 1 - eased, colored: false },
      { alpha: eased, colored: true },
    ].filter(({ alpha }) => alpha > 0);
    const logo_at = {
      x: (origin.x - logo.padding) * ratio,
      y: (origin.y - logo.padding) * ratio,
    };

    context.setTransform(1, 0, 0, 1, 0, 0);
    context.clearRect(0, 0, sky.width, sky.height);
    for (const { alpha, colored } of passes) {
      paint_shadow(colored);
      context.globalAlpha = alpha;
      context.drawImage(layer, 0, 0, sky.width, sky.height);
    }
    context.globalAlpha = 1;
    if (logo.halo) context.drawImage(logo.halo, logo_at.x, logo_at.y);
    for (const { alpha, colored } of passes) {
      paint_title(colored);
      context.globalAlpha = alpha;
      context.drawImage(tint, logo_at.x, logo_at.y);
    }
    context.globalAlpha = 1;

    if (last_time) frame = requestAnimationFrame(draw);

    if (document.fonts.status === "loaded") {
      sky.parentElement?.setAttribute("data-painted", "");
    }
  };

  const move_light = (x: number, y: number) => {
    pointer = { x, y };
    frame ||= requestAnimationFrame(draw);
  };

  const remeasure = () => {
    stale = true;
    frame ||= requestAnimationFrame(draw);
  };

  document.fonts.ready.then(remeasure);
  window.addEventListener("resize", remeasure);
  window.addEventListener("scroll", remeasure, { passive: true });
  new MutationObserver(remeasure).observe(document.documentElement, {
    attributeFilter: ["class"],
  });

  for (const button of document.querySelectorAll<HTMLButtonElement>(
    'main form button[type="submit"]',
  )) {
    const salute = (on: boolean) => () => {
      tricolore = on;
      frame ||= requestAnimationFrame(draw);
    };
    button.addEventListener("pointerenter", salute(true));
    button.addEventListener("pointerleave", salute(false));
    button.addEventListener("focus", salute(true));
    button.addEventListener("blur", salute(false));
  }

  window.addEventListener("click", ({ target }) => {
    if (
      target instanceof Element &&
      target.closest("a, button, input, label, select, textarea")
    ) {
      return;
    }
    inverted = !inverted;
    frame ||= requestAnimationFrame(draw);
  });

  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  window.addEventListener("pointermove", ({ clientX, clientY }) =>
    move_light(clientX - scene.left, clientY - scene.top),
  );

  window.addEventListener("deviceorientation", ({ beta, gamma }) => {
    if (beta === null || gamma === null) return;
    move_light(
      scene.width / 2 - (gamma / 45) * scene.width,
      scene.height / 2 - ((beta - 45) / 45) * scene.height,
    );
  });

  const request_permission: unknown = Reflect.get(
    DeviceOrientationEvent,
    "requestPermission",
  );
  if (typeof request_permission === "function") {
    document.addEventListener(
      "pointerdown",
      () => request_permission.call(DeviceOrientationEvent),
      { once: true },
    );
  }
}

function measure_scene({
  sky,
  title,
}: {
  sky: HTMLCanvasElement;
  title: HTMLElement;
}) {
  const sky_box = sky.getBoundingClientRect();
  const title_box = title.getBoundingClientRect();
  const ratio = window.devicePixelRatio;
  const style = getComputedStyle(title);
  const font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
  const text = title.textContent?.trim() ?? "";

  sky.width = Math.round(sky_box.width * ratio);
  sky.height = Math.round(sky_box.height * ratio);
  const dark = document.documentElement.classList.contains("dark");
  const mask = paint_text({
    box: title_box,
    font,
    padding: 0,
    resolution: MASK_RESOLUTION,
    text,
  });
  const origin = {
    x: title_box.left - sky_box.left,
    y: title_box.top - sky_box.top,
  };
  const third_width = title_box.width / 3;
  const crop_width = Math.ceil(mask.width / 3);
  const thirds = [0, 1, 2].map((index) => {
    const third = document.createElement("canvas");
    third.width = crop_width;
    third.height = mask.height;
    third
      .getContext("2d")
      ?.drawImage(
        mask,
        index * crop_width,
        0,
        crop_width,
        mask.height,
        0,
        0,
        crop_width,
        mask.height,
      );
    return {
      mask: third,
      origin: { x: origin.x + index * third_width, y: origin.y },
      size: { height: title_box.height, width: third_width },
    };
  });

  return {
    dark,
    height: sky_box.height,
    left: sky_box.left,
    logo: paint_logo({ box: title_box, font, ratio, text, title }),
    mask,
    origin,
    ratio,
    size: { height: title_box.height, width: title_box.width },
    thirds,
    top: sky_box.top,
    width: sky_box.width,
  };
}

function paint_logo({
  box,
  font,
  ratio,
  text,
  title,
}: {
  box: DOMRect;
  font: string;
  ratio: number;
  text: string;
  title: HTMLElement;
}) {
  const halo = /^(rgba?\([^)]*\)) [\d.-]+px [\d.-]+px ([\d.]+)px/.exec(
    getComputedStyle(title).textShadow,
  );
  const blur = halo ? Number(halo[2]) : 0;
  const padding = blur * 2;
  const mask = paint_text({ box, font, padding, resolution: ratio, text });
  const ink = document.createElement("canvas");
  ink.width = mask.width;
  ink.height = mask.height;
  const ink_context = ink.getContext("2d");
  if (ink_context) {
    ink_context.drawImage(mask, 0, 0);
    ink_context.globalCompositeOperation = "source-in";
    ink_context.fillStyle = "#161616";
    ink_context.fillRect(0, 0, ink.width, ink.height);
  }
  const outline = Math.max(1, box.height * 0.012) * ratio;
  if (!halo) return { halo: undefined, ink, mask, outline, padding };

  const glow = document.createElement("canvas");
  glow.width = mask.width;
  glow.height = mask.height;
  const glow_context = glow.getContext("2d");
  if (!glow_context) return { halo: undefined, ink, mask, outline, padding };

  glow_context.shadowBlur = blur * ratio;
  glow_context.shadowColor = halo[1] ?? "transparent";
  glow_context.shadowOffsetX = glow.width;
  glow_context.drawImage(mask, -glow.width, 0);

  return { halo: glow, ink, mask, outline, padding };
}

function flag({
  dark,
  from,
  target,
  to,
}: {
  dark: boolean;
  from: number;
  target: CanvasRenderingContext2D;
  to: number;
}) {
  const palette = dark ? DARK_FLAG : LIGHT_FLAG;
  const gradient = target.createLinearGradient(from, 0, to, 0);
  palette.forEach(([hue, saturation, lightness], index) => {
    const color = `hsl(${hue} ${saturation}% ${lightness}%)`;
    gradient.addColorStop(index / palette.length, color);
    gradient.addColorStop((index + 1) / palette.length, color);
  });
  return gradient;
}

function paint_text({
  box,
  font,
  padding,
  resolution,
  text,
}: {
  box: DOMRect;
  font: string;
  padding: number;
  resolution: number;
  text: string;
}) {
  const canvas = document.createElement("canvas");
  canvas.width = Math.ceil((box.width + padding * 2) * resolution);
  canvas.height = Math.ceil((box.height + padding * 2) * resolution);
  const context = canvas.getContext("2d");
  if (!context) return canvas;

  context.scale(resolution, resolution);
  context.font = font;
  context.fillStyle = "#fff";
  context.fillText(
    text,
    padding,
    padding + context.measureText(text).fontBoundingBoxAscent,
  );

  return canvas;
}
