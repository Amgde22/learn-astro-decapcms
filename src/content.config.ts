// src/content/config.ts

import { defineCollection, z } from "astro:content";



// Define the 'products' collection
const productsCollection = defineCollection({
  type: 'data',
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      description: z.string(),
      price: z.number().min(0),
      offer: z.number().min(0).optional(),
      image: image(),
      images: z
        .array(
          z.object({
            image: image(),
          })
        )
        .optional(),
      tags: z.union([z.array(z.any()), z.null()]).optional(),
      in_stock: z
      .enum(["true", "false"]) // Expect one of these two strings
      .transform((val) => val === 'true') // Convert the string "true" to the boolean true
      .optional()
      .default('true'), // The default value from the CMS is the string 'true'
    }),
});

export const collections = {
  products: productsCollection,
};
