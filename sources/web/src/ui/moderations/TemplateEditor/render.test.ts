import { describe, expect, it } from "bun:test";
import { AVAILABLE_VARIABLES, render, SAMPLE_DATA } from "./render";

describe("render", () => {
  it("replaces known variables with their values", () => {
    const result = render(
      "Hello ${ given_name } ${ family_name }!",
      SAMPLE_DATA,
    );

    expect(result.result).toBe("Hello Jean Dupont!");
    expect(result.missing).toEqual([]);
    expect(result.ok).toBe(true);
  });

  it("handles empty template", () => {
    const result = render("", SAMPLE_DATA);

    expect(result.result).toBe("");
    expect(result.ok).toBe(true);
  });

  it("handles template with no variables", () => {
    const result = render("Plain text message", SAMPLE_DATA);

    expect(result.result).toBe("Plain text message");
    expect(result.ok).toBe(true);
  });

  it("reports missing variables and keeps them in output", () => {
    const result = render("Hello ${ unknown_var }!", SAMPLE_DATA);

    expect(result.result).toBe("Hello ${ unknown_var }!");
    expect(result.missing).toEqual(["unknown_var"]);
    expect(result.ok).toBe(false);
  });

  it("handles mix of known and unknown variables", () => {
    const result = render(
      "Dear ${ given_name }, your ID is ${ user_id }",
      SAMPLE_DATA,
    );

    expect(result.result).toBe("Dear Jean, your ID is ${ user_id }");
    expect(result.missing).toEqual(["user_id"]);
    expect(result.ok).toBe(false);
  });

  it("ignores old {key} syntax", () => {
    const result = render("{given_name} {foo}", SAMPLE_DATA);

    expect(result.result).toBe("{given_name} {foo}");
    expect(result.ok).toBe(true);
  });

  it("blocks prototype pollution attempts", () => {
    const data = { normal: "value" };
    const result = render("${ __proto__ } ${ constructor } ${ normal }", data);

    expect(result.result).toBe("${ __proto__ } ${ constructor } value");
    expect(result.missing).toEqual(["__proto__", "constructor"]);
  });

  it("handles all available variables", () => {
    const template = AVAILABLE_VARIABLES.map(
      (v) => `${v.key}=\${ ${v.key} }`,
    ).join("\n");
    const result = render(template, SAMPLE_DATA);

    expect(result.ok).toBe(true);
    expect(result.result).toMatchInlineSnapshot(`
      "categorie_juridique=Commune
      domain=paris.fr
      email=jean.dupont@paris.fr
      family_name=Dupont
      given_name=Jean
      organization_name=Mairie de Paris
      siret=21750001600019"
    `);
  });

  it("handles variable with no spaces", () => {
    const result = render("Hello ${given_name}!", SAMPLE_DATA);

    expect(result.result).toBe("Hello Jean!");
    expect(result.ok).toBe(true);
  });

  it("handles variable with extra spaces", () => {
    const result = render("Hello ${  given_name  }!", SAMPLE_DATA);

    expect(result.result).toBe("Hello Jean!");
    expect(result.ok).toBe(true);
  });
});
