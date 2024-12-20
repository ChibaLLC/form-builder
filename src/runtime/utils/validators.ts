import { z } from "zod";
import { Field, ImageTypeEnum } from "./constants";

// Enums validation
const ImageTypeEnumSchema = z.nativeEnum(ImageTypeEnum);

// Basic Element Options
const ElementOptionsSchema = z.array(
  z.object({
    value: z.string(),
    label: z.string(),
  })
);

// Base Element Data
const BaseElementDataSchema = z.object({
  type: z.any(),
  label: z.string(),
  inputType: z.nativeEnum(Field),
  accept: z.string().optional(),
  onClick: z.function().args().returns(z.void()).optional(),
  options: z.any().optional(),
  value: z.any().optional(),
  index: z.number(),
  placeholder: z.string().optional(),
  rules: z
    .array(
      z.union([
        z.literal("required"),
        z.string().regex(/^max:\d+$/),
        z.string().regex(/^min:\d+$/),
        z.string().regex(/^same:.+$/),
      ])
    )
    .optional(),
  description: z.string().optional(),
});

// Static Element Data
const StaticElementDataSchema = BaseElementDataSchema.extend({
  type: z.literal(Field.STATIC),
  label: z.never().optional(),
  inputType: z.literal(Field.STATIC),
  value: z.never().optional(),
  text: z.string(),
});

// Select Element Data
const SelectElementDataSchema = BaseElementDataSchema.extend({
  type: z.literal(Field.SELECT),
  inputType: z.literal(Field.SELECT),
  value: z.string().optional(),
  autocomplete: z.boolean().optional(),
  options: ElementOptionsSchema.optional(),
});

// Input Element Data
const InputElementDataSchema = BaseElementDataSchema.extend({
  type: z.enum([
    Field.DATE,
    Field.EMAIL,
    Field.PASSWORD,
    Field.SEARCH,
    Field.TEL,
    Field.TEXT,
    Field.URL,
    Field.NUMBER,
    Field.FILE,
    Field.IMAGE,
  ]),
  inputType: z.enum([
    Field.DATE,
    Field.EMAIL,
    Field.PASSWORD,
    Field.SEARCH,
    Field.TEL,
    Field.TEXT,
    Field.URL,
    Field.NUMBER,
    Field.FILE,
    Field.IMAGE,
  ]),
  value: z.union([z.string(), z.number(), z.instanceof(Date)]).optional(),
});

// Image Input Element Data
const ImageInputElementDataSchema = BaseElementDataSchema.extend({
  type: z.literal(Field.IMAGE),
  inputType: z.literal(Field.IMAGE),
  accept: z.union([ImageTypeEnumSchema, z.string()]).optional(),
  value: z.instanceof(File).optional(),
});

// File Input Element Data
const FileInputElementDataSchema = BaseElementDataSchema.extend({
  type: z.literal(Field.FILE),
  inputType: z.literal(Field.FILE),
  accept: z.string().optional(),
  value: z.instanceof(File).optional(),
});

// Checkbox Element Data
const CheckboxElementDataSchema = BaseElementDataSchema.extend({
  type: z.literal(Field.CHECKBOX),
  inputType: z.literal(Field.CHECKBOX),
  value: z.record(z.string(), z.string()).optional(),
  options: ElementOptionsSchema.optional(),
  multiple: z.boolean(),
});

// Radio Element Data
const RadioElementDataSchema = BaseElementDataSchema.extend({
  type: z.literal(Field.RADIO),
  inputType: z.literal(Field.RADIO),
  value: z.boolean(),
  options: ElementOptionsSchema.optional(),
});

// Textarea Element Data
const TextareaElementDataSchema = BaseElementDataSchema.extend({
  type: z.literal(Field.TEXTAREA),
  inputType: z.literal(Field.TEXTAREA),
  value: z.string(),
});

// Rich Text Element Data
const RichTextElementDataSchema = BaseElementDataSchema.extend({
  type: z.literal(Field.RICHTEXT),
  inputType: z.literal(Field.RICHTEXT),
  value: z.string(),
});

// Button Element Data
const ButtonElementDataSchema = BaseElementDataSchema.extend({
  type: z.literal(Field.BUTTON),
  inputType: z.enum(["submit", "reset", "button"]),
});

// Form Element Data Schema
const FormElementDataSchema = z.union([
  BaseElementDataSchema,
  StaticElementDataSchema,
  SelectElementDataSchema,
  InputElementDataSchema,
  ImageInputElementDataSchema,
  FileInputElementDataSchema,
  CheckboxElementDataSchema,
  RadioElementDataSchema,
  TextareaElementDataSchema,
  RichTextElementDataSchema,
  ButtonElementDataSchema,
]);

// Item Schema
const ItemSchema = z.object({
  index: z.number(),
  qtty: z.number(),
  store: z.number(),
  name: z.string(),
  price: z.number(),
  carted: z.boolean(),
  liked: z.boolean(),
  images: z.array(z.string()),
});

// Page Schema
const PageSchema = z.array(FormElementDataSchema);

// Store Schema
const StoreSchema = z.array(ItemSchema);

// Pages Schema
const PagesSchema = z.record(z.number(), PageSchema);

// Stores Schema
const StoresSchema = z.record(z.number(), StoreSchema);

// Form Schema
const FormSchema = z.object({
  pages: PagesSchema,
  stores: StoresSchema,
});

export {
  FormSchema
};
