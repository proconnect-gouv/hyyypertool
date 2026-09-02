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
  | import("hono/types").MergeSchemaPath<
      {
        "/": {
          $get: {
            output: {};
            outputFormat: string;
            status: import("hono/utils/http-status").StatusCode;
            input: {};
          };
        };
      },
      "/"
    >
  | import("hono/types").MergeSchemaPath<
      {
        "/localhost:3000/*": {
          $get: {
            output: undefined;
            outputFormat: "redirect";
            status: 302;
            input: {};
          };
        };
      },
      "/proxy"
    >
  | import("hono/types").MergeSchemaPath<
      {
        "/bundle/config.js": {
          $get: {
            output: `export default ${string}`;
            outputFormat: "text";
            status: 200;
            input: {};
          };
        };
      } & {
        "/bundle/env.js": {
          $get: {
            output: `export default ${string}`;
            outputFormat: "text";
            status: 200;
            input: {};
          };
        };
      },
      `/assets/${string}`
    >
  | import("hono/types").MergeSchemaPath<
      {
        "/": {
          $get: {
            output: {};
            outputFormat: string;
            status: import("hono/utils/http-status").StatusCode;
            input: {};
          };
        };
      } & {
        "/": {
          $put:
            | {
                output: {};
                outputFormat: string;
                status: import("hono/utils/http-status").StatusCode;
                input: {
                  form: {
                    problematic_email: string;
                  };
                };
              }
            | {
                output: import("zod").ZodSafeParseError<{
                  problematic_email: string;
                }>;
                outputFormat: "json";
                status: 400;
                input: {
                  form: {
                    problematic_email: string;
                  };
                };
              };
        };
      } & {
        "/:email_domain": {
          $delete:
            | {
                output: "Erreur lors de la suppression";
                outputFormat: "text";
                status: 500;
                input: {
                  param: {
                    email_domain: string;
                  };
                };
              }
            | {
                output: "OK";
                outputFormat: "text";
                status: 200;
                input: {
                  param: {
                    email_domain: string;
                  };
                };
              }
            | {
                output: import("zod").ZodSafeParseError<{
                  email_domain: string;
                }>;
                outputFormat: "json";
                status: 400;
                input: {
                  param: {
                    email_domain: string;
                  };
                };
              };
        };
      },
      "/domains-deliverability"
    >
  | import("hono/types").MergeSchemaPath<
      {
        "/": {
          $get: {
            output: "readyz check passed";
            outputFormat: "text";
            status: import("hono/utils/http-status").ContentfulStatusCode;
            input: {};
          };
        };
      } & {
        "/drizzle/identite": {
          $get: {
            output: string;
            outputFormat: "text";
            status: import("hono/utils/http-status").ContentfulStatusCode;
            input: {};
          };
        };
      } & {
        "/drizzle/hyyyperbase": {
          $get: {
            output: string;
            outputFormat: "text";
            status: import("hono/utils/http-status").ContentfulStatusCode;
            input: {};
          };
        };
      },
      "/readyz"
    >
  | import("hono/types").MergeSchemaPath<
      {
        "/login": {
          $post: {
            output: undefined;
            outputFormat: "redirect";
            status: 302;
            input: {};
          };
        };
      } & {
        "/login/callback": {
          $get:
            | {
                output: undefined;
                outputFormat: "redirect";
                status: 302;
                input: {
                  query: {
                    code: string;
                    iss: string;
                    state: string;
                  };
                };
              }
            | {
                output: import("zod").ZodSafeParseError<{
                  code: string;
                  iss: string;
                  state: string;
                }>;
                outputFormat: "json";
                status: 400;
                input: {
                  query: {
                    code: string;
                    iss: string;
                    state: string;
                  };
                };
              };
        };
      } & {
        "/logout": {
          $get: {
            output: undefined;
            outputFormat: "redirect";
            status: 302;
            input: {};
          };
        };
      } & {
        "/logout/callback": {
          $get:
            | {
                output: undefined;
                outputFormat: "redirect";
                status: 302;
                input: {
                  query: {
                    state: string;
                  };
                };
              }
            | {
                output: import("zod").ZodSafeParseError<{
                  state: string;
                }>;
                outputFormat: "json";
                status: 400;
                input: {
                  query: {
                    state: string;
                  };
                };
              };
        };
      },
      "/auth"
    >
  | import("hono/types").MergeSchemaPath<
      {
        "/": {
          $get: {
            output: {};
            outputFormat: string;
            status: import("hono/utils/http-status").StatusCode;
            input: {};
          };
        };
      } & {
        "/new": {
          $get: {
            output: {};
            outputFormat: string;
            status: import("hono/utils/http-status").StatusCode;
            input: {};
          };
        };
      } & {
        "/:id": {
          $get: {
            output: {};
            outputFormat: string;
            status: import("hono/utils/http-status").StatusCode;
            input: {
              param: {
                id: string;
              };
            };
          };
        };
      } & {
        "/": {
          $post:
            | {
                output: undefined;
                outputFormat: "redirect";
                status: 303;
                input: {
                  form: {
                    label: string;
                    content: string;
                    end_user_reason: string;
                    allow_editing?: string | undefined;
                  };
                };
              }
            | {
                output: import("zod").ZodSafeParseError<{
                  label: string;
                  content: string;
                  end_user_reason: string;
                  allow_editing: boolean;
                }>;
                outputFormat: "json";
                status: 400;
                input: {
                  form: {
                    label: string;
                    content: string;
                    end_user_reason: string;
                    allow_editing?: string | undefined;
                  };
                };
              };
        };
      } & {
        "/:id": {
          $patch:
            | {
                output: "";
                outputFormat: "text";
                status: 200;
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
              }
            | {
                output: import("zod").ZodSafeParseError<{
                  label: string;
                  content: string;
                  end_user_reason: string;
                  allow_editing: boolean;
                }>;
                outputFormat: "json";
                status: 400;
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
              };
        };
      } & {
        "/:id": {
          $delete: {
            output: {};
            outputFormat: string;
            status: import("hono/utils/http-status").StatusCode;
            input: {
              param: {
                id: string;
              };
            };
          };
        };
      },
      "/response-templates"
    >
  | import("hono/types").MergeSchemaPath<
      (
        | import("hono/types").BlankSchema
        | import("hono/types").MergeSchemaPath<
            (((((
              | import("hono/types").MergeSchemaPath<
                  {
                    "/": {
                      $get:
                        | {
                            output: {};
                            outputFormat: string;
                            status: import("hono/utils/http-status").StatusCode;
                            input: {
                              param: {
                                id: string;
                              };
                            } & {
                              query: {
                                describedby: string;
                              };
                            };
                          }
                        | {
                            output: import("zod").ZodSafeParseError<{
                              id: number;
                            }>;
                            outputFormat: "json";
                            status: 400;
                            input: {
                              param: {
                                id: string;
                              };
                            } & {
                              query: {
                                describedby: string;
                              };
                            };
                          }
                        | {
                            output: import("zod").ZodSafeParseError<{
                              describedby: string;
                            }>;
                            outputFormat: "json";
                            status: 400;
                            input: {
                              param: {
                                id: string;
                              };
                            } & {
                              query: {
                                describedby: string;
                              };
                            };
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
                            output: {};
                            outputFormat: string;
                            status: import("hono/utils/http-status").StatusCode;
                            input: {
                              param: {
                                id: string;
                              };
                            } & {
                              query: {
                                page?: string | string[] | undefined;
                                page_size?: string | string[] | undefined;
                                describedby: string | string[];
                                page_ref: string | string[];
                              };
                            };
                          }
                        | {
                            output: import("zod").ZodSafeParseError<{
                              id: number;
                            }>;
                            outputFormat: "json";
                            status: 400;
                            input: {
                              param: {
                                id: string;
                              };
                            } & {
                              query: {
                                page?: string | string[] | undefined;
                                page_size?: string | string[] | undefined;
                                describedby: string | string[];
                                page_ref: string | string[];
                              };
                            };
                          }
                        | {
                            output: import("zod").ZodSafeParseError<{
                              page: number;
                              page_size: number;
                              describedby: string;
                              page_ref: string;
                            }>;
                            outputFormat: "json";
                            status: 400;
                            input: {
                              param: {
                                id: string;
                              };
                            } & {
                              query: {
                                page?: string | string[] | undefined;
                                page_size?: string | string[] | undefined;
                                describedby: string | string[];
                                page_ref: string | string[];
                              };
                            };
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
                            output: {};
                            outputFormat: string;
                            status: import("hono/utils/http-status").StatusCode;
                            input: {
                              param: {
                                id: string;
                              };
                            } & {
                              query: {
                                page?: string | string[] | undefined;
                                page_size?: string | string[] | undefined;
                                describedby: string | string[];
                                page_ref: string | string[];
                              };
                            };
                          }
                        | {
                            output: import("zod").ZodSafeParseError<{
                              id: number;
                            }>;
                            outputFormat: "json";
                            status: 400;
                            input: {
                              param: {
                                id: string;
                              };
                            } & {
                              query: {
                                page?: string | string[] | undefined;
                                page_size?: string | string[] | undefined;
                                describedby: string | string[];
                                page_ref: string | string[];
                              };
                            };
                          }
                        | {
                            output: import("zod").ZodSafeParseError<{
                              page: number;
                              page_size: number;
                              describedby: string;
                              page_ref: string;
                            }>;
                            outputFormat: "json";
                            status: 400;
                            input: {
                              param: {
                                id: string;
                              };
                            } & {
                              query: {
                                page?: string | string[] | undefined;
                                page_size?: string | string[] | undefined;
                                describedby: string | string[];
                                page_ref: string | string[];
                              };
                            };
                          };
                    };
                  },
                  "/oidc_clients"
                >
              | {
                  "/": {
                    $get:
                      | {
                          output: {};
                          outputFormat: string;
                          status: import("hono/utils/http-status").StatusCode;
                          input: {
                            param: {
                              id: string;
                            };
                          };
                        }
                      | {
                          output: import("zod").ZodSafeParseError<{
                            id: number;
                          }>;
                          outputFormat: "json";
                          status: 400;
                          input: {
                            param: {
                              id: string;
                            };
                          };
                        };
                  };
                }
            ) & {
              "/": {
                $delete:
                  | {
                      output: "OK";
                      outputFormat: "text";
                      status: 200;
                      input: {
                        param: {
                          id: string;
                        };
                      };
                    }
                  | {
                      output: import("zod").ZodSafeParseError<{
                        id: number;
                      }>;
                      outputFormat: "json";
                      status: 400;
                      input: {
                        param: {
                          id: string;
                        };
                      };
                    };
              };
            }) & {
              "/reset/email_verified": {
                $patch:
                  | {
                      output: "OK";
                      outputFormat: "text";
                      status: 200;
                      input: {
                        param: {
                          id: string;
                        };
                      };
                    }
                  | {
                      output: import("zod").ZodSafeParseError<{
                        id: number;
                      }>;
                      outputFormat: "json";
                      status: 400;
                      input: {
                        param: {
                          id: string;
                        };
                      };
                    };
              };
            }) & {
              "/reset/france_connect": {
                $patch:
                  | {
                      output: "OK";
                      outputFormat: "text";
                      status: 200;
                      input: {
                        param: {
                          id: string;
                        };
                      };
                    }
                  | {
                      output: import("zod").ZodSafeParseError<{
                        id: number;
                      }>;
                      outputFormat: "json";
                      status: 400;
                      input: {
                        param: {
                          id: string;
                        };
                      };
                    };
              };
            }) & {
              "/reset/password": {
                $patch:
                  | {
                      output: "OK";
                      outputFormat: "text";
                      status: 200;
                      input: {
                        param: {
                          id: string;
                        };
                      };
                    }
                  | {
                      output: import("zod").ZodSafeParseError<{
                        id: number;
                      }>;
                      outputFormat: "json";
                      status: 400;
                      input: {
                        param: {
                          id: string;
                        };
                      };
                    };
              };
            }) & {
              "/reset/mfa": {
                $patch:
                  | {
                      output: "OK";
                      outputFormat: "text";
                      status: 200;
                      input: {
                        param: {
                          id: string;
                        };
                      };
                    }
                  | {
                      output: import("zod").ZodSafeParseError<{
                        id: number;
                      }>;
                      outputFormat: "json";
                      status: 400;
                      input: {
                        param: {
                          id: string;
                        };
                      };
                    };
              };
            },
            "/:id"
          >
      ) & {
        "/": {
          $get:
            | {
                output: {};
                outputFormat: string;
                status: import("hono/utils/http-status").StatusCode;
                input: {
                  query: {
                    page?: string | string[] | undefined;
                    page_size?: string | string[] | undefined;
                    q?: string | undefined;
                  };
                };
              }
            | {
                output: undefined;
                outputFormat: "redirect";
                status: import("hono/utils/http-status").RedirectStatusCode;
                input: {
                  query: {
                    page?: string | string[] | undefined;
                    page_size?: string | string[] | undefined;
                    q?: string | undefined;
                  };
                };
              };
        };
      },
      "/users"
    >
  | import("hono/types").MergeSchemaPath<
      (
        | import("hono/types").BlankSchema
        | import("hono/types").MergeSchemaPath<
            | import("hono/types").MergeSchemaPath<
                {
                  "/": {
                    $get:
                      | {
                          output: {};
                          outputFormat: string;
                          status: import("hono/utils/http-status").StatusCode;
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
                        }
                      | {
                          output: import("zod").ZodSafeParseError<{
                            id: number;
                          }>;
                          outputFormat: "json";
                          status: 400;
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
                        }
                      | {
                          output: import("zod").ZodSafeParseError<{
                            organization_id: number;
                            user_id: number;
                          }>;
                          outputFormat: "json";
                          status: 400;
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
                        };
                  };
                },
                "/duplicate_warning"
              >
            | import("hono/types").MergeSchemaPath<
                {
                  "/": {
                    $get:
                      | {
                          output: {};
                          outputFormat: string;
                          status: import("hono/utils/http-status").StatusCode;
                          input: {
                            param: {
                              id: string;
                            };
                          } & {
                            query: {
                              describedby: string;
                            };
                          };
                        }
                      | {
                          output: import("zod").ZodSafeParseError<{
                            id: number;
                          }>;
                          outputFormat: "json";
                          status: 400;
                          input: {
                            param: {
                              id: string;
                            };
                          } & {
                            query: {
                              describedby: string;
                            };
                          };
                        }
                      | {
                          output: import("zod").ZodSafeParseError<{
                            describedby: string;
                          }>;
                          outputFormat: "json";
                          status: 400;
                          input: {
                            param: {
                              id: string;
                            };
                          } & {
                            query: {
                              describedby: string;
                            };
                          };
                        };
                  };
                },
                "/email"
              >
            | import("hono/types").MergeSchemaPath<
                {
                  "/": {
                    $patch:
                      | {
                          output: {};
                          outputFormat: string;
                          status: import("hono/utils/http-status").StatusCode;
                          input: {
                            param: {
                              id: string;
                            };
                          } & {
                            form: {
                              add_domain?: string | undefined;
                              add_member: "AS_EXTERNAL" | "AS_INTERNAL";
                              send_notification?: string | undefined;
                              verification_type?:
                                | "bypassed"
                                | "code_sent_to_official_contact_email"
                                | "domain"
                                | "domain_not_verified_yet"
                                | "imported_from_coop_mediation_numerique"
                                | "imported_from_inclusion_connect"
                                | "in_liste_dirigeants_rna"
                                | "in_liste_dirigeants_rne"
                                | "no_validation_means_available"
                                | "no_verification_means_for_entreprise_unipersonnelle"
                                | "no_verification_means_for_small_association"
                                | "no_verification_means_for_small_organization"
                                | "official_contact_email"
                                | "ordre_professionnel_domain"
                                | "organization_dirigeant"
                                | "proof_received"
                                | "verified_by_coop_mediation_numerique"
                                | undefined;
                            };
                          };
                        }
                      | {
                          output: import("zod").ZodSafeParseError<{
                            id: number;
                          }>;
                          outputFormat: "json";
                          status: 400;
                          input: {
                            param: {
                              id: string;
                            };
                          } & {
                            form: {
                              add_domain?: string | undefined;
                              add_member: "AS_EXTERNAL" | "AS_INTERNAL";
                              send_notification?: string | undefined;
                              verification_type?:
                                | "bypassed"
                                | "code_sent_to_official_contact_email"
                                | "domain"
                                | "domain_not_verified_yet"
                                | "imported_from_coop_mediation_numerique"
                                | "imported_from_inclusion_connect"
                                | "in_liste_dirigeants_rna"
                                | "in_liste_dirigeants_rne"
                                | "no_validation_means_available"
                                | "no_verification_means_for_entreprise_unipersonnelle"
                                | "no_verification_means_for_small_association"
                                | "no_verification_means_for_small_organization"
                                | "official_contact_email"
                                | "ordre_professionnel_domain"
                                | "organization_dirigeant"
                                | "proof_received"
                                | "verified_by_coop_mediation_numerique"
                                | undefined;
                            };
                          };
                        }
                      | {
                          output: import("zod").ZodSafeParseError<{
                            add_domain: boolean;
                            add_member: "AS_EXTERNAL" | "AS_INTERNAL";
                            send_notification: boolean;
                            verification_type?:
                              | "bypassed"
                              | "code_sent_to_official_contact_email"
                              | "domain"
                              | "domain_not_verified_yet"
                              | "imported_from_coop_mediation_numerique"
                              | "imported_from_inclusion_connect"
                              | "in_liste_dirigeants_rna"
                              | "in_liste_dirigeants_rne"
                              | "no_validation_means_available"
                              | "no_verification_means_for_entreprise_unipersonnelle"
                              | "no_verification_means_for_small_association"
                              | "no_verification_means_for_small_organization"
                              | "official_contact_email"
                              | "ordre_professionnel_domain"
                              | "organization_dirigeant"
                              | "proof_received"
                              | "verified_by_coop_mediation_numerique"
                              | undefined;
                          }>;
                          outputFormat: "json";
                          status: 400;
                          input: {
                            param: {
                              id: string;
                            };
                          } & {
                            form: {
                              add_domain?: string | undefined;
                              add_member: "AS_EXTERNAL" | "AS_INTERNAL";
                              send_notification?: string | undefined;
                              verification_type?:
                                | "bypassed"
                                | "code_sent_to_official_contact_email"
                                | "domain"
                                | "domain_not_verified_yet"
                                | "imported_from_coop_mediation_numerique"
                                | "imported_from_inclusion_connect"
                                | "in_liste_dirigeants_rna"
                                | "in_liste_dirigeants_rne"
                                | "no_validation_means_available"
                                | "no_verification_means_for_entreprise_unipersonnelle"
                                | "no_verification_means_for_small_association"
                                | "no_verification_means_for_small_organization"
                                | "official_contact_email"
                                | "ordre_professionnel_domain"
                                | "organization_dirigeant"
                                | "proof_received"
                                | "verified_by_coop_mediation_numerique"
                                | undefined;
                            };
                          };
                        };
                  };
                },
                "/validate"
              >
            | import("hono/types").MergeSchemaPath<
                {
                  "/": {
                    $patch:
                      | {
                          output: {};
                          outputFormat: string;
                          status: import("hono/utils/http-status").StatusCode;
                          input: {
                            param: {
                              id: string;
                            };
                          };
                        }
                      | {
                          output: import("zod").ZodSafeParseError<{
                            id: number;
                          }>;
                          outputFormat: "json";
                          status: 400;
                          input: {
                            param: {
                              id: string;
                            };
                          };
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
                          output: "OK";
                          outputFormat: "text";
                          status: 200;
                          input: {
                            param: {
                              id: string;
                            };
                          };
                        }
                      | {
                          output: import("zod").ZodSafeParseError<{
                            id: number;
                          }>;
                          outputFormat: "json";
                          status: 400;
                          input: {
                            param: {
                              id: string;
                            };
                          };
                        };
                  };
                },
                "/reprocess"
              >
            | import("hono/types").MergeSchemaPath<
                {
                  "/reason/:response_id": {
                    $get:
                      | {
                          output: string;
                          outputFormat: "text";
                          status: import("hono/utils/http-status").ContentfulStatusCode;
                          input: {
                            param: {
                              id: string;
                              response_id: string;
                            };
                          };
                        }
                      | {
                          output: import("zod").ZodSafeParseError<{
                            id: number;
                            response_id: number;
                          }>;
                          outputFormat: "json";
                          status: 400;
                          input: {
                            param: {
                              id: string;
                              response_id: string;
                            };
                          };
                        };
                  };
                } & {
                  "/": {
                    $patch:
                      | {
                          output: "OK";
                          outputFormat: "text";
                          status: 200;
                          input: {
                            param: {
                              id: string;
                            };
                          } & {
                            form: {
                              message:
                                | import("hono/types").ParsedFormValue[]
                                | import("hono/types").ParsedFormValue;
                              subject:
                                | import("hono/types").ParsedFormValue[]
                                | import("hono/types").ParsedFormValue;
                              end_user_reason:
                                | import("hono/types").ParsedFormValue[]
                                | import("hono/types").ParsedFormValue;
                              allow_editing:
                                | import("hono/types").ParsedFormValue[]
                                | import("hono/types").ParsedFormValue;
                            };
                          };
                        }
                      | {
                          output: import("zod").ZodSafeParseError<{
                            message: string;
                            subject: string;
                            end_user_reason: string;
                            allow_editing: boolean;
                          }>;
                          outputFormat: "json";
                          status: 400;
                          input: {
                            param: {
                              id: string;
                            };
                          } & {
                            form: {
                              message:
                                | import("hono/types").ParsedFormValue[]
                                | import("hono/types").ParsedFormValue;
                              subject:
                                | import("hono/types").ParsedFormValue[]
                                | import("hono/types").ParsedFormValue;
                              end_user_reason:
                                | import("hono/types").ParsedFormValue[]
                                | import("hono/types").ParsedFormValue;
                              allow_editing:
                                | import("hono/types").ParsedFormValue[]
                                | import("hono/types").ParsedFormValue;
                            };
                          };
                        }
                      | {
                          output: import("zod").ZodSafeParseError<{
                            id: number;
                          }>;
                          outputFormat: "json";
                          status: 400;
                          input: {
                            param: {
                              id: string;
                            };
                          } & {
                            form: {
                              message:
                                | import("hono/types").ParsedFormValue[]
                                | import("hono/types").ParsedFormValue;
                              subject:
                                | import("hono/types").ParsedFormValue[]
                                | import("hono/types").ParsedFormValue;
                              end_user_reason:
                                | import("hono/types").ParsedFormValue[]
                                | import("hono/types").ParsedFormValue;
                              allow_editing:
                                | import("hono/types").ParsedFormValue[]
                                | import("hono/types").ParsedFormValue;
                            };
                          };
                        };
                  };
                },
                "/rejected"
              >
            | {
                "/": {
                  $get:
                    | {
                        output: {};
                        outputFormat: string;
                        status: import("hono/utils/http-status").StatusCode;
                        input: {
                          param: {
                            id: string;
                          };
                        };
                      }
                    | {
                        output: import("zod").ZodSafeParseError<{
                          id: number;
                        }>;
                        outputFormat: "json";
                        status: 400;
                        input: {
                          param: {
                            id: string;
                          };
                        };
                      };
                };
              },
            "/:id"
          >
      ) & {
        "/": {
          $get: {
            output: {};
            outputFormat: string;
            status: import("hono/utils/http-status").StatusCode;
            input: {};
          };
        };
      },
      "/moderations"
    >
  | import("hono/types").MergeSchemaPath<
      (
        | import("hono/types").BlankSchema
        | import("hono/types").MergeSchemaPath<
            {
              "/": {
                $get:
                  | {
                      output: {};
                      outputFormat: string;
                      status: import("hono/utils/http-status").StatusCode;
                      input: {
                        query: {
                          page?: string | string[] | undefined;
                          page_size?: string | string[] | undefined;
                          q?: string | undefined;
                        };
                      };
                    }
                  | {
                      output: undefined;
                      outputFormat: "redirect";
                      status: import("hono/utils/http-status").RedirectStatusCode;
                      input: {
                        query: {
                          page?: string | string[] | undefined;
                          page_size?: string | string[] | undefined;
                          q?: string | undefined;
                        };
                      };
                    };
              };
            },
            "/domains"
          >
        | import("hono/types").MergeSchemaPath<
            {
              "/": {
                $get:
                  | {
                      output: {};
                      outputFormat: string;
                      status: import("hono/utils/http-status").StatusCode;
                      input: {
                        query: {
                          siret: string;
                          retry?: string | undefined;
                        };
                      };
                    }
                  | {
                      output: import("zod").ZodSafeParseError<{
                        siret: string;
                        retry?: string | undefined;
                      }>;
                      outputFormat: "json";
                      status: 400;
                      input: {
                        query: {
                          siret: string;
                          retry?: string | undefined;
                        };
                      };
                    };
              };
            } & {
              "/document": {
                $get:
                  | {
                      output: {};
                      outputFormat: string;
                      status: import("hono/utils/http-status").StatusCode;
                      input: {
                        query: {
                          siret: string;
                        };
                      };
                    }
                  | {
                      output: import("zod").ZodSafeParseError<{
                        siret: string;
                      }>;
                      outputFormat: "json";
                      status: 400;
                      input: {
                        query: {
                          siret: string;
                        };
                      };
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
                      output: {};
                      outputFormat: string;
                      status: import("hono/utils/http-status").StatusCode;
                      input: {
                        query: {
                          siret?: string | undefined;
                        };
                      };
                    }
                  | {
                      output: import("zod").ZodSafeParseError<{
                        siret?: string | undefined;
                      }>;
                      outputFormat: "json";
                      status: 400;
                      input: {
                        query: {
                          siret?: string | undefined;
                        };
                      };
                    };
              };
            } & {
              "/": {
                $post:
                  | {
                      output: {};
                      outputFormat: string;
                      status: import("hono/utils/http-status").StatusCode;
                      input: {
                        form: {
                          siret: string;
                        };
                      };
                    }
                  | {
                      output: import("zod").ZodSafeParseError<{
                        siret: string;
                      }>;
                      outputFormat: "json";
                      status: 400;
                      input: {
                        form: {
                          siret: string;
                        };
                      };
                    };
              };
            } & {
              "/confirm": {
                $post:
                  | {
                      output: undefined;
                      outputFormat: "redirect";
                      status: 303;
                      input: {
                        form: {
                          siret: string;
                        };
                      };
                    }
                  | {
                      output: import("zod").ZodSafeParseError<{
                        siret: string;
                      }>;
                      outputFormat: "json";
                      status: 400;
                      input: {
                        form: {
                          siret: string;
                        };
                      };
                    };
              };
            },
            "/new"
          >
        | import("hono/types").MergeSchemaPath<
            | import("hono/types").MergeSchemaPath<
                {
                  "/": {
                    $get:
                      | {
                          output: {};
                          outputFormat: string;
                          status: import("hono/utils/http-status").StatusCode;
                          input: {
                            param: {
                              id: string;
                            };
                          } & {
                            query: {
                              describedby: string;
                            };
                          };
                        }
                      | {
                          output: import("zod").ZodSafeParseError<{
                            id: number;
                          }>;
                          outputFormat: "json";
                          status: 400;
                          input: {
                            param: {
                              id: string;
                            };
                          } & {
                            query: {
                              describedby: string;
                            };
                          };
                        }
                      | {
                          output: import("zod").ZodSafeParseError<{
                            describedby: string;
                          }>;
                          outputFormat: "json";
                          status: 400;
                          input: {
                            param: {
                              id: string;
                            };
                          } & {
                            query: {
                              describedby: string;
                            };
                          };
                        };
                  };
                } & {
                  "/": {
                    $put:
                      | {
                          output: "OK";
                          outputFormat: "text";
                          status: 200;
                          input: {
                            param: {
                              id: string;
                            };
                          } & {
                            form: {
                              domain: string;
                            };
                          };
                        }
                      | {
                          output: import("zod").ZodSafeParseError<{
                            id: number;
                          }>;
                          outputFormat: "json";
                          status: 400;
                          input: {
                            param: {
                              id: string;
                            };
                          } & {
                            form: {
                              domain: string;
                            };
                          };
                        }
                      | {
                          output: import("zod").ZodSafeParseError<{
                            domain: string;
                          }>;
                          outputFormat: "json";
                          status: 400;
                          input: {
                            param: {
                              id: string;
                            };
                          } & {
                            form: {
                              domain: string;
                            };
                          };
                        };
                  };
                } & {
                  "/:domain_id": {
                    $delete:
                      | {
                          output: "OK";
                          outputFormat: "text";
                          status: 200;
                          input: {
                            param: {
                              id: string;
                              domain_id: string;
                            };
                          };
                        }
                      | {
                          output: import("zod").ZodSafeParseError<{
                            id: number;
                            domain_id: number;
                          }>;
                          outputFormat: "json";
                          status: 400;
                          input: {
                            param: {
                              id: string;
                              domain_id: string;
                            };
                          };
                        };
                  };
                } & {
                  "/:domain_id": {
                    $patch:
                      | {
                          output: "OK";
                          outputFormat: "text";
                          status: 200;
                          input: {
                            param: {
                              id: string;
                              domain_id: string;
                            };
                          } & {
                            query: {
                              type: "external" | "refused" | "verified";
                            };
                          };
                        }
                      | {
                          output: import("zod").ZodSafeParseError<{
                            id: number;
                            domain_id: number;
                          }>;
                          outputFormat: "json";
                          status: 400;
                          input: {
                            param: {
                              id: string;
                              domain_id: string;
                            };
                          } & {
                            query: {
                              type: "external" | "refused" | "verified";
                            };
                          };
                        }
                      | {
                          output: import("zod").ZodSafeParseError<{
                            type: "external" | "refused" | "verified";
                          }>;
                          outputFormat: "json";
                          status: 400;
                          input: {
                            param: {
                              id: string;
                              domain_id: string;
                            };
                          } & {
                            query: {
                              type: "external" | "refused" | "verified";
                            };
                          };
                        };
                  };
                },
                "/domains"
              >
            | {
                "/": {
                  $get:
                    | {
                        output: {};
                        outputFormat: string;
                        status: import("hono/utils/http-status").StatusCode;
                        input: {
                          param: {
                            id: string;
                          };
                        };
                      }
                    | {
                        output: import("zod").ZodSafeParseError<{
                          id: number;
                        }>;
                        outputFormat: "json";
                        status: 400;
                        input: {
                          param: {
                            id: string;
                          };
                        };
                      };
                };
              }
            | import("hono/types").MergeSchemaPath<
                | {
                    "/": {
                      $get:
                        | {
                            output: {};
                            outputFormat: string;
                            status: import("hono/utils/http-status").StatusCode;
                            input: {
                              param: {
                                id: string;
                              };
                            } & {
                              query: {
                                page?: string | string[] | undefined;
                                page_size?: string | string[] | undefined;
                                describedby: string | string[];
                                page_ref: string | string[];
                              };
                            };
                          }
                        | {
                            output: import("zod").ZodSafeParseError<{
                              id: number;
                            }>;
                            outputFormat: "json";
                            status: 400;
                            input: {
                              param: {
                                id: string;
                              };
                            } & {
                              query: {
                                page?: string | string[] | undefined;
                                page_size?: string | string[] | undefined;
                                describedby: string | string[];
                                page_ref: string | string[];
                              };
                            };
                          }
                        | {
                            output: import("zod").ZodSafeParseError<{
                              page: number;
                              page_size: number;
                              describedby: string;
                              page_ref: string;
                            }>;
                            outputFormat: "json";
                            status: 400;
                            input: {
                              param: {
                                id: string;
                              };
                            } & {
                              query: {
                                page?: string | string[] | undefined;
                                page_size?: string | string[] | undefined;
                                describedby: string | string[];
                                page_ref: string | string[];
                              };
                            };
                          };
                    };
                  }
                | (import("hono/types").MergeSchemaPath<
                    {
                      "/": {
                        $patch:
                          | {
                              output: "OK";
                              outputFormat: "text";
                              status: 200;
                              input: {
                                param: {
                                  id: string;
                                  user_id: string;
                                };
                              } & {
                                form: {
                                  verification_type?:
                                    | "bypassed"
                                    | "code_sent_to_official_contact_email"
                                    | "domain"
                                    | "domain_not_verified_yet"
                                    | "imported_from_coop_mediation_numerique"
                                    | "imported_from_inclusion_connect"
                                    | "in_liste_dirigeants_rna"
                                    | "in_liste_dirigeants_rne"
                                    | "no_validation_means_available"
                                    | "no_verification_means_for_entreprise_unipersonnelle"
                                    | "no_verification_means_for_small_association"
                                    | "no_verification_means_for_small_organization"
                                    | "official_contact_email"
                                    | "ordre_professionnel_domain"
                                    | "organization_dirigeant"
                                    | "proof_received"
                                    | "verified_by_coop_mediation_numerique"
                                    | undefined;
                                  is_external?: string | undefined;
                                };
                              };
                            }
                          | {
                              output: import("zod").ZodSafeParseError<{
                                id: number;
                                user_id: number;
                              }>;
                              outputFormat: "json";
                              status: 400;
                              input: {
                                param: {
                                  id: string;
                                  user_id: string;
                                };
                              } & {
                                form: {
                                  verification_type?:
                                    | "bypassed"
                                    | "code_sent_to_official_contact_email"
                                    | "domain"
                                    | "domain_not_verified_yet"
                                    | "imported_from_coop_mediation_numerique"
                                    | "imported_from_inclusion_connect"
                                    | "in_liste_dirigeants_rna"
                                    | "in_liste_dirigeants_rne"
                                    | "no_validation_means_available"
                                    | "no_verification_means_for_entreprise_unipersonnelle"
                                    | "no_verification_means_for_small_association"
                                    | "no_verification_means_for_small_organization"
                                    | "official_contact_email"
                                    | "ordre_professionnel_domain"
                                    | "organization_dirigeant"
                                    | "proof_received"
                                    | "verified_by_coop_mediation_numerique"
                                    | undefined;
                                  is_external?: string | undefined;
                                };
                              };
                            }
                          | {
                              output: import("zod").ZodSafeParseError<{
                                verification_type?:
                                  | "bypassed"
                                  | "code_sent_to_official_contact_email"
                                  | "domain"
                                  | "domain_not_verified_yet"
                                  | "imported_from_coop_mediation_numerique"
                                  | "imported_from_inclusion_connect"
                                  | "in_liste_dirigeants_rna"
                                  | "in_liste_dirigeants_rne"
                                  | "no_validation_means_available"
                                  | "no_verification_means_for_entreprise_unipersonnelle"
                                  | "no_verification_means_for_small_association"
                                  | "no_verification_means_for_small_organization"
                                  | "official_contact_email"
                                  | "ordre_professionnel_domain"
                                  | "organization_dirigeant"
                                  | "proof_received"
                                  | "verified_by_coop_mediation_numerique"
                                  | undefined;
                                is_external?: boolean | undefined;
                              }>;
                              outputFormat: "json";
                              status: 400;
                              input: {
                                param: {
                                  id: string;
                                  user_id: string;
                                };
                              } & {
                                form: {
                                  verification_type?:
                                    | "bypassed"
                                    | "code_sent_to_official_contact_email"
                                    | "domain"
                                    | "domain_not_verified_yet"
                                    | "imported_from_coop_mediation_numerique"
                                    | "imported_from_inclusion_connect"
                                    | "in_liste_dirigeants_rna"
                                    | "in_liste_dirigeants_rne"
                                    | "no_validation_means_available"
                                    | "no_verification_means_for_entreprise_unipersonnelle"
                                    | "no_verification_means_for_small_association"
                                    | "no_verification_means_for_small_organization"
                                    | "official_contact_email"
                                    | "ordre_professionnel_domain"
                                    | "organization_dirigeant"
                                    | "proof_received"
                                    | "verified_by_coop_mediation_numerique"
                                    | undefined;
                                  is_external?: string | undefined;
                                };
                              };
                            };
                      };
                    } & {
                      "/": {
                        $delete:
                          | {
                              output: "OK";
                              outputFormat: "text";
                              status: 200;
                              input: {
                                param: {
                                  id: string;
                                  user_id: string;
                                };
                              };
                            }
                          | {
                              output: import("zod").ZodSafeParseError<{
                                id: number;
                                user_id: number;
                              }>;
                              outputFormat: "json";
                              status: 400;
                              input: {
                                param: {
                                  id: string;
                                  user_id: string;
                                };
                              };
                            };
                      };
                    },
                    "/:user_id"
                  > & {
                    "/": {
                      $get:
                        | {
                            output: {};
                            outputFormat: string;
                            status: import("hono/utils/http-status").StatusCode;
                            input: {
                              param: {
                                id: string;
                              };
                            } & {
                              query: {
                                page?: string | string[] | undefined;
                                page_size?: string | string[] | undefined;
                                describedby: string | string[];
                                page_ref: string | string[];
                              };
                            };
                          }
                        | {
                            output: import("zod").ZodSafeParseError<{
                              id: number;
                            }>;
                            outputFormat: "json";
                            status: 400;
                            input: {
                              param: {
                                id: string;
                              };
                            } & {
                              query: {
                                page?: string | string[] | undefined;
                                page_size?: string | string[] | undefined;
                                describedby: string | string[];
                                page_ref: string | string[];
                              };
                            };
                          }
                        | {
                            output: import("zod").ZodSafeParseError<{
                              page: number;
                              page_size: number;
                              describedby: string;
                              page_ref: string;
                            }>;
                            outputFormat: "json";
                            status: 400;
                            input: {
                              param: {
                                id: string;
                              };
                            } & {
                              query: {
                                page?: string | string[] | undefined;
                                page_size?: string | string[] | undefined;
                                describedby: string | string[];
                                page_ref: string | string[];
                              };
                            };
                          };
                    };
                  }),
                "/members"
              >,
            "/:id"
          >
      ) & {
        "/": {
          $get:
            | {
                output: {};
                outputFormat: string;
                status: import("hono/utils/http-status").StatusCode;
                input: {
                  query: {
                    id?: string | undefined;
                    page?: string | string[] | undefined;
                    page_size?: string | string[] | undefined;
                    q?: string | undefined;
                  };
                };
              }
            | {
                output: import("zod").ZodSafeParseError<{
                  id?: number | undefined;
                  page: number;
                  page_size: number;
                  q: string;
                }>;
                outputFormat: "json";
                status: 400;
                input: {
                  query: {
                    id?: string | undefined;
                    page?: string | string[] | undefined;
                    page_size?: string | string[] | undefined;
                    q?: string | undefined;
                  };
                };
              };
        };
      },
      "/organizations"
    >
  | import("hono/types").MergeSchemaPath<
      | import("hono/types").BlankSchema
      | import("hono/types").MergeSchemaPath<
          {
            "/": {
              $get:
                | {
                    output: {};
                    outputFormat: string;
                    status: import("hono/utils/http-status").StatusCode;
                    input: {
                      query: {
                        page?: string | string[] | undefined;
                        page_size?: string | string[] | undefined;
                        q?: string | undefined;
                      };
                    };
                  }
                | {
                    output: undefined;
                    outputFormat: "redirect";
                    status: import("hono/utils/http-status").RedirectStatusCode;
                    input: {
                      query: {
                        page?: string | string[] | undefined;
                        page_size?: string | string[] | undefined;
                        q?: string | undefined;
                      };
                    };
                  };
            };
          } & {
            "/": {
              $post:
                | {
                    output: "OK";
                    outputFormat: "text";
                    status: 200;
                    input: {
                      form: {
                        email: string;
                        role: string;
                      };
                    };
                  }
                | {
                    output: import("zod").ZodSafeParseError<{
                      email: string;
                      role: string;
                    }>;
                    outputFormat: "json";
                    status: 400;
                    input: {
                      form: {
                        email: string;
                        role: string;
                      };
                    };
                  };
            };
          } & {
            "/:id": {
              $patch:
                | {
                    output: "Forbidden: cannot modify your own role";
                    outputFormat: "text";
                    status: 403;
                    input: {
                      param: {
                        id: string;
                      };
                    } & {
                      form: {
                        role: string;
                      };
                    };
                  }
                | {
                    output: "OK";
                    outputFormat: "text";
                    status: 200;
                    input: {
                      param: {
                        id: string;
                      };
                    } & {
                      form: {
                        role: string;
                      };
                    };
                  }
                | {
                    output: import("zod").ZodSafeParseError<{
                      id: number;
                    }>;
                    outputFormat: "json";
                    status: 400;
                    input: {
                      param: {
                        id: string;
                      };
                    } & {
                      form: {
                        role: string;
                      };
                    };
                  }
                | {
                    output: import("zod").ZodSafeParseError<{
                      role: string;
                    }>;
                    outputFormat: "json";
                    status: 400;
                    input: {
                      param: {
                        id: string;
                      };
                    } & {
                      form: {
                        role: string;
                      };
                    };
                  };
            };
          } & {
            "/:id/disable": {
              $patch:
                | {
                    output: "Forbidden: cannot disable yourself";
                    outputFormat: "text";
                    status: 403;
                    input: {
                      param: {
                        id: string;
                      };
                    };
                  }
                | {
                    output: "OK";
                    outputFormat: "text";
                    status: 200;
                    input: {
                      param: {
                        id: string;
                      };
                    };
                  }
                | {
                    output: import("zod").ZodSafeParseError<{
                      id: number;
                    }>;
                    outputFormat: "json";
                    status: 400;
                    input: {
                      param: {
                        id: string;
                      };
                    };
                  };
            };
          } & {
            "/:id/enable": {
              $patch:
                | {
                    output: "OK";
                    outputFormat: "text";
                    status: 200;
                    input: {
                      param: {
                        id: string;
                      };
                    };
                  }
                | {
                    output: import("zod").ZodSafeParseError<{
                      id: number;
                    }>;
                    outputFormat: "json";
                    status: 400;
                    input: {
                      param: {
                        id: string;
                      };
                    };
                  };
            };
          },
          "/team"
        >,
      "/admin"
    >
  | import("hono/types").MergeSchemaPath<
      | import("hono/types").BlankSchema
      | import("hono/types").MergeSchemaPath<
          {
            "/reload": {
              $post: {
                output: "ok";
                outputFormat: "text";
                status: import("hono/utils/http-status").ContentfulStatusCode;
                input: {};
              };
            };
          } & {
            "/reload": {
              $get: {
                output: {};
                outputFormat: string;
                status: import("hono/utils/http-status").StatusCode;
                input: {};
              };
            };
          },
          "/"
        >
      | import("hono/types").MergeSchemaPath<
          {
            "/design-system": {
              $get: {
                output: {};
                outputFormat: string;
                status: import("hono/utils/http-status").StatusCode;
                input: {};
              };
            };
          } & {
            "/design-system/dsfr": {
              $get: {
                output: {};
                outputFormat: string;
                status: import("hono/utils/http-status").StatusCode;
                input: {};
              };
            };
          } & {
            "/design-system/tailwind": {
              $get: {
                output: {};
                outputFormat: string;
                status: import("hono/utils/http-status").StatusCode;
                input: {};
              };
            };
          },
          "/"
        >
      | import("hono/types").MergeSchemaPath<
          {
            "/readyz": {
              $get: {
                output: "readyz check passed";
                outputFormat: "text";
                status: import("hono/utils/http-status").ContentfulStatusCode;
                input: {};
              };
            };
          } & {
            "/v4/djepva/api-association/associations/:siren_or_rna": {
              $get: {
                output: {};
                outputFormat: "json";
                status: import("hono/utils/http-status").ContentfulStatusCode;
                input: {
                  param: {
                    siren_or_rna: string;
                  };
                };
              };
            };
          } & {
            "/proxy/files/:id": {
              $get: {
                output: `${string} - Requested GET on /proxy/files/${string}`;
                outputFormat: "text";
                status: import("hono/utils/http-status").ContentfulStatusCode;
                input: {
                  param: {
                    id: string;
                  };
                };
              };
            };
          },
          "/entreprise.api.gouv.fr"
        >
      | import("hono/types").MergeSchemaPath<
          {
            "/.well-known/openid-configuration": {
              $get: {
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
                input: {};
              };
            };
          } & {
            "/jwks": {
              $get: {
                output: {
                  keys: {
                    kty?: string;
                    key_ops?: string[];
                    ext?: boolean;
                    x5c?: string[];
                    x5t?: string;
                    "x5t#S256"?: string;
                    x5u?: string;
                    kid?: string;
                    crv?: string;
                    d?: string;
                    dp?: string;
                    dq?: string;
                    e?: string;
                    k?: string;
                    n?: string;
                    p?: string;
                    q?: string;
                    qi?: string;
                    x?: string;
                    y?: string;
                    pub?: string;
                    priv?: string;
                    alg: string;
                    use: string;
                  }[];
                };
                outputFormat: "json";
                status: import("hono/utils/http-status").ContentfulStatusCode;
                input: {};
              };
            };
          } & {
            "/authorize": {
              $get:
                | {
                    output: undefined;
                    outputFormat: "redirect";
                    status: 302;
                    input: {
                      query: {
                        client_id: string;
                        nonce: string;
                        redirect_uri: string;
                        state: string;
                      };
                    };
                  }
                | {
                    output: import("zod").ZodSafeParseError<{
                      client_id: string;
                      nonce: string;
                      redirect_uri: string;
                      state: string;
                    }>;
                    outputFormat: "json";
                    status: 400;
                    input: {
                      query: {
                        client_id: string;
                        nonce: string;
                        redirect_uri: string;
                        state: string;
                      };
                    };
                  };
            };
          } & {
            "/interaction/:code/login": {
              $get: {
                output: {};
                outputFormat: string;
                status: import("hono/utils/http-status").StatusCode;
                input: {
                  param: {
                    code: string;
                  };
                };
              };
            };
          } & {
            "/interaction/:code/login": {
              $post: {
                output: {};
                outputFormat: string;
                status: import("hono/utils/http-status").StatusCode;
                input: {
                  param: {
                    code: string;
                  };
                };
              };
            };
          } & {
            "/token": {
              $post:
                | {
                    output: {
                      error: string;
                    };
                    outputFormat: "json";
                    status: 400;
                    input: {};
                  }
                | {
                    output: {
                      access_token: string;
                      token_type: string;
                      expires_in: number;
                      id_token: string;
                    };
                    outputFormat: "json";
                    status: import("hono/utils/http-status").ContentfulStatusCode;
                    input: {};
                  };
            };
          } & {
            "/session/end": {
              $get:
                | {
                    output: {};
                    outputFormat: string;
                    status: import("hono/utils/http-status").StatusCode;
                    input: {
                      query: {
                        post_logout_redirect_uri: string;
                        state: string;
                      };
                    };
                  }
                | {
                    output: import("zod").ZodSafeParseError<{
                      post_logout_redirect_uri: string;
                      state: string;
                    }>;
                    outputFormat: "json";
                    status: 400;
                    input: {
                      query: {
                        post_logout_redirect_uri: string;
                        state: string;
                      };
                    };
                  };
            };
          },
          "/auth.agentconnect.gouv.fr/api/v2"
        >
      | import("hono/types").MergeSchemaPath<
          {
            "/readyz": {
              $get: {
                output: "readyz check passed";
                outputFormat: "text";
                status: import("hono/utils/http-status").ContentfulStatusCode;
                input: {};
              };
            };
          } & {
            "/v1/website/:website_id/conversations": {
              $delete: {
                output: {};
                outputFormat: "json";
                status: 200;
                input: {
                  param: {
                    website_id: string;
                  };
                };
              };
            };
          } & {
            "/v1/website/:website_id/conversations": {
              $get: {
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
                input: {
                  param: {
                    website_id: string;
                  };
                };
              };
            };
          } & {
            "/v1/website/:website_id/conversation/:session_id": {
              $get: {
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
                input: {
                  param: {
                    session_id: string;
                  } & {
                    website_id: string;
                  };
                };
              };
            };
          } & {
            "/v1/website/:website_id/conversation": {
              $post: {
                output: {
                  data: {
                    session_id: string;
                  };
                };
                outputFormat: "json";
                status: import("hono/utils/http-status").ContentfulStatusCode;
                input: {
                  param: {
                    website_id: string;
                  };
                };
              };
            };
          } & {
            "/v1/website/:website_id/conversation/:session_id/message": {
              $post: {
                output: {
                  data: {
                    fingerprint: number;
                  };
                };
                outputFormat: "json";
                status: import("hono/utils/http-status").ContentfulStatusCode;
                input: {
                  param: {
                    session_id: string;
                  } & {
                    website_id: string;
                  };
                };
              };
            };
          } & {
            "/v1/website/:website_id/conversation/:session_id/messages": {
              $get: {
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
                input: {
                  param: {
                    session_id: string;
                  } & {
                    website_id: string;
                  };
                };
              };
            };
          } & {
            "/v1/website/:website_id/conversation/:session_id/meta": {
              $patch: {
                output: {};
                outputFormat: "json";
                status: import("hono/utils/http-status").ContentfulStatusCode;
                input: {
                  param: {
                    session_id: string;
                  } & {
                    website_id: string;
                  };
                };
              };
            };
          } & {
            "/v1/website/:website_id/conversation/:session_id/state": {
              $patch: {
                output: {};
                outputFormat: "json";
                status: import("hono/utils/http-status").ContentfulStatusCode;
                input: {
                  param: {
                    session_id: string;
                  } & {
                    website_id: string;
                  };
                };
              };
            };
          } & {
            "/v1/website/:website_id/operators/list": {
              $get: {
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
                input: {
                  param: {
                    website_id: string;
                  };
                };
              };
            };
          },
          "/api.crisp.chat"
        >,
      "/___dev___"
    >
  | ({
      "/healthz": {
        $get: {
          output: "healthz check passed";
          outputFormat: "text";
          status: import("hono/utils/http-status").ContentfulStatusCode;
          input: {};
        };
      };
    } & {
      "/livez": {
        $get: {
          output: "livez check passed";
          outputFormat: "text";
          status: import("hono/utils/http-status").ContentfulStatusCode;
          input: {};
        };
      };
    }),
  "/",
  "*"
>;
export type Router = typeof app;
export default app;
