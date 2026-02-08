export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export type Database = {
    public: {
        Tables: {
            maintenance_logs: {
                Row: {
                    created_at: string | null
                    date: string
                    id: string
                    notes: string | null
                    odometer_km: number
                    task_key: string
                    user_id: string
                    vehicle_id: string
                }
                Insert: {
                    created_at?: string | null
                    date: string
                    id?: string
                    notes?: string | null
                    odometer_km: number
                    task_key: string
                    user_id: string
                    vehicle_id: string
                }
                Update: {
                    created_at?: string | null
                    date?: string
                    id?: string
                    notes?: string | null
                    odometer_km?: number
                    task_key?: string
                    user_id?: string
                    vehicle_id?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "maintenance_logs_user_id_fkey"
                        columns: ["user_id"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "maintenance_logs_vehicle_id_fkey"
                        columns: ["vehicle_id"]
                        isOneToOne: false
                        referencedRelation: "vehicles"
                        referencedColumns: ["id"]
                    },
                ]
            }
            profiles: {
                Row: {
                    created_at: string | null
                    id: string
                    plan: string | null
                    stripe_customer_id: string | null
                    vehicles_limit: number | null
                }
                Insert: {
                    created_at?: string | null
                    id: string
                    plan?: string | null
                    stripe_customer_id?: string | null
                    vehicles_limit?: number | null
                }
                Update: {
                    created_at?: string | null
                    id?: string
                    plan?: string | null
                    stripe_customer_id?: string | null
                    vehicles_limit?: number | null
                }
                Relationships: [
                    {
                        foreignKeyName: "profiles_id_fkey"
                        columns: ["id"]
                        isOneToOne: true
                        referencedRelation: "users"
                        referencedColumns: ["id"]
                    },
                ]
            }
            vehicles: {
                Row: {
                    created_at: string | null
                    id: string
                    make: string
                    model: string
                    odometer_km: number | null
                    type: string | null
                    user_id: string
                }
                Insert: {
                    created_at?: string | null
                    id?: string
                    make: string
                    model: string
                    odometer_km?: number | null
                    type?: string | null
                    user_id: string
                }
                Update: {
                    created_at?: string | null
                    id?: string
                    make?: string
                    model?: string
                    odometer_km?: number | null
                    type?: string | null
                    user_id?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "vehicles_user_id_fkey"
                        columns: ["user_id"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    },
                ]
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            [_ in never]: never
        }
        Enums: {
            [_ in never]: never
        }
        CompositeTypes: {
            [_ in never]: never
        }
    }
}
