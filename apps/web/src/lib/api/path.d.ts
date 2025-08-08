export interface paths {
  "/api/v1/health": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** Health Check */
    get: operations["health_check_api_v1_health_get"];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/v1/auth/register": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /**
     * Register
     * @description Register a new user with enhanced cookie session.
     */
    post: operations["register_api_v1_auth_register_post"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/v1/auth/login": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /**
     * Login
     * @description Login a user to system
     */
    post: operations["login_api_v1_auth_login_post"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/v1/auth/logout": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /**
     * Logout
     * @description Logout current user
     */
    post: operations["logout_api_v1_auth_logout_post"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/v1/auth/me": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /**
     * Get Current User Info
     * @description Get current user information
     */
    get: operations["get_current_user_info_api_v1_auth_me_get"];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/v1/auth/check-auth": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /**
     * Check Auth Status
     * @description Check if user is currently logged in based on session cookie.
     */
    get: operations["check_auth_status_api_v1_auth_check_auth_get"];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
}
export type webhooks = Record<string, never>;
export interface components {
  schemas: {
    /**
     * AuthStatusResponse
     * @description Auth status check response payload
     */
    AuthStatusResponse: {
      /**
       * Logged In
       * @description Whether the user is currently logged in
       * @example true
       */
      logged_in: boolean;
    };
    /** CommonResponse[AuthStatusResponse] */
    CommonResponse_AuthStatusResponse_: {
      /** Message */
      message: string;
      detail: components["schemas"]["AuthStatusResponse"] | null;
    };
    /** CommonResponse[UserLoginResponse] */
    CommonResponse_UserLoginResponse_: {
      /** Message */
      message: string;
      detail: components["schemas"]["UserLoginResponse"] | null;
    };
    /** CommonResponse[UserRegisterResponse] */
    CommonResponse_UserRegisterResponse_: {
      /** Message */
      message: string;
      detail: components["schemas"]["UserRegisterResponse"] | null;
    };
    /** CommonResponse[dict] */
    CommonResponse_dict_: {
      /** Message */
      message: string;
      /** Detail */
      detail: {
        [key: string]: unknown;
      } | null;
    };
    /** HTTPValidationError */
    HTTPValidationError: {
      /** Detail */
      detail?: components["schemas"]["ValidationError"][];
    };
    /**
     * UserLoginRequest
     * @description User login request payload.
     */
    UserLoginRequest: {
      /**
       * Username Or Email
       * @example john_doe
       */
      username_or_email: string;
      /**
       * Password
       * @example strongpassword123
       */
      password: string;
      /**
       * Remember Me
       * @default false
       * @example true
       */
      remember_me: boolean | null;
    };
    /**
     * UserLoginResponse
     * @description User Login response payload
     */
    UserLoginResponse: {
      /**
       * Display
       * @example John Doe
       */
      display: string;
      /**
       * Username
       * @example john_doe
       */
      username: string;
      /**
       * Email
       * Format: email
       * @example john@example.com
       */
      email: string;
    };
    /**
     * UserRegisterRequest
     * @description User registration request payload.
     */
    UserRegisterRequest: {
      /**
       * Username
       * @example john_doe
       */
      username: string;
      /**
       * Email
       * Format: email
       * @example john@example.com
       */
      email: string;
      /**
       * Password
       * @example strongpassword123
       */
      password: string;
    };
    /**
     * UserRegisterResponse
     * @description User Register response payload
     */
    UserRegisterResponse: {
      /**
       * Display
       * @example John Doe
       */
      display: string;
      /**
       * Username
       * @example john_doe
       */
      username: string;
      /**
       * Email
       * Format: email
       * @example john@example.com
       */
      email: string;
    };
    /** ValidationError */
    ValidationError: {
      /** Location */
      loc: (string | number)[];
      /** Message */
      msg: string;
      /** Error Type */
      type: string;
    };
  };
  responses: never;
  parameters: never;
  requestBodies: never;
  headers: never;
  pathItems: never;
}
export type $defs = Record<string, never>;
export interface operations {
  health_check_api_v1_health_get: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description Successful Response */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": unknown;
        };
      };
    };
  };
  register_api_v1_auth_register_post: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["UserRegisterRequest"];
      };
    };
    responses: {
      /** @description Successful Response */
      201: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["CommonResponse_UserRegisterResponse_"];
        };
      };
      /** @description Validation Error */
      422: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  login_api_v1_auth_login_post: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["UserLoginRequest"];
      };
    };
    responses: {
      /** @description Successful Response */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["CommonResponse_UserLoginResponse_"];
        };
      };
      /** @description Validation Error */
      422: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  logout_api_v1_auth_logout_post: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description Successful Response */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["CommonResponse_dict_"];
        };
      };
    };
  };
  get_current_user_info_api_v1_auth_me_get: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description Successful Response */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["CommonResponse_UserLoginResponse_"];
        };
      };
    };
  };
  check_auth_status_api_v1_auth_check_auth_get: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description Successful Response */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["CommonResponse_AuthStatusResponse_"];
        };
      };
    };
  };
}
