import { type AppEnv } from "#src/config";
declare const app: import("hono/hono-base").HonoBase<
  {
    Bindings: AppEnv;
  } & import("#src/middleware/nonce").NonceVariablesContext &
    import("#src/middleware/fetch").FetchVariablesContext &
    import("#src/config").AppEnvContext &
    import("#src/middleware/auth").UserInfoVariablesContext &
    import("#src/middleware/crisp").CrispClientContext &
    import("#src/middleware/identite-pg").IdentiteProconnectPgContext &
    import("#src/middleware/hyyyperbase").HyyyperbasePgContext,
  | ({
      "/healthz": {
        $get: {
          input: {};
          output: "healthz check passed";
          outputFormat: "text";
          status: import("hono/utils/http-status").ContentfulStatusCode;
        };
      };
    } & {
      "/livez": {
        $get: {
          input: {};
          output: "livez check passed";
          outputFormat: "text";
          status: import("hono/utils/http-status").ContentfulStatusCode;
        };
      };
    })
  | import("hono/types").MergeSchemaPath<
      {
        "/bundle/config.js": {
          $get: {
            input: {};
            output: `export default ${string}`;
            outputFormat: "text";
            status: 200;
          };
        };
      } & {
        "/bundle/env.js": {
          $get: {
            input: {};
            output: `export default ${string}`;
            outputFormat: "text";
            status: 200;
          };
        };
      },
      `/assets/${string}`
    >
  | import("hono/types").MergeSchemaPath<
      {
        "/": {
          $get: {
            input: {};
            output: "readyz check passed";
            outputFormat: "text";
            status: import("hono/utils/http-status").ContentfulStatusCode;
          };
        };
      } & {
        "/drizzle/identite": {
          $get: {
            input: {};
            output: string;
            outputFormat: "text";
            status: import("hono/utils/http-status").ContentfulStatusCode;
          };
        };
      } & {
        "/drizzle/hyyyperbase": {
          $get: {
            input: {};
            output: string;
            outputFormat: "text";
            status: import("hono/utils/http-status").ContentfulStatusCode;
          };
        };
      },
      "/readyz"
    >
  | import("hono/types").MergeSchemaPath<
      {
        "/localhost:3000/*": {
          $get: {
            input: {};
            output: undefined;
            outputFormat: "redirect";
            status: 302;
          };
        };
      },
      "/proxy"
    >
  | import("hono/types").MergeSchemaPath<
      {
        "/": {
          $get: {
            input: {};
            output: {};
            outputFormat: string;
            status: import("hono/utils/http-status").StatusCode;
          };
        };
      },
      "/"
    >
  | import("hono/types").MergeSchemaPath<
      | import("hono/types").BlankSchema
      | import("hono/types").MergeSchemaPath<
          {
            "/reload": {
              $post: {
                input: {};
                output: "ok";
                outputFormat: "text";
                status: import("hono/utils/http-status").ContentfulStatusCode;
              };
            };
          } & {
            "/reload": {
              $get: {
                input: {};
                output: {};
                outputFormat: string;
                status: import("hono/utils/http-status").StatusCode;
              };
            };
          },
          "/"
        >
      | import("hono/types").MergeSchemaPath<
          {
            "/design-system": {
              $get: {
                input: {};
                output: {};
                outputFormat: string;
                status: import("hono/utils/http-status").StatusCode;
              };
            };
          } & {
            "/design-system/dsfr": {
              $get: {
                input: {};
                output: {};
                outputFormat: string;
                status: import("hono/utils/http-status").StatusCode;
              };
            };
          } & {
            "/design-system/tailwind": {
              $get: {
                input: {};
                output: {};
                outputFormat: string;
                status: import("hono/utils/http-status").StatusCode;
              };
            };
          },
          "/"
        >
      | import("hono/types").MergeSchemaPath<
          {
            "/.well-known/openid-configuration": {
              $get: {
                input: {};
                output: {
                  issuer: string;
                  authorization_endpoint: string;
                  token_endpoint: string;
                  userinfo_endpoint: string;
                  jwks_uri: string;
                  end_session_endpoint: string;
                  response_types_supported: string[];
                  subject_types_supported: string[];
                  id_token_signing_alg_values_supported: string[];
                  scopes_supported: string[];
                  claims_supported: string[];
                  acr_values_supported: string[];
                  code_challenge_methods_supported: string[];
                  grant_types_supported: string[];
                  token_endpoint_auth_methods_supported: string[];
                };
                outputFormat: "json";
                status: import("hono/utils/http-status").ContentfulStatusCode;
              };
            };
          } & {
            "/jwks": {
              $get: {
                input: {};
                output: {
                  keys: {
                    alg: string;
                    use: string;
                    crv?: string | undefined;
                    d?: string | undefined;
                    dp?: string | undefined;
                    dq?: string | undefined;
                    e?: string | undefined;
                    k?: string | undefined;
                    n?: string | undefined;
                    p?: string | undefined;
                    q?: string | undefined;
                    qi?: string | undefined;
                    x?: string | undefined;
                    y?: string | undefined;
                    pub?: string | undefined;
                    priv?: string | undefined;
                    kty?: string | undefined;
                    key_ops?: string[] | undefined;
                    ext?: boolean | undefined;
                    x5c?: string[] | undefined;
                    x5t?: string | undefined;
                    "x5t#S256"?: string | undefined;
                    x5u?: string | undefined;
                    kid?: string | undefined;
                  }[];
                };
                outputFormat: "json";
                status: import("hono/utils/http-status").ContentfulStatusCode;
              };
            };
          } & {
            "/authorize": {
              $get:
                | {
                    input: {
                      query: {
                        client_id: string;
                        nonce: string;
                        redirect_uri: string;
                        state: string;
                      };
                    };
                    output: undefined;
                    outputFormat: "redirect";
                    status: 302;
                  }
                | {
                    input: {
                      query: {
                        client_id: string;
                        nonce: string;
                        redirect_uri: string;
                        state: string;
                      };
                    };
                    output: import("zod").ZodSafeParseError<{
                      client_id: string;
                      nonce: string;
                      redirect_uri: string;
                      state: string;
                    }>;
                    outputFormat: "json";
                    status: 400;
                  };
            };
          } & {
            "/interaction/:code/login": {
              $get: {
                input: {
                  param: {
                    code: string;
                  };
                };
                output: {};
                outputFormat: string;
                status: import("hono/utils/http-status").StatusCode;
              };
            };
          } & {
            "/interaction/:code/login": {
              $post: {
                input: {
                  param: {
                    code: string;
                  };
                };
                output: {};
                outputFormat: string;
                status: import("hono/utils/http-status").StatusCode;
              };
            };
          } & {
            "/token": {
              $post:
                | {
                    input: {};
                    output: {
                      error: string;
                    };
                    outputFormat: "json";
                    status: 400;
                  }
                | {
                    input: {};
                    output: {
                      access_token: string;
                      token_type: string;
                      expires_in: number;
                      id_token: string;
                    };
                    outputFormat: "json";
                    status: import("hono/utils/http-status").ContentfulStatusCode;
                  };
            };
          } & {
            "/session/end": {
              $get:
                | {
                    input: {
                      query: {
                        post_logout_redirect_uri: string;
                        state: string;
                      };
                    };
                    output: {};
                    outputFormat: string;
                    status: import("hono/utils/http-status").StatusCode;
                  }
                | {
                    input: {
                      query: {
                        post_logout_redirect_uri: string;
                        state: string;
                      };
                    };
                    output: import("zod").ZodSafeParseError<{
                      post_logout_redirect_uri: string;
                      state: string;
                    }>;
                    outputFormat: "json";
                    status: 400;
                  };
            };
          },
          "/auth.agentconnect.gouv.fr/api/v2"
        >
      | import("hono/types").MergeSchemaPath<
          {
            "/readyz": {
              $get: {
                input: {};
                output: "readyz check passed";
                outputFormat: "text";
                status: import("hono/utils/http-status").ContentfulStatusCode;
              };
            };
          } & {
            "/v1/website/:website_id/conversations": {
              $delete: {
                input: {
                  param: {
                    website_id: string;
                  };
                };
                output: {};
                outputFormat: "json";
                status: 200;
              };
            };
          } & {
            "/v1/website/:website_id/conversations": {
              $get: {
                input: {
                  param: {
                    website_id: string;
                  };
                };
                output: {
                  data: {
                    session_id: string;
                    messages: {
                      session_id: string;
                      website_id: string;
                      content: string;
                      type: string;
                      from: string;
                      origin: string;
                      user: {
                        [x: string]: import("hono/utils/types").JSONValue;
                      };
                      fingerprint: number;
                      timestamp: number;
                      edited: boolean;
                      read: string;
                      delivered: string;
                    }[];
                  }[];
                };
                outputFormat: "json";
                status: import("hono/utils/http-status").ContentfulStatusCode;
              };
            };
          } & {
            "/v1/website/:website_id/conversation/:session_id": {
              $get: {
                input: {
                  param: {
                    session_id: string;
                  } & {
                    website_id: string;
                  };
                };
                output: {
                  data: {
                    created_at: number;
                    last_message: string;
                    meta: {
                      avatar: string;
                      data: {};
                      device: {};
                      email: string;
                      ip: string;
                      nickname: string;
                      phone: string;
                      segments: never[];
                      subject: string;
                    };
                  };
                };
                outputFormat: "json";
                status: import("hono/utils/http-status").ContentfulStatusCode;
              };
            };
          } & {
            "/v1/website/:website_id/conversation": {
              $post: {
                input: {
                  param: {
                    website_id: string;
                  };
                };
                output: {
                  data: {
                    session_id: string;
                  };
                };
                outputFormat: "json";
                status: import("hono/utils/http-status").ContentfulStatusCode;
              };
            };
          } & {
            "/v1/website/:website_id/conversation/:session_id/message": {
              $post: {
                input: {
                  param: {
                    session_id: string;
                  } & {
                    website_id: string;
                  };
                };
                output: {
                  data: {
                    fingerprint: number;
                  };
                };
                outputFormat: "json";
                status: import("hono/utils/http-status").ContentfulStatusCode;
              };
            };
          } & {
            "/v1/website/:website_id/conversation/:session_id/messages": {
              $get: {
                input: {
                  param: {
                    session_id: string;
                  } & {
                    website_id: string;
                  };
                };
                output: {
                  data: {
                    session_id: string;
                    website_id: string;
                    content: string;
                    type: string;
                    from: string;
                    origin: string;
                    user: {
                      [x: string]: import("hono/utils/types").JSONValue;
                    };
                    fingerprint: number;
                    timestamp: number;
                    edited: boolean;
                    read: string;
                    delivered: string;
                  }[];
                };
                outputFormat: "json";
                status: import("hono/utils/http-status").ContentfulStatusCode;
              };
            };
          } & {
            "/v1/website/:website_id/conversation/:session_id/meta": {
              $patch: {
                input: {
                  param: {
                    session_id: string;
                  } & {
                    website_id: string;
                  };
                };
                output: {};
                outputFormat: "json";
                status: import("hono/utils/http-status").ContentfulStatusCode;
              };
            };
          } & {
            "/v1/website/:website_id/conversation/:session_id/state": {
              $patch: {
                input: {
                  param: {
                    session_id: string;
                  } & {
                    website_id: string;
                  };
                };
                output: {};
                outputFormat: "json";
                status: import("hono/utils/http-status").ContentfulStatusCode;
              };
            };
          } & {
            "/v1/website/:website_id/operators/list": {
              $get: {
                input: {
                  param: {
                    website_id: string;
                  };
                };
                output: {
                  data: {
                    details: {
                      email: string;
                      first_name: string;
                      last_name: string;
                      user_id: string;
                    };
                  }[];
                };
                outputFormat: "json";
                status: import("hono/utils/http-status").ContentfulStatusCode;
              };
            };
          },
          "/api.crisp.chat"
        >
      | import("hono/types").MergeSchemaPath<
          {
            "/readyz": {
              $get: {
                input: {};
                output: "readyz check passed";
                outputFormat: "text";
                status: import("hono/utils/http-status").ContentfulStatusCode;
              };
            };
          } & {
            "/v4/djepva/api-association/associations/:siren_or_rna": {
              $get: {
                input: {
                  param: {
                    siren_or_rna: string;
                  };
                };
                output: {};
                outputFormat: "json";
                status: import("hono/utils/http-status").ContentfulStatusCode;
              };
            };
          } & {
            "/proxy/files/:id": {
              $get: {
                input: {
                  param: {
                    id: string;
                  };
                };
                output: `${string} - Requested GET on /proxy/files/${string}`;
                outputFormat: "text";
                status: import("hono/utils/http-status").ContentfulStatusCode;
              };
            };
          },
          "/entreprise.api.gouv.fr"
        >,
      "/___dev___"
    >
  | import("hono/types").MergeSchemaPath<
      {
        "/login": {
          $post: {
            input: {};
            output: undefined;
            outputFormat: "redirect";
            status: 302;
          };
        };
      } & {
        "/login/callback": {
          $get:
            | {
                input: {
                  query: {
                    code: string;
                    iss: string;
                    state: string;
                  };
                };
                output: undefined;
                outputFormat: "redirect";
                status: 302;
              }
            | {
                input: {
                  query: {
                    code: string;
                    iss: string;
                    state: string;
                  };
                };
                output: import("zod").ZodSafeParseError<{
                  code: string;
                  iss: string;
                  state: string;
                }>;
                outputFormat: "json";
                status: 400;
              };
        };
      } & {
        "/logout": {
          $get: {
            input: {};
            output: undefined;
            outputFormat: "redirect";
            status: 302;
          };
        };
      } & {
        "/logout/callback": {
          $get:
            | {
                input: {
                  query: {
                    state: string;
                  };
                };
                output: undefined;
                outputFormat: "redirect";
                status: 302;
              }
            | {
                input: {
                  query: {
                    state: string;
                  };
                };
                output: import("zod").ZodSafeParseError<{
                  state: string;
                }>;
                outputFormat: "json";
                status: 400;
              };
        };
      },
      "/auth"
    >
  | import("hono/types").MergeSchemaPath<
      (
        | import("hono/types").BlankSchema
        | import("hono/types").MergeSchemaPath<
            | {
                "/": {
                  $get:
                    | {
                        input: {
                          param: {
                            id: string;
                          };
                        };
                        output: import("zod").ZodSafeParseError<{
                          id: number;
                        }>;
                        outputFormat: "json";
                        status: 400;
                      }
                    | {
                        input: {
                          param: {
                            id: string;
                          };
                        };
                        output: {};
                        outputFormat: string;
                        status: import("hono/utils/http-status").StatusCode;
                      };
                };
              }
            | import("hono/types").MergeSchemaPath<
                {
                  "/": {
                    $get:
                      | {
                          input: {
                            param: {
                              id: string;
                            };
                          } & {
                            query: {
                              describedby: string;
                            };
                          };
                          output: {};
                          outputFormat: string;
                          status: import("hono/utils/http-status").StatusCode;
                        }
                      | {
                          input: {
                            param: {
                              id: string;
                            };
                          } & {
                            query: {
                              describedby: string;
                            };
                          };
                          output: import("zod").ZodSafeParseError<{
                            id: number;
                          }>;
                          outputFormat: "json";
                          status: 400;
                        }
                      | {
                          input: {
                            param: {
                              id: string;
                            };
                          } & {
                            query: {
                              describedby: string;
                            };
                          };
                          output: import("zod").ZodSafeParseError<{
                            describedby: string;
                          }>;
                          outputFormat: "json";
                          status: 400;
                        };
                  };
                },
                "/email"
              >
            | import("hono/types").MergeSchemaPath<
                {
                  "/": {
                    $get:
                      | {
                          input: {
                            param: {
                              id: string;
                            };
                          } & {
                            query: {
                              organization_id: string | string[];
                              user_id: string | string[];
                            };
                          };
                          output: {};
                          outputFormat: string;
                          status: import("hono/utils/http-status").StatusCode;
                        }
                      | {
                          input: {
                            param: {
                              id: string;
                            };
                          } & {
                            query: {
                              organization_id: string | string[];
                              user_id: string | string[];
                            };
                          };
                          output: import("zod").ZodSafeParseError<{
                            id: number;
                          }>;
                          outputFormat: "json";
                          status: 400;
                        }
                      | {
                          input: {
                            param: {
                              id: string;
                            };
                          } & {
                            query: {
                              organization_id: string | string[];
                              user_id: string | string[];
                            };
                          };
                          output: import("zod").ZodSafeParseError<{
                            organization_id: number;
                            user_id: number;
                          }>;
                          outputFormat: "json";
                          status: 400;
                        };
                  };
                },
                "/duplicate_warning"
              >
            | import("hono/types").MergeSchemaPath<
                {
                  "/": {
                    $patch:
                      | {
                          input: {
                            param: {
                              id: string;
                            };
                          } & {
                            form: {
                              add_member: "AS_INTERNAL" | "AS_EXTERNAL";
                              add_domain?: string | undefined;
                              send_notification?: string | undefined;
                              verification_type?:
                                | "domain"
                                | "organization_dirigeant"
                                | "code_sent_to_official_contact_email"
                                | "imported_from_coop_mediation_numerique"
                                | "imported_from_inclusion_connect"
                                | "in_liste_dirigeants_rna"
                                | "in_liste_dirigeants_rne"
                                | "official_contact_email"
                                | "ordre_professionnel_domain"
                                | "proof_received"
                                | "verified_by_coop_mediation_numerique"
                                | "bypassed"
                                | "domain_not_verified_yet"
                                | "no_validation_means_available"
                                | "no_verification_means_for_entreprise_unipersonnelle"
                                | "no_verification_means_for_small_association"
                                | "no_verification_means_for_small_organization"
                                | undefined;
                            };
                          };
                          output: {};
                          outputFormat: string;
                          status: import("hono/utils/http-status").StatusCode;
                        }
                      | {
                          input: {
                            param: {
                              id: string;
                            };
                          } & {
                            form: {
                              add_member: "AS_INTERNAL" | "AS_EXTERNAL";
                              add_domain?: string | undefined;
                              send_notification?: string | undefined;
                              verification_type?:
                                | "domain"
                                | "organization_dirigeant"
                                | "code_sent_to_official_contact_email"
                                | "imported_from_coop_mediation_numerique"
                                | "imported_from_inclusion_connect"
                                | "in_liste_dirigeants_rna"
                                | "in_liste_dirigeants_rne"
                                | "official_contact_email"
                                | "ordre_professionnel_domain"
                                | "proof_received"
                                | "verified_by_coop_mediation_numerique"
                                | "bypassed"
                                | "domain_not_verified_yet"
                                | "no_validation_means_available"
                                | "no_verification_means_for_entreprise_unipersonnelle"
                                | "no_verification_means_for_small_association"
                                | "no_verification_means_for_small_organization"
                                | undefined;
                            };
                          };
                          output: import("zod").ZodSafeParseError<{
                            id: number;
                          }>;
                          outputFormat: "json";
                          status: 400;
                        }
                      | {
                          input: {
                            param: {
                              id: string;
                            };
                          } & {
                            form: {
                              add_member: "AS_INTERNAL" | "AS_EXTERNAL";
                              add_domain?: string | undefined;
                              send_notification?: string | undefined;
                              verification_type?:
                                | "domain"
                                | "organization_dirigeant"
                                | "code_sent_to_official_contact_email"
                                | "imported_from_coop_mediation_numerique"
                                | "imported_from_inclusion_connect"
                                | "in_liste_dirigeants_rna"
                                | "in_liste_dirigeants_rne"
                                | "official_contact_email"
                                | "ordre_professionnel_domain"
                                | "proof_received"
                                | "verified_by_coop_mediation_numerique"
                                | "bypassed"
                                | "domain_not_verified_yet"
                                | "no_validation_means_available"
                                | "no_verification_means_for_entreprise_unipersonnelle"
                                | "no_verification_means_for_small_association"
                                | "no_verification_means_for_small_organization"
                                | undefined;
                            };
                          };
                          output: import("zod").ZodSafeParseError<{
                            add_domain: boolean;
                            add_member: "AS_INTERNAL" | "AS_EXTERNAL";
                            send_notification: boolean;
                            verification_type?:
                              | "domain"
                              | "organization_dirigeant"
                              | "code_sent_to_official_contact_email"
                              | "imported_from_coop_mediation_numerique"
                              | "imported_from_inclusion_connect"
                              | "in_liste_dirigeants_rna"
                              | "in_liste_dirigeants_rne"
                              | "official_contact_email"
                              | "ordre_professionnel_domain"
                              | "proof_received"
                              | "verified_by_coop_mediation_numerique"
                              | "bypassed"
                              | "domain_not_verified_yet"
                              | "no_validation_means_available"
                              | "no_verification_means_for_entreprise_unipersonnelle"
                              | "no_verification_means_for_small_association"
                              | "no_verification_means_for_small_organization"
                              | undefined;
                          }>;
                          outputFormat: "json";
                          status: 400;
                        };
                  };
                },
                "/validate"
              >
            | import("hono/types").MergeSchemaPath<
                {
                  "/reason/:response_id": {
                    $get:
                      | {
                          input: {
                            param: {
                              id: string;
                              response_id: string;
                            };
                          };
                          output: string;
                          outputFormat: "text";
                          status: import("hono/utils/http-status").ContentfulStatusCode;
                        }
                      | {
                          input: {
                            param: {
                              id: string;
                              response_id: string;
                            };
                          };
                          output: import("zod").ZodSafeParseError<{
                            id: number;
                            response_id: number;
                          }>;
                          outputFormat: "json";
                          status: 400;
                        };
                  };
                } & {
                  "/": {
                    $patch:
                      | {
                          input: {
                            param: {
                              id: string;
                            };
                          } & {
                            form: {
                              message:
                                | import("hono/types").ParsedFormValue
                                | import("hono/types").ParsedFormValue[];
                              subject:
                                | import("hono/types").ParsedFormValue
                                | import("hono/types").ParsedFormValue[];
                              end_user_reason:
                                | import("hono/types").ParsedFormValue
                                | import("hono/types").ParsedFormValue[];
                              allow_editing:
                                | import("hono/types").ParsedFormValue
                                | import("hono/types").ParsedFormValue[];
                            };
                          };
                          output: "OK";
                          outputFormat: "text";
                          status: 200;
                        }
                      | {
                          input: {
                            param: {
                              id: string;
                            };
                          } & {
                            form: {
                              message:
                                | import("hono/types").ParsedFormValue
                                | import("hono/types").ParsedFormValue[];
                              subject:
                                | import("hono/types").ParsedFormValue
                                | import("hono/types").ParsedFormValue[];
                              end_user_reason:
                                | import("hono/types").ParsedFormValue
                                | import("hono/types").ParsedFormValue[];
                              allow_editing:
                                | import("hono/types").ParsedFormValue
                                | import("hono/types").ParsedFormValue[];
                            };
                          };
                          output: import("zod").ZodSafeParseError<{
                            id: number;
                          }>;
                          outputFormat: "json";
                          status: 400;
                        }
                      | {
                          input: {
                            param: {
                              id: string;
                            };
                          } & {
                            form: {
                              message:
                                | import("hono/types").ParsedFormValue
                                | import("hono/types").ParsedFormValue[];
                              subject:
                                | import("hono/types").ParsedFormValue
                                | import("hono/types").ParsedFormValue[];
                              end_user_reason:
                                | import("hono/types").ParsedFormValue
                                | import("hono/types").ParsedFormValue[];
                              allow_editing:
                                | import("hono/types").ParsedFormValue
                                | import("hono/types").ParsedFormValue[];
                            };
                          };
                          output: import("zod").ZodSafeParseError<{
                            message: string;
                            subject: string;
                            end_user_reason: string;
                            allow_editing: boolean;
                          }>;
                          outputFormat: "json";
                          status: 400;
                        };
                  };
                },
                "/rejected"
              >
            | import("hono/types").MergeSchemaPath<
                {
                  "/": {
                    $patch:
                      | {
                          input: {
                            param: {
                              id: string;
                            };
                          };
                          output: import("zod").ZodSafeParseError<{
                            id: number;
                          }>;
                          outputFormat: "json";
                          status: 400;
                        }
                      | {
                          input: {
                            param: {
                              id: string;
                            };
                          };
                          output: {};
                          outputFormat: string;
                          status: import("hono/utils/http-status").StatusCode;
                        };
                  };
                },
                "/processed"
              >
            | import("hono/types").MergeSchemaPath<
                {
                  "/": {
                    $patch:
                      | {
                          input: {
                            param: {
                              id: string;
                            };
                          };
                          output: import("zod").ZodSafeParseError<{
                            id: number;
                          }>;
                          outputFormat: "json";
                          status: 400;
                        }
                      | {
                          input: {
                            param: {
                              id: string;
                            };
                          };
                          output: "OK";
                          outputFormat: "text";
                          status: 200;
                        };
                  };
                },
                "/reprocess"
              >,
            "/:id"
          >
      ) & {
        "/": {
          $get: {
            input: {};
            output: {};
            outputFormat: string;
            status: import("hono/utils/http-status").StatusCode;
          };
        };
      },
      "/moderations"
    >
  | import("hono/types").MergeSchemaPath<
      | import("hono/types").BlankSchema
      | import("hono/types").MergeSchemaPath<
          {
            "/": {
              $get:
                | {
                    input: {
                      query: {
                        page?: string | string[] | undefined;
                        page_size?: string | string[] | undefined;
                        q?: string | undefined;
                      };
                    };
                    output: {};
                    outputFormat: string;
                    status: import("hono/utils/http-status").StatusCode;
                  }
                | {
                    input: {
                      query: {
                        page?: string | string[] | undefined;
                        page_size?: string | string[] | undefined;
                        q?: string | undefined;
                      };
                    };
                    output: undefined;
                    outputFormat: "redirect";
                    status: 300 | 301 | 302 | 303 | 304 | 305 | 306 | 307 | 308;
                  };
            };
          } & {
            "/": {
              $post:
                | {
                    input: {
                      form: {
                        email: string;
                        role: string;
                      };
                    };
                    output: import("zod").ZodSafeParseError<{
                      email: string;
                      role: string;
                    }>;
                    outputFormat: "json";
                    status: 400;
                  }
                | {
                    input: {
                      form: {
                        email: string;
                        role: string;
                      };
                    };
                    output: "OK";
                    outputFormat: "text";
                    status: 200;
                  };
            };
          } & {
            "/:id": {
              $patch:
                | {
                    input: {
                      param: {
                        id: string;
                      };
                    } & {
                      form: {
                        role: string;
                      };
                    };
                    output: "OK";
                    outputFormat: "text";
                    status: 200;
                  }
                | {
                    input: {
                      param: {
                        id: string;
                      };
                    } & {
                      form: {
                        role: string;
                      };
                    };
                    output: import("zod").ZodSafeParseError<{
                      id: number;
                    }>;
                    outputFormat: "json";
                    status: 400;
                  }
                | {
                    input: {
                      param: {
                        id: string;
                      };
                    } & {
                      form: {
                        role: string;
                      };
                    };
                    output: import("zod").ZodSafeParseError<{
                      role: string;
                    }>;
                    outputFormat: "json";
                    status: 400;
                  }
                | {
                    input: {
                      param: {
                        id: string;
                      };
                    } & {
                      form: {
                        role: string;
                      };
                    };
                    output: "Forbidden: cannot modify your own role";
                    outputFormat: "text";
                    status: 403;
                  };
            };
          } & {
            "/:id/disable": {
              $patch:
                | {
                    input: {
                      param: {
                        id: string;
                      };
                    };
                    output: "OK";
                    outputFormat: "text";
                    status: 200;
                  }
                | {
                    input: {
                      param: {
                        id: string;
                      };
                    };
                    output: import("zod").ZodSafeParseError<{
                      id: number;
                    }>;
                    outputFormat: "json";
                    status: 400;
                  }
                | {
                    input: {
                      param: {
                        id: string;
                      };
                    };
                    output: "Forbidden: cannot disable yourself";
                    outputFormat: "text";
                    status: 403;
                  };
            };
          } & {
            "/:id/enable": {
              $patch:
                | {
                    input: {
                      param: {
                        id: string;
                      };
                    };
                    output: "OK";
                    outputFormat: "text";
                    status: 200;
                  }
                | {
                    input: {
                      param: {
                        id: string;
                      };
                    };
                    output: import("zod").ZodSafeParseError<{
                      id: number;
                    }>;
                    outputFormat: "json";
                    status: 400;
                  };
            };
          },
          "/team"
        >,
      "/admin"
    >
  | import("hono/types").MergeSchemaPath<
      (
        | import("hono/types").BlankSchema
        | import("hono/types").MergeSchemaPath<
            | ({
                "/": {
                  $get:
                    | {
                        input: {
                          param: {
                            id: string;
                          };
                        };
                        output: import("zod").ZodSafeParseError<{
                          id: number;
                        }>;
                        outputFormat: "json";
                        status: 400;
                      }
                    | {
                        input: {
                          param: {
                            id: string;
                          };
                        };
                        output: {};
                        outputFormat: string;
                        status: import("hono/utils/http-status").StatusCode;
                      };
                };
              } & {
                "/": {
                  $delete:
                    | {
                        input: {
                          param: {
                            id: string;
                          };
                        };
                        output: import("zod").ZodSafeParseError<{
                          id: number;
                        }>;
                        outputFormat: "json";
                        status: 400;
                      }
                    | {
                        input: {
                          param: {
                            id: string;
                          };
                        };
                        output: "OK";
                        outputFormat: "text";
                        status: 200;
                      };
                };
              } & {
                "/reset/email_verified": {
                  $patch:
                    | {
                        input: {
                          param: {
                            id: string;
                          };
                        };
                        output: "OK";
                        outputFormat: "text";
                        status: 200;
                      }
                    | {
                        input: {
                          param: {
                            id: string;
                          };
                        };
                        output: import("zod").ZodSafeParseError<{
                          id: number;
                        }>;
                        outputFormat: "json";
                        status: 400;
                      };
                };
              } & {
                "/reset/france_connect": {
                  $patch:
                    | {
                        input: {
                          param: {
                            id: string;
                          };
                        };
                        output: "OK";
                        outputFormat: "text";
                        status: 200;
                      }
                    | {
                        input: {
                          param: {
                            id: string;
                          };
                        };
                        output: import("zod").ZodSafeParseError<{
                          id: number;
                        }>;
                        outputFormat: "json";
                        status: 400;
                      };
                };
              } & {
                "/reset/password": {
                  $patch:
                    | {
                        input: {
                          param: {
                            id: string;
                          };
                        };
                        output: "OK";
                        outputFormat: "text";
                        status: 200;
                      }
                    | {
                        input: {
                          param: {
                            id: string;
                          };
                        };
                        output: import("zod").ZodSafeParseError<{
                          id: number;
                        }>;
                        outputFormat: "json";
                        status: 400;
                      };
                };
              } & {
                "/reset/mfa": {
                  $patch:
                    | {
                        input: {
                          param: {
                            id: string;
                          };
                        };
                        output: "OK";
                        outputFormat: "text";
                        status: 200;
                      }
                    | {
                        input: {
                          param: {
                            id: string;
                          };
                        };
                        output: import("zod").ZodSafeParseError<{
                          id: number;
                        }>;
                        outputFormat: "json";
                        status: 400;
                      };
                };
              })
            | import("hono/types").MergeSchemaPath<
                {
                  "/": {
                    $get:
                      | {
                          input: {
                            param: {
                              id: string;
                            };
                          } & {
                            query: {
                              describedby: string | string[];
                              page_ref: string | string[];
                              page?: string | string[] | undefined;
                              page_size?: string | string[] | undefined;
                            };
                          };
                          output: {};
                          outputFormat: string;
                          status: import("hono/utils/http-status").StatusCode;
                        }
                      | {
                          input: {
                            param: {
                              id: string;
                            };
                          } & {
                            query: {
                              describedby: string | string[];
                              page_ref: string | string[];
                              page?: string | string[] | undefined;
                              page_size?: string | string[] | undefined;
                            };
                          };
                          output: import("zod").ZodSafeParseError<{
                            id: number;
                          }>;
                          outputFormat: "json";
                          status: 400;
                        }
                      | {
                          input: {
                            param: {
                              id: string;
                            };
                          } & {
                            query: {
                              describedby: string | string[];
                              page_ref: string | string[];
                              page?: string | string[] | undefined;
                              page_size?: string | string[] | undefined;
                            };
                          };
                          output: import("zod").ZodSafeParseError<{
                            page: number;
                            page_size: number;
                            describedby: string;
                            page_ref: string;
                          }>;
                          outputFormat: "json";
                          status: 400;
                        };
                  };
                },
                "/organizations"
              >
            | import("hono/types").MergeSchemaPath<
                {
                  "/": {
                    $get:
                      | {
                          input: {
                            param: {
                              id: string;
                            };
                          } & {
                            query: {
                              describedby: string;
                            };
                          };
                          output: {};
                          outputFormat: string;
                          status: import("hono/utils/http-status").StatusCode;
                        }
                      | {
                          input: {
                            param: {
                              id: string;
                            };
                          } & {
                            query: {
                              describedby: string;
                            };
                          };
                          output: import("zod").ZodSafeParseError<{
                            id: number;
                          }>;
                          outputFormat: "json";
                          status: 400;
                        }
                      | {
                          input: {
                            param: {
                              id: string;
                            };
                          } & {
                            query: {
                              describedby: string;
                            };
                          };
                          output: import("zod").ZodSafeParseError<{
                            describedby: string;
                          }>;
                          outputFormat: "json";
                          status: 400;
                        };
                  };
                },
                "/moderations"
              >
            | import("hono/types").MergeSchemaPath<
                {
                  "/": {
                    $get:
                      | {
                          input: {
                            param: {
                              id: string;
                            };
                          } & {
                            query: {
                              describedby: string;
                            };
                          };
                          output: {};
                          outputFormat: string;
                          status: import("hono/utils/http-status").StatusCode;
                        }
                      | {
                          input: {
                            param: {
                              id: string;
                            };
                          } & {
                            query: {
                              describedby: string;
                            };
                          };
                          output: import("zod").ZodSafeParseError<{
                            id: number;
                          }>;
                          outputFormat: "json";
                          status: 400;
                        }
                      | {
                          input: {
                            param: {
                              id: string;
                            };
                          } & {
                            query: {
                              describedby: string;
                            };
                          };
                          output: import("zod").ZodSafeParseError<{
                            describedby: string;
                          }>;
                          outputFormat: "json";
                          status: 400;
                        };
                  };
                },
                "/oidc_clients"
              >,
            "/:id"
          >
      ) & {
        "/": {
          $get:
            | {
                input: {
                  query: {
                    page?: string | string[] | undefined;
                    page_size?: string | string[] | undefined;
                    q?: string | undefined;
                  };
                };
                output: {};
                outputFormat: string;
                status: import("hono/utils/http-status").StatusCode;
              }
            | {
                input: {
                  query: {
                    page?: string | string[] | undefined;
                    page_size?: string | string[] | undefined;
                    q?: string | undefined;
                  };
                };
                output: undefined;
                outputFormat: "redirect";
                status: 300 | 301 | 302 | 303 | 304 | 305 | 306 | 307 | 308;
              };
        };
      },
      "/users"
    >
  | import("hono/types").MergeSchemaPath<
      (
        | import("hono/types").BlankSchema
        | import("hono/types").MergeSchemaPath<
            {
              "/": {
                $get:
                  | {
                      input: {
                        query: {
                          siret: string;
                          retry?: string | undefined;
                        };
                      };
                      output: {};
                      outputFormat: string;
                      status: import("hono/utils/http-status").StatusCode;
                    }
                  | {
                      input: {
                        query: {
                          siret: string;
                          retry?: string | undefined;
                        };
                      };
                      output: import("zod").ZodSafeParseError<{
                        siret: string;
                        retry?: string | undefined;
                      }>;
                      outputFormat: "json";
                      status: 400;
                    };
              };
            },
            "/leaders"
          >
        | import("hono/types").MergeSchemaPath<
            {
              "/": {
                $get:
                  | {
                      input: {
                        query: {
                          page?: string | string[] | undefined;
                          page_size?: string | string[] | undefined;
                          q?: string | undefined;
                        };
                      };
                      output: {};
                      outputFormat: string;
                      status: import("hono/utils/http-status").StatusCode;
                    }
                  | {
                      input: {
                        query: {
                          page?: string | string[] | undefined;
                          page_size?: string | string[] | undefined;
                          q?: string | undefined;
                        };
                      };
                      output: undefined;
                      outputFormat: "redirect";
                      status:
                        | 300
                        | 301
                        | 302
                        | 303
                        | 304
                        | 305
                        | 306
                        | 307
                        | 308;
                    };
              };
            },
            "/domains"
          >
        | import("hono/types").MergeSchemaPath<
            | {
                "/": {
                  $get:
                    | {
                        input: {
                          param: {
                            id: string;
                          };
                        };
                        output: import("zod").ZodSafeParseError<{
                          id: number;
                        }>;
                        outputFormat: "json";
                        status: 400;
                      }
                    | {
                        input: {
                          param: {
                            id: string;
                          };
                        };
                        output: {};
                        outputFormat: string;
                        status: import("hono/utils/http-status").StatusCode;
                      };
                };
              }
            | import("hono/types").MergeSchemaPath<
                | {
                    "/": {
                      $get:
                        | {
                            input: {
                              param: {
                                id: string;
                              };
                            } & {
                              query: {
                                describedby: string | string[];
                                page_ref: string | string[];
                                page?: string | string[] | undefined;
                                page_size?: string | string[] | undefined;
                              };
                            };
                            output: {};
                            outputFormat: string;
                            status: import("hono/utils/http-status").StatusCode;
                          }
                        | {
                            input: {
                              param: {
                                id: string;
                              };
                            } & {
                              query: {
                                describedby: string | string[];
                                page_ref: string | string[];
                                page?: string | string[] | undefined;
                                page_size?: string | string[] | undefined;
                              };
                            };
                            output: import("zod").ZodSafeParseError<{
                              id: number;
                            }>;
                            outputFormat: "json";
                            status: 400;
                          }
                        | {
                            input: {
                              param: {
                                id: string;
                              };
                            } & {
                              query: {
                                describedby: string | string[];
                                page_ref: string | string[];
                                page?: string | string[] | undefined;
                                page_size?: string | string[] | undefined;
                              };
                            };
                            output: import("zod").ZodSafeParseError<{
                              page: number;
                              page_size: number;
                              describedby: string;
                              page_ref: string;
                            }>;
                            outputFormat: "json";
                            status: 400;
                          };
                    };
                  }
                | (import("hono/types").MergeSchemaPath<
                    {
                      "/": {
                        $patch:
                          | {
                              input: {
                                param: {
                                  id: string;
                                  user_id: string;
                                };
                              } & {
                                form: {
                                  verification_type?:
                                    | "domain"
                                    | "organization_dirigeant"
                                    | "code_sent_to_official_contact_email"
                                    | "imported_from_coop_mediation_numerique"
                                    | "imported_from_inclusion_connect"
                                    | "in_liste_dirigeants_rna"
                                    | "in_liste_dirigeants_rne"
                                    | "official_contact_email"
                                    | "ordre_professionnel_domain"
                                    | "proof_received"
                                    | "verified_by_coop_mediation_numerique"
                                    | "bypassed"
                                    | "domain_not_verified_yet"
                                    | "no_validation_means_available"
                                    | "no_verification_means_for_entreprise_unipersonnelle"
                                    | "no_verification_means_for_small_association"
                                    | "no_verification_means_for_small_organization"
                                    | undefined;
                                  is_external?: string | undefined;
                                };
                              };
                              output: "OK";
                              outputFormat: "text";
                              status: 200;
                            }
                          | {
                              input: {
                                param: {
                                  id: string;
                                  user_id: string;
                                };
                              } & {
                                form: {
                                  verification_type?:
                                    | "domain"
                                    | "organization_dirigeant"
                                    | "code_sent_to_official_contact_email"
                                    | "imported_from_coop_mediation_numerique"
                                    | "imported_from_inclusion_connect"
                                    | "in_liste_dirigeants_rna"
                                    | "in_liste_dirigeants_rne"
                                    | "official_contact_email"
                                    | "ordre_professionnel_domain"
                                    | "proof_received"
                                    | "verified_by_coop_mediation_numerique"
                                    | "bypassed"
                                    | "domain_not_verified_yet"
                                    | "no_validation_means_available"
                                    | "no_verification_means_for_entreprise_unipersonnelle"
                                    | "no_verification_means_for_small_association"
                                    | "no_verification_means_for_small_organization"
                                    | undefined;
                                  is_external?: string | undefined;
                                };
                              };
                              output: import("zod").ZodSafeParseError<{
                                id: number;
                                user_id: number;
                              }>;
                              outputFormat: "json";
                              status: 400;
                            }
                          | {
                              input: {
                                param: {
                                  id: string;
                                  user_id: string;
                                };
                              } & {
                                form: {
                                  verification_type?:
                                    | "domain"
                                    | "organization_dirigeant"
                                    | "code_sent_to_official_contact_email"
                                    | "imported_from_coop_mediation_numerique"
                                    | "imported_from_inclusion_connect"
                                    | "in_liste_dirigeants_rna"
                                    | "in_liste_dirigeants_rne"
                                    | "official_contact_email"
                                    | "ordre_professionnel_domain"
                                    | "proof_received"
                                    | "verified_by_coop_mediation_numerique"
                                    | "bypassed"
                                    | "domain_not_verified_yet"
                                    | "no_validation_means_available"
                                    | "no_verification_means_for_entreprise_unipersonnelle"
                                    | "no_verification_means_for_small_association"
                                    | "no_verification_means_for_small_organization"
                                    | undefined;
                                  is_external?: string | undefined;
                                };
                              };
                              output: import("zod").ZodSafeParseError<{
                                verification_type?:
                                  | "domain"
                                  | "organization_dirigeant"
                                  | "code_sent_to_official_contact_email"
                                  | "imported_from_coop_mediation_numerique"
                                  | "imported_from_inclusion_connect"
                                  | "in_liste_dirigeants_rna"
                                  | "in_liste_dirigeants_rne"
                                  | "official_contact_email"
                                  | "ordre_professionnel_domain"
                                  | "proof_received"
                                  | "verified_by_coop_mediation_numerique"
                                  | "bypassed"
                                  | "domain_not_verified_yet"
                                  | "no_validation_means_available"
                                  | "no_verification_means_for_entreprise_unipersonnelle"
                                  | "no_verification_means_for_small_association"
                                  | "no_verification_means_for_small_organization"
                                  | undefined;
                                is_external?: boolean | undefined;
                              }>;
                              outputFormat: "json";
                              status: 400;
                            };
                      };
                    } & {
                      "/": {
                        $delete:
                          | {
                              input: {
                                param: {
                                  id: string;
                                  user_id: string;
                                };
                              };
                              output: "OK";
                              outputFormat: "text";
                              status: 200;
                            }
                          | {
                              input: {
                                param: {
                                  id: string;
                                  user_id: string;
                                };
                              };
                              output: import("zod").ZodSafeParseError<{
                                id: number;
                                user_id: number;
                              }>;
                              outputFormat: "json";
                              status: 400;
                            };
                      };
                    },
                    "/:user_id"
                  > & {
                    "/": {
                      $get:
                        | {
                            input: {
                              param: {
                                id: string;
                              };
                            } & {
                              query: {
                                describedby: string | string[];
                                page_ref: string | string[];
                                page?: string | string[] | undefined;
                                page_size?: string | string[] | undefined;
                              };
                            };
                            output: {};
                            outputFormat: string;
                            status: import("hono/utils/http-status").StatusCode;
                          }
                        | {
                            input: {
                              param: {
                                id: string;
                              };
                            } & {
                              query: {
                                describedby: string | string[];
                                page_ref: string | string[];
                                page?: string | string[] | undefined;
                                page_size?: string | string[] | undefined;
                              };
                            };
                            output: import("zod").ZodSafeParseError<{
                              id: number;
                            }>;
                            outputFormat: "json";
                            status: 400;
                          }
                        | {
                            input: {
                              param: {
                                id: string;
                              };
                            } & {
                              query: {
                                describedby: string | string[];
                                page_ref: string | string[];
                                page?: string | string[] | undefined;
                                page_size?: string | string[] | undefined;
                              };
                            };
                            output: import("zod").ZodSafeParseError<{
                              page: number;
                              page_size: number;
                              describedby: string;
                              page_ref: string;
                            }>;
                            outputFormat: "json";
                            status: 400;
                          };
                    };
                  }),
                "/members"
              >
            | import("hono/types").MergeSchemaPath<
                {
                  "/": {
                    $get:
                      | {
                          input: {
                            param: {
                              id: string;
                            };
                          } & {
                            query: {
                              describedby: string;
                            };
                          };
                          output: {};
                          outputFormat: string;
                          status: import("hono/utils/http-status").StatusCode;
                        }
                      | {
                          input: {
                            param: {
                              id: string;
                            };
                          } & {
                            query: {
                              describedby: string;
                            };
                          };
                          output: import("zod").ZodSafeParseError<{
                            id: number;
                          }>;
                          outputFormat: "json";
                          status: 400;
                        }
                      | {
                          input: {
                            param: {
                              id: string;
                            };
                          } & {
                            query: {
                              describedby: string;
                            };
                          };
                          output: import("zod").ZodSafeParseError<{
                            describedby: string;
                          }>;
                          outputFormat: "json";
                          status: 400;
                        };
                  };
                } & {
                  "/": {
                    $put:
                      | {
                          input: {
                            param: {
                              id: string;
                            };
                          } & {
                            form: {
                              domain: string;
                            };
                          };
                          output: "OK";
                          outputFormat: "text";
                          status: 200;
                        }
                      | {
                          input: {
                            param: {
                              id: string;
                            };
                          } & {
                            form: {
                              domain: string;
                            };
                          };
                          output: import("zod").ZodSafeParseError<{
                            id: number;
                          }>;
                          outputFormat: "json";
                          status: 400;
                        }
                      | {
                          input: {
                            param: {
                              id: string;
                            };
                          } & {
                            form: {
                              domain: string;
                            };
                          };
                          output: import("zod").ZodSafeParseError<{
                            domain: string;
                          }>;
                          outputFormat: "json";
                          status: 400;
                        };
                  };
                } & {
                  "/:domain_id": {
                    $delete:
                      | {
                          input: {
                            param: {
                              id: string;
                              domain_id: string;
                            };
                          };
                          output: "OK";
                          outputFormat: "text";
                          status: 200;
                        }
                      | {
                          input: {
                            param: {
                              id: string;
                              domain_id: string;
                            };
                          };
                          output: import("zod").ZodSafeParseError<{
                            id: number;
                            domain_id: number;
                          }>;
                          outputFormat: "json";
                          status: 400;
                        };
                  };
                } & {
                  "/:domain_id": {
                    $patch:
                      | {
                          input: {
                            param: {
                              id: string;
                              domain_id: string;
                            };
                          } & {
                            query: {
                              type: "external" | "verified" | "refused";
                            };
                          };
                          output: "OK";
                          outputFormat: "text";
                          status: 200;
                        }
                      | {
                          input: {
                            param: {
                              id: string;
                              domain_id: string;
                            };
                          } & {
                            query: {
                              type: "external" | "verified" | "refused";
                            };
                          };
                          output: import("zod").ZodSafeParseError<{
                            id: number;
                            domain_id: number;
                          }>;
                          outputFormat: "json";
                          status: 400;
                        }
                      | {
                          input: {
                            param: {
                              id: string;
                              domain_id: string;
                            };
                          } & {
                            query: {
                              type: "external" | "verified" | "refused";
                            };
                          };
                          output: import("zod").ZodSafeParseError<{
                            type: "external" | "verified" | "refused";
                          }>;
                          outputFormat: "json";
                          status: 400;
                        };
                  };
                },
                "/domains"
              >,
            "/:id"
          >
      ) & {
        "/": {
          $get:
            | {
                input: {
                  query: {
                    page?: string | string[] | undefined;
                    page_size?: string | string[] | undefined;
                    q?: string | undefined;
                    id?: string | undefined;
                  };
                };
                output: {};
                outputFormat: string;
                status: import("hono/utils/http-status").StatusCode;
              }
            | {
                input: {
                  query: {
                    page?: string | string[] | undefined;
                    page_size?: string | string[] | undefined;
                    q?: string | undefined;
                    id?: string | undefined;
                  };
                };
                output: import("zod").ZodSafeParseError<{
                  page: number;
                  page_size: number;
                  q: string;
                  id?: number | undefined;
                }>;
                outputFormat: "json";
                status: 400;
              };
        };
      },
      "/organizations"
    >
  | import("hono/types").MergeSchemaPath<
      {
        "/": {
          $get: {
            input: {};
            output: {};
            outputFormat: string;
            status: import("hono/utils/http-status").StatusCode;
          };
        };
      } & {
        "/": {
          $put:
            | {
                input: {
                  form: {
                    problematic_email: string;
                  };
                };
                output: {};
                outputFormat: string;
                status: import("hono/utils/http-status").StatusCode;
              }
            | {
                input: {
                  form: {
                    problematic_email: string;
                  };
                };
                output: import("zod").ZodSafeParseError<{
                  problematic_email: string;
                }>;
                outputFormat: "json";
                status: 400;
              };
        };
      } & {
        "/:email_domain": {
          $delete:
            | {
                input: {
                  param: {
                    email_domain: string;
                  };
                };
                output: "OK";
                outputFormat: "text";
                status: 200;
              }
            | {
                input: {
                  param: {
                    email_domain: string;
                  };
                };
                output: import("zod").ZodSafeParseError<{
                  email_domain: string;
                }>;
                outputFormat: "json";
                status: 400;
              }
            | {
                input: {
                  param: {
                    email_domain: string;
                  };
                };
                output: "Erreur lors de la suppression";
                outputFormat: "text";
                status: 500;
              };
        };
      },
      "/domains-deliverability"
    >
  | import("hono/types").MergeSchemaPath<
      {
        "/": {
          $get: {
            input: {};
            output: {};
            outputFormat: string;
            status: import("hono/utils/http-status").StatusCode;
          };
        };
      } & {
        "/new": {
          $get: {
            input: {};
            output: {};
            outputFormat: string;
            status: import("hono/utils/http-status").StatusCode;
          };
        };
      } & {
        "/": {
          $post:
            | {
                input: {
                  form: {
                    label: string;
                    content: string;
                    end_user_reason: string;
                    allow_editing?: string | undefined;
                  };
                };
                output: import("zod").ZodSafeParseError<{
                  label: string;
                  content: string;
                  end_user_reason: string;
                  allow_editing: boolean;
                }>;
                outputFormat: "json";
                status: 400;
              }
            | {
                input: {
                  form: {
                    label: string;
                    content: string;
                    end_user_reason: string;
                    allow_editing?: string | undefined;
                  };
                };
                output: undefined;
                outputFormat: "redirect";
                status: 303;
              };
        };
      } & {
        "/:id": {
          $get: {
            input: {
              param: {
                id: string;
              };
            };
            output: {};
            outputFormat: string;
            status: import("hono/utils/http-status").StatusCode;
          };
        };
      } & {
        "/:id": {
          $patch:
            | {
                input: {
                  form: {
                    label: string;
                    content: string;
                    end_user_reason: string;
                    allow_editing?: string | undefined;
                  };
                } & {
                  param: {
                    id: string;
                  };
                };
                output: import("zod").ZodSafeParseError<{
                  label: string;
                  content: string;
                  end_user_reason: string;
                  allow_editing: boolean;
                }>;
                outputFormat: "json";
                status: 400;
              }
            | {
                input: {
                  form: {
                    label: string;
                    content: string;
                    end_user_reason: string;
                    allow_editing?: string | undefined;
                  };
                } & {
                  param: {
                    id: string;
                  };
                };
                output: "";
                outputFormat: "text";
                status: 200;
              };
        };
      } & {
        "/:id": {
          $delete: {
            input: {
              param: {
                id: string;
              };
            };
            output: {};
            outputFormat: string;
            status: import("hono/utils/http-status").StatusCode;
          };
        };
      },
      "/response-templates"
    >,
  "/",
  "*"
>;
export type Router = typeof app;
export default app;
