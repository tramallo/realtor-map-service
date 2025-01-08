import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { createClient, PostgrestError, SupabaseClient } from "@supabase/supabase-js";

import { CreatePersonData, CreatePropertyData, CreateRealtorData, PersonData, PropertyData, RealtorData, UpdatePersonData, UpdatePropertyData, UpdateRealtorData } from "src/utils/domainSchemas";
import { SupabaseGateway } from "./supabase.gateway";

interface SupabaseSuccessResponse<T> {
    error?: undefined,
    data: T
}
interface SupabaseErrorResponse {
    error: PostgrestError,
    data?: undefined,
}
type SupabaseResponse<T> = Promise<SupabaseSuccessResponse<T> | SupabaseErrorResponse>; 

@Injectable()
export class SupabaseService {
    private supabase: SupabaseClient;

    constructor(private config: ConfigService, private gateway: SupabaseGateway) {
        const projectUrl = this.config.get("SUPABASE_PROJECT_URL");
        const anonKey = this.config.get("SUPABASE_ANON_KEY");

        this.supabase = createClient(projectUrl, anonKey);
    }

    async getProperties(): SupabaseResponse<PropertyData[]> {
        console.log(`supabaseService -> getProperties`);

        let query = this.supabase.from("property").select();
        const { data, error } = await query;

        if (error) {
            return { error };
        }
    
        return { data };
    }
    async getProperty(propertyId: PropertyData["id"]): SupabaseResponse<PropertyData | undefined> {
        console.log(`supabaseService -> getProperty ${propertyId}`);

        const { data, error } = await this.supabase
            .from("property")
            .select()
            .eq("id", propertyId)
        
        if (error) {
            return { error }
        }

        if (data.length == 0) {
            return { data: undefined }
        }

        return { data: data[0] }
    }
    async createProperty(newPropertyData: CreatePropertyData): SupabaseResponse<PropertyData> {
        console.log(`supabaseService -> createProperty ${newPropertyData.address}`)
        const { data, error } = await this.supabase.from("property").insert(newPropertyData).select();

        if (error) {
            return { error };
        }

        this.gateway.notifyCreatedProperty(data[0]);
        return { data: data[0] };
    }
    async updateProperty(propertyId: PropertyData["id"], updateData: UpdatePropertyData): SupabaseResponse<PropertyData> {
        console.log(`supabaseService -> updateProperty ${propertyId}`)
        const { data, error } = await this.supabase.from("property").update(updateData).eq("id", propertyId).select();

        if (error) {
            return { error };
        }

        this.gateway.notifyUpdatedProperty(data[0]);
        return { data: data[0] };
    }

    async getRealtors(): SupabaseResponse<RealtorData[]> {
        console.log(`supabaseService -> getRealtors`)
        const { data, error } = await this.supabase.from("realtor").select();

        return error ? { error } : { data };
    }
    async getRealtor(realtorId: RealtorData["id"]): SupabaseResponse<RealtorData | undefined> {
        console.log(`supabaseService -> getRealtor ${realtorId}`)
        const { data, error } = await this.supabase
            .from("realtor")
            .select()
            .eq("id", realtorId)
        
        if (error) {
            return { error }
        }

        if (data.length == 0) {
            return { data: undefined }
        }

        return { data: data[0] }
    }
    async createRealtor(newRealtorData: CreateRealtorData): SupabaseResponse<RealtorData> {
        console.log(`supabaseService -> createRealtor ${newRealtorData.name}`)
        const { data, error } = await this.supabase.from("realtor").insert(newRealtorData).select();
        
        return error ? { error } : { data: data[0] };
    }
    async updateRealtor(realtorId: RealtorData["id"], updateData: UpdateRealtorData): SupabaseResponse<RealtorData> {
        console.log(`supabaseService -> updateRealtor ${realtorId}`)
        const { data, error } = await this.supabase.from("realtor").update(updateData).eq("id", realtorId).select();

        return error ? { error } : { data: data[0] };
    }

    async getPersons(): SupabaseResponse<PersonData[]> {
        console.log(`supabaseService -> getPersons`)
        const { data, error } = await this.supabase.from("person").select();

        if (error) {
            return { error };
        }

        return { data };
    }
    async getPerson(personId: PersonData["id"]): SupabaseResponse<PersonData | undefined> {
        console.log(`supabaseService -> getPerson ${personId}`)
        const { data, error } = await this.supabase
            .from("person")
            .select()
            .eq("id", personId)
        
        if (error) {
            return { error }
        }

        if (data.length == 0) {
            return { data: undefined }
        }

        return { data: data[0] }
    }
    async createPerson(newPersonData: CreatePersonData): SupabaseResponse<PersonData> {
        console.log(`supabaseService -> createPerson ${newPersonData.name}`)
        const { data, error } = await this.supabase.from("person").insert(newPersonData).select();

        return error ? { error } : { data: data[0] };
    }
    async updatePerson(personId: PersonData["id"], updateData: UpdatePersonData): SupabaseResponse<PersonData> {
        console.log(`supabaseService -> updatePerson ${personId}`)
        const { data, error } = await this.supabase.from("person").update(updateData).eq("id", personId).select();

        if (error) {
            return { error }
        }

        return { data: data[0] };
    }
}