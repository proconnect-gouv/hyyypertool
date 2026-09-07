{
  description = "hyyypertool flake";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs?ref=nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs =
    inputs:
    inputs.flake-utils.lib.eachDefaultSystem (
      system:
      let
        pkgs = import inputs.nixpkgs {
          inherit system;
          # nixpkgs' cypress at this version is flagged for its bundled
          # Electron's EOL/CVEs; we run it locally/dev-only, not exposed.
          config.permittedInsecurePackages = [ "cypress-15.21.1" ];
        };

        # pin to match "cypress" in e2e/package.json exactly — nixpkgs-unstable's
        # cypress drifts from it otherwise. Bump both together.
        cypress = pkgs.cypress.overrideAttrs (old: rec {
          version = "15.21.1";
          src = pkgs.fetchurl {
            url = "https://cdn.cypress.io/desktop/${version}/linux-x64/cypress.zip";
            hash = "sha256-kGyqDNDlARLrJY5yoB4iIKUPibLuvtDUmlplaEMNR/4=";
          };
        });
      in
      {
        devShells.default = pkgs.mkShell {
          # matches "engines.node" in package.json (24.19.0); npm ships with nodejs
          packages = [
            pkgs.nodejs_24
            pkgs.bun
            cypress
          ];

          # npm's downloaded Cypress binary can't dynamically link on NixOS;
          # run nixpkgs' (version-pinned, see above) Cypress instead.
          #
          # CYPRESS_SKIP_VERIFY: the store path is read-only, and Cypress'
          # verify step tries to write binary_state.json next to the binary
          # (cypress-io/cypress#30684) — skip it, npm's cypress CLI still runs.
          shellHook = ''
            export CYPRESS_INSTALL_BINARY=0
            export CYPRESS_RUN_BINARY="${cypress}/bin/Cypress"
            export CYPRESS_SKIP_VERIFY=true
          '';
        };
      }
    );
}
