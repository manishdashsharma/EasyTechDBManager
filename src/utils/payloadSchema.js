import { z } from "zod";

const databaseSchema = z.object({
  databaseName: z
    .string()
    .nonempty()
    .min(1)
    .max(255)
    .refine((value) => value === value.toLowerCase(), {
      message: "Database name must be in lowercase",
      path: ["databaseName"],
    }),
  mongodbURI: z.string().url(),
  collectionName: z
    .union([
      z
        .string()
        .nonempty()
        .min(1)
        .max(255)
        .refine((value) => value === value.toLowerCase(), {
          message: "Collection name must be in lowercase",
          path: ["collectionName"],
        }),
      z.array(
        z
          .string()
          .nonempty()
          .min(1)
          .max(255)
          .refine((value) => value === value.toLowerCase(), {
            message: "Collection names must be in lowercase",
            path: ["collectionName"],
          })
      ),
    ])
    .optional(),
});

const userDataSchema = z.object({
  email: z.string().email(),
});

const dropDatabaseSchema = z.object({
  databaseName: z
    .string()
    .nonempty()
    .min(1)
    .max(255)
    .refine((value) => value === value.toLowerCase(), {
      message: "Database name must be in lowercase",
      path: ["databaseName"],
    }),
  mongodbURI: z.string().url(),
});

const dropCollectionSchema = z.object({
  databaseName: z
    .string()
    .nonempty()
    .min(1)
    .max(255)
    .refine((value) => value === value.toLowerCase(), {
      message: "Database name must be in lowercase",
      path: ["databaseName"],
    }),
  mongodbURI: z.string().url(),
  collectionName: z.union([
    z
      .string()
      .nonempty()
      .min(1)
      .max(255)
      .refine((value) => value === value.toLowerCase(), {
        message: "Collection name must be in lowercase",
        path: ["collectionName"],
      }),
    z.array(
      z
        .string()
        .nonempty()
        .min(1)
        .max(255)
        .refine((value) => value === value.toLowerCase(), {
          message: "Collection names must be in lowercase",
          path: ["collectionName"],
        })
    ),
  ]),
});

const insertDocumentSchema = z.object({
  databaseName: z.string().nonempty().min(1).max(255).transform(value => value.toLowerCase()),
  mongodbURI: z.string().url(),
  collectionName: z.string().nonempty().min(1).max(255),
  document: z.record(z.any()), // Example: You can replace 'z.any()' with specific structure validation.
});

const fetchDocumentsSchema = z.object({
  databaseName: z.string().nonempty().min(1).max(255).transform(value => value.toLowerCase()),
  mongodbURI: z.string().url(),
  collectionName: z.string().nonempty().min(1).max(255),
  query: z.record(z.any()).optional(),
  limit: z.number().int().optional(),
  offset: z.number().int().optional(),
});

const updateDocumentSchema = z.object({
  databaseName: z.string().nonempty().min(1).max(255).transform(value => value.toLowerCase()),
  mongodbURI: z.string().url(),
  collectionName: z.string().nonempty().min(1).max(255),
  filter: z.record(z.any()), // Example: Replace 'z.any()' with specific filter schema.
  update: z.record(z.any()), // Example: Replace 'z.any()' with specific update schema.
});

const deleteDocumentSchema = z.object({
  databaseName: z.string().nonempty().min(1).max(255).transform(value => value.toLowerCase()),
  mongodbURI: z.string().url(),
  collectionName: z.string().nonempty().min(1).max(255),
  filter: z.record(z.any()), // Example: Replace 'z.any()' with specific filter schema.
});

export {
  databaseSchema,
  userDataSchema,
  dropDatabaseSchema,
  dropCollectionSchema,
  insertDocumentSchema,
  fetchDocumentsSchema,
  updateDocumentSchema,
  deleteDocumentSchema,
};
