/** This file exposes data schemas used by the bussiness
 * and a custom resolver that helps input data gathering & validation
 * 
 * Such schemas have validation rules attached, provided by zod validator (https://zod.dev)
 */
import { z } from "zod";

/** Base schemas, describes base data used by the system "as saved in database"
 */
const idSchema = z.string();
const timestampSchema = z.number().int().positive().finite()

export interface BaseSchemaFilter {
    id?: string;
    createdBy?: string;
    createdAtBefore?: number;
    createdAtAfter?: number;
    updatedBy?: string | null;
    updatedAtBefore?: number;
    updatedAtAfter?: number;
    deleted?: boolean;
}
export const baseSchema = z.object({
    id: idSchema,
    createdBy: idSchema,
    createdAt: timestampSchema,
    updatedBy: idSchema.optional(),
    updatedAt: timestampSchema.optional(),
    deleted: z.boolean().optional(),
})

export interface PersonSchemaFilter extends BaseSchemaFilter {
    name?: string;
    mobile?: string;
    email?: string;
}
export const personSchema = baseSchema.extend({
    name: z.string(),
    mobile: z.string().optional(),
    email: z.string().email().optional()
})

export interface RealtorSchemaFilter extends BaseSchemaFilter {
    name?: string;
}
export const realtorSchema = baseSchema.extend({
    name: z.string()
})

export const coordinatesSchema = z.object({
    lat: z.coerce.number().finite().safe(),
    lng: z.coerce.number().finite().safe()
})

export const propertyTypes = ['house', 'apartment'] as const;
export const propertyStates = ['rented', 'available', 'reserved'] as const

export interface PropertySchemaFilter extends BaseSchemaFilter {
    address?: string;
    type?: string;
    state?: string;
    ownerId?: number;
    relatedRealtorIds?: number[];
    exclusiveRealtorId?: number;
}
export const propertySchema = baseSchema.extend({
    address: z.string(),
    coordinates: coordinatesSchema,
    type: z.enum(propertyTypes),
    state: z.enum(propertyStates).optional(),
    ownerId: idSchema.optional(),
    relatedRealtorIds: idSchema.array().optional(),
    exclusiveRealtorId: idSchema.optional(),
    description: z.string().optional(),
})

export const showingAppointmentSchema = baseSchema.extend({
    property: propertySchema,
    agent: personSchema,
    client: personSchema,
    date: z.string(),
    time: z.string()
})

export type PersonSchema = typeof personSchema;
export type RealtorSchema = typeof realtorSchema;
export type CoordinatesSchema = typeof coordinatesSchema;
export type PropertySchema = typeof propertySchema;
export type ShowingAppointmentSchema = typeof showingAppointmentSchema;

export type PersonData = z.infer<typeof personSchema>;
export type RealtorData = z.infer<typeof realtorSchema>;
export type CoordinatesData = z.infer<typeof coordinatesSchema>;
export type PropertyData = z.infer<typeof propertySchema>;
export type ShowingAppointmentData = z.infer<typeof showingAppointmentSchema>;

/** Variation schemas, some operations use only parts of the data
 * 
 * ex: when creating new data, ids are not provided by user, if not specified, zod will expect & and validate an id,
 * so this shcemas are used on that scenarios 
 */
export const createPropertySchema = propertySchema.omit({
    id: true,
    updatedBy: true,
    updatedAt: true,
})

export const updatePropertySchema = propertySchema.omit({
    id: true,
    createdBy: true,
    createdAt: true
}).partial()

export const createPersonSchema = personSchema.omit({
    id: true,
    updatedBy: true,
    updatedAt: true,
})

export const updatePersonSchema = personSchema.omit({
    id: true,
    createdBy: true,
    createdAt: true
}).partial()

export const createRealtorSchema = realtorSchema.omit({
    id: true,
    updatedBy: true,
    updatedAt: true,
})

export const updateRealtorSchema = realtorSchema.omit({
    id: true,
    createdBy: true,
    createdAt: true,
}).partial()

export type CreatePropertySchema = typeof createPropertySchema;
export type UpdatePropertySchema = typeof updatePropertySchema;
export type CreatePersonSchema = typeof createPersonSchema;
export type UpdatePersonSchema = typeof updatePersonSchema
export type CreateRealtorSchema = typeof createRealtorSchema;
export type UpdateRealtorSchema = typeof updateRealtorSchema;

export type CreatePropertyData = z.infer<typeof createPropertySchema>;
export type UpdatePropertyData = z.infer<typeof updatePropertySchema>;
export type CreatePersonData = z.infer<typeof createPersonSchema>;
export type UpdatePersonData = z.infer<typeof updatePersonSchema>
export type CreateRealtorData = z.infer<typeof createRealtorSchema>;
export type UpdateRealtorData = z.infer<typeof updateRealtorSchema>;
