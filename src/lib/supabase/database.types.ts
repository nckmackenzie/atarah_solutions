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
      clients: {
        Row: {
          active: boolean
          address: string | null
          contact: string
          createdAt: string | null
          email: string
          id: string
          name: string
          openingBalance: number | null
          openingBalanceDate: string | null
          taxPin: string | null
        }
        Insert: {
          active?: boolean
          address?: string | null
          contact: string
          createdAt?: string | null
          email: string
          id?: string
          name: string
          openingBalance?: number | null
          openingBalanceDate?: string | null
          taxPin?: string | null
        }
        Update: {
          active?: boolean
          address?: string | null
          contact?: string
          createdAt?: string | null
          email?: string
          id?: string
          name?: string
          openingBalance?: number | null
          openingBalanceDate?: string | null
          taxPin?: string | null
        }
        Relationships: []
      }
      forms: {
        Row: {
          formName: string
          id: number
          menuOrder: number
          moduleId: number
          moduleName: string
          path: string
        }
        Insert: {
          formName: string
          id?: number
          menuOrder: number
          moduleId: number
          moduleName: string
          path: string
        }
        Update: {
          formName?: string
          id?: number
          menuOrder?: number
          moduleId?: number
          moduleName?: string
          path?: string
        }
        Relationships: []
      }
      invoice_details: {
        Row: {
          headerId: string
          id: number
          qty: number
          rate: number
          remarks: string | null
          serviceId: string
        }
        Insert: {
          headerId: string
          id?: number
          qty?: number
          rate: number
          remarks?: string | null
          serviceId: string
        }
        Update: {
          headerId?: string
          id?: number
          qty?: number
          rate?: number
          remarks?: string | null
          serviceId?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoice_details_headerId_fkey"
            columns: ["headerId"]
            isOneToOne: false
            referencedRelation: "invoice_headers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoice_details_serviceId_fkey"
            columns: ["serviceId"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      invoice_headers: {
        Row: {
          clientId: string
          createdAt: string
          createdBy: string
          exclusiveAmount: number
          id: string
          inclusiveAmount: number | null
          invoiceDate: string
          invoiceNo: number
          vat: number
          vatAmount: number
          vatType: Database["public"]["Enums"]["vat_type"]
        }
        Insert: {
          clientId: string
          createdAt?: string
          createdBy?: string
          exclusiveAmount: number
          id?: string
          inclusiveAmount?: number | null
          invoiceDate: string
          invoiceNo: number
          vat?: number
          vatAmount?: number
          vatType?: Database["public"]["Enums"]["vat_type"]
        }
        Update: {
          clientId?: string
          createdAt?: string
          createdBy?: string
          exclusiveAmount?: number
          id?: string
          inclusiveAmount?: number | null
          invoiceDate?: string
          invoiceNo?: number
          vat?: number
          vatAmount?: number
          vatType?: Database["public"]["Enums"]["vat_type"]
        }
        Relationships: [
          {
            foreignKeyName: "invoice_headers_clientId_fkey"
            columns: ["clientId"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      invoice_payments: {
        Row: {
          amount: number
          createdAt: string
          createdBy: string
          id: string
          invoiceId: string | null
          paymentMethod: Database["public"]["Enums"]["payment_type"] | null
          paymentReference: string | null
          transacfionType:
            | Database["public"]["Enums"]["invoice_payment_type"]
            | null
          transactionDate: string
          transactionId: string | null
        }
        Insert: {
          amount: number
          createdAt?: string
          createdBy?: string
          id?: string
          invoiceId?: string | null
          paymentMethod?: Database["public"]["Enums"]["payment_type"] | null
          paymentReference?: string | null
          transacfionType?:
            | Database["public"]["Enums"]["invoice_payment_type"]
            | null
          transactionDate: string
          transactionId?: string | null
        }
        Update: {
          amount?: number
          createdAt?: string
          createdBy?: string
          id?: string
          invoiceId?: string | null
          paymentMethod?: Database["public"]["Enums"]["payment_type"] | null
          paymentReference?: string | null
          transacfionType?:
            | Database["public"]["Enums"]["invoice_payment_type"]
            | null
          transactionDate?: string
          transactionId?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invoice_payments_invoiceId_fkey"
            columns: ["invoiceId"]
            isOneToOne: false
            referencedRelation: "invoice_headers"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          activated: boolean | null
          active: boolean | null
          contact: string | null
          id: string
          username: string | null
        }
        Insert: {
          activated?: boolean | null
          active?: boolean | null
          contact?: string | null
          id: string
          username?: string | null
        }
        Update: {
          activated?: boolean | null
          active?: boolean | null
          contact?: string | null
          id?: string
          username?: string | null
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
      services: {
        Row: {
          createdAt: string
          description: string | null
          id: string
          serviceName: string
          serviceRate: number
        }
        Insert: {
          createdAt?: string
          description?: string | null
          id?: string
          serviceName: string
          serviceRate: number
        }
        Update: {
          createdAt?: string
          description?: string | null
          id?: string
          serviceName?: string
          serviceRate?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      invoice_payment_type: "opening_balance" | "debit" | "credit"
      payment_type: "cash" | "mpesa" | "cheque" | "bank"
      vat_type: "no_vat" | "inclusive" | "exclusive"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never
