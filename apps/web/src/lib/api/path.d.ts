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
  "/api/v1/auth/edit": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    /**
     * Edit User
     * @description Edit current user information.
     */
    put: operations["edit_user_api_v1_auth_edit_put"];
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/v1/collections": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /**
     * Get Collections
     * @description Get all collections the user has access to.
     */
    get: operations["get_collections_api_v1_collections_get"];
    put?: never;
    /**
     * Create Collection
     * @description Create a new collection.
     */
    post: operations["create_collection_api_v1_collections_post"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/v1/collections/search": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /**
     * Search Collections
     * @description Search collections by title with optional fuzzy matching and pagination.
     */
    get: operations["search_collections_api_v1_collections_search_get"];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/v1/collections/{collection_id}": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /**
     * Get Collection
     * @description Get a collection by ID.
     */
    get: operations["get_collection_api_v1_collections__collection_id__get"];
    /**
     * Update Collection
     * @description Update a collection by ID.
     */
    put: operations["update_collection_api_v1_collections__collection_id__put"];
    post?: never;
    /**
     * Delete Collection
     * @description Delete a collection by ID.
     */
    delete: operations["delete_collection_api_v1_collections__collection_id__delete"];
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/v1/collections/{collection_id}/audits": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /**
     * Get Collection Audits
     * @description Get audits for a collection by ID.
     */
    get: operations["get_collection_audits_api_v1_collections__collection_id__audits_get"];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/v1/collections/{collection_id}/permissions": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /**
     * Get Collection Permissions
     * @description Get all permissions for a collection.
     */
    get: operations["get_collection_permissions_api_v1_collections__collection_id__permissions_get"];
    put?: never;
    /**
     * Grant Collection Permission
     * @description Grant permission to a user for a collection.
     */
    post: operations["grant_collection_permission_api_v1_collections__collection_id__permissions_post"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/v1/collections/{collection_id}/permissions/{user_id}": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    /**
     * Update Collection Permission
     * @description Update permission for a user on a collection.
     */
    put: operations["update_collection_permission_api_v1_collections__collection_id__permissions__user_id__put"];
    post?: never;
    /**
     * Revoke Collection Permission
     * @description Revoke permission for a user on a collection.
     */
    delete: operations["revoke_collection_permission_api_v1_collections__collection_id__permissions__user_id__delete"];
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/v1/storage/upload": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /**
     * Upload File
     * @description Upload a file to storage.
     */
    post: operations["upload_file_api_v1_storage_upload_post"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/v1/storage/files": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /**
     * Get User Files
     * @description Get all files uploaded by the current user.
     */
    get: operations["get_user_files_api_v1_storage_files_get"];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/v1/storage/files/{file_id}": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /**
     * Get File
     * @description Get a specific file by ID.
     */
    get: operations["get_file_api_v1_storage_files__file_id__get"];
    put?: never;
    post?: never;
    /**
     * Delete File
     * @description Delete a file by ID.
     */
    delete: operations["delete_file_api_v1_storage_files__file_id__delete"];
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/v1/documents/uploads": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /**
     * Bulk Upload Documents
     * @description Bulk upload multiple files to the same collection. Each file can have its own title and description.
     */
    post: operations["bulk_upload_documents_api_v1_documents_uploads_post"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/v1/documents/{document_id}": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post?: never;
    /**
     * Delete Document
     * @description Delete a document by ID. Only the owner can delete their document.
     */
    delete: operations["delete_document_api_v1_documents__document_id__delete"];
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
    /** Body_bulk_upload_documents_api_v1_documents_uploads_post */
    Body_bulk_upload_documents_api_v1_documents_uploads_post: {
      /** Items */
      items: components["schemas"]["DocumentUploadItem"][];
      /** Collection Id */
      collection_id?: string | null;
    };
    /** Body_upload_file_api_v1_storage_upload_post */
    Body_upload_file_api_v1_storage_upload_post: {
      /**
       * File
       * Format: binary
       */
      file: File;
      /** Resource */
      resource: string;
    };
    /**
     * CollectionAuditResponse
     * @description Collection audit response payload
     */
    CollectionAuditResponse: {
      /**
       * Id
       * Format: uuid
       */
      id: string;
      /**
       * Collection Id
       * Format: uuid
       */
      collection_id: string;
      /** Performed By */
      performed_by: string | null;
      /** Performed At */
      performed_at: string;
      /** Action */
      action: string;
    };
    /**
     * CollectionCreateRequest
     * @description Collection Create request payload
     */
    CollectionCreateRequest: {
      /**
       * Title
       * @example My Collection
       */
      title: string;
      /**
       * Description
       * @example A description of the collection
       */
      description?: string | null;
    };
    /**
     * CollectionPermissionEnum
     * @enum {string}
     */
    CollectionPermissionEnum: "READ" | "EDIT" | "OWNER";
    /**
     * CollectionPermissionRequest
     * @description Collection permission request payload
     */
    CollectionPermissionRequest: {
      /**
       * User Id
       * @example 123e4567-e89b-12d3-a456-426614174000
       */
      user_id: string;
      /** @example READ */
      permission_level: components["schemas"]["CollectionPermissionEnum"];
    };
    /**
     * CollectionPermissionResponse
     * @description Collection permission response payload
     */
    CollectionPermissionResponse: {
      /**
       * Id
       * Format: uuid
       */
      id: string;
      /**
       * Collection Id
       * Format: uuid
       */
      collection_id: string;
      /**
       * User Id
       * Format: uuid
       */
      user_id: string;
      permission_level: components["schemas"]["CollectionPermissionEnum"];
    };
    /**
     * CollectionResponse
     * @description Collection response payload
     */
    CollectionResponse: {
      /**
       * Id
       * Format: uuid
       */
      id: string;
      /** Title */
      title: string | null;
      /** Description */
      description: string | null;
      /** Summary */
      summary: string | null;
      /**
       * Contributor
       * @description Array of contributors with display name and image
       */
      contributor?: components["schemas"]["ContributorResponse"][];
      /**
       * Latest Update
       * @description Latest update timestamp
       */
      latest_update?: string | null;
      /**
       * Document Count
       * @description Number of documents in the collection
       * @default 0
       */
      document_count: number;
    };
    /** CommonResponse[AuthStatusResponse] */
    CommonResponse_AuthStatusResponse_: {
      /** Message */
      message: string;
      detail: components["schemas"]["AuthStatusResponse"] | null;
    };
    /** CommonResponse[UserEditResponse] */
    CommonResponse_UserEditResponse_: {
      /** Message */
      message: string;
      detail: components["schemas"]["UserEditResponse"] | null;
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
    /**
     * ContributorResponse
     * @description Contributor response model
     */
    ContributorResponse: {
      /**
       * Display
       * @description Display name of the contributor
       */
      display: string;
      /**
       * Imgurl
       * @description Profile image URL of the contributor
       */
      imgUrl?: string | null;
    };
    /** DocumentResponse */
    DocumentResponse: {
      /**
       * Id
       * Format: uuid
       */
      id: string;
      /** Collection Id */
      collection_id?: string | null;
      user?: components["schemas"]["UserInfoSchema"] | null;
      file?: components["schemas"]["FileResponse"] | null;
      /** Title */
      title: string | null;
      /** Description */
      description: string | null;
      /** Summary */
      summary: string | null;
      /** Is Vectorized */
      is_vectorized: boolean;
      /** Is Graph Extracted */
      is_graph_extracted: boolean;
      knowledge_graph: components["schemas"]["KnowledgeGraph"] | null;
    };
    /** DocumentUploadItem */
    DocumentUploadItem: {
      /**
       * File
       * Format: binary
       */
      file: File;
      /** Title */
      title?: string | null;
      /** Description */
      description?: string | null;
    };
    /** EdgeDataSchema */
    EdgeDataSchema: {
      /** Label */
      label: string;
    };
    /** EdgeSchema */
    EdgeSchema: {
      /** Id */
      id: string;
      data: components["schemas"]["EdgeDataSchema"];
      /** Source */
      source: string;
      /** Target */
      target: string;
    };
    /** FileResponse */
    FileResponse: {
      /**
       * Id
       * Format: uuid
       */
      id: string;
      /** Upload By */
      upload_by?: string | null;
      /**
       * Upload At
       * Format: date-time
       */
      upload_at: string;
      /** Name */
      name: string;
      /** Size */
      size: number;
      /** Type */
      type: string;
      /** Resource */
      resource: string;
      /** Url */
      url: string;
    };
    /** HTTPValidationError */
    HTTPValidationError: {
      /** Detail */
      detail?: components["schemas"]["ValidationError"][];
    };
    /** KnowledgeGraph */
    KnowledgeGraph: {
      /** Nodes */
      nodes: components["schemas"]["NodeSchema"][];
      /** Edges */
      edges: components["schemas"]["EdgeSchema"][];
    };
    /** NodeDataSchema */
    NodeDataSchema: {
      /** Label */
      label: string;
    };
    /** NodeSchema */
    NodeSchema: {
      /** Id */
      id: string;
      data: components["schemas"]["NodeDataSchema"];
    };
    /**
     * UserEditRequest
     * @description User edit request payload
     */
    UserEditRequest: {
      /**
       * Display
       * @example John Doe
       */
      display?: string | null;
    };
    /**
     * UserEditResponse
     * @description User edit response payload
     */
    UserEditResponse: {
      /**
       * Display
       * @example John Doe
       */
      display: string;
    };
    /** UserInfoSchema */
    UserInfoSchema: {
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
     * UserLoginRequest
     * @description User login request payload.
     */
    UserLoginRequest: {
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
  edit_user_api_v1_auth_edit_put: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["UserEditRequest"];
      };
    };
    responses: {
      /** @description Successful Response */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["CommonResponse_UserEditResponse_"];
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
  get_collections_api_v1_collections_get: {
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
          "application/json": components["schemas"]["CollectionResponse"][];
        };
      };
    };
  };
  create_collection_api_v1_collections_post: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["CollectionCreateRequest"];
      };
    };
    responses: {
      /** @description Successful Response */
      201: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["CollectionResponse"];
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
  search_collections_api_v1_collections_search_get: {
    parameters: {
      query?: {
        word?: string;
        page?: number;
        per_page?: number;
      };
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
          "application/json": components["schemas"]["CollectionResponse"][];
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
  get_collection_api_v1_collections__collection_id__get: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        collection_id: string;
      };
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
          "application/json": components["schemas"]["CollectionResponse"];
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
  update_collection_api_v1_collections__collection_id__put: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        collection_id: string;
      };
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["CollectionCreateRequest"];
      };
    };
    responses: {
      /** @description Successful Response */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["CollectionResponse"];
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
  delete_collection_api_v1_collections__collection_id__delete: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        collection_id: string;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description Successful Response */
      204: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
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
  get_collection_audits_api_v1_collections__collection_id__audits_get: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        collection_id: string;
      };
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
          "application/json": components["schemas"]["CollectionAuditResponse"][];
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
  get_collection_permissions_api_v1_collections__collection_id__permissions_get: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        collection_id: string;
      };
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
          "application/json": components["schemas"]["CollectionPermissionResponse"][];
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
  grant_collection_permission_api_v1_collections__collection_id__permissions_post: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        collection_id: string;
      };
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["CollectionPermissionRequest"];
      };
    };
    responses: {
      /** @description Successful Response */
      201: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["CollectionPermissionResponse"];
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
  update_collection_permission_api_v1_collections__collection_id__permissions__user_id__put: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        collection_id: string;
        user_id: string;
      };
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["CollectionPermissionRequest"];
      };
    };
    responses: {
      /** @description Successful Response */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["CollectionPermissionResponse"];
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
  revoke_collection_permission_api_v1_collections__collection_id__permissions__user_id__delete: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        collection_id: string;
        user_id: string;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description Successful Response */
      204: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
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
  upload_file_api_v1_storage_upload_post: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "multipart/form-data": components["schemas"]["Body_upload_file_api_v1_storage_upload_post"];
      };
    };
    responses: {
      /** @description Successful Response */
      201: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["FileResponse"];
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
  get_user_files_api_v1_storage_files_get: {
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
          "application/json": components["schemas"]["FileResponse"][];
        };
      };
    };
  };
  get_file_api_v1_storage_files__file_id__get: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        file_id: string;
      };
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
          "application/json": components["schemas"]["FileResponse"];
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
  delete_file_api_v1_storage_files__file_id__delete: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        file_id: string;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description Successful Response */
      204: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
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
  bulk_upload_documents_api_v1_documents_uploads_post: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/x-www-form-urlencoded": components["schemas"]["Body_bulk_upload_documents_api_v1_documents_uploads_post"];
      };
    };
    responses: {
      /** @description Successful Response */
      201: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["DocumentResponse"][];
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
  delete_document_api_v1_documents__document_id__delete: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        document_id: string;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description Successful Response */
      204: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
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
}
