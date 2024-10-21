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
      expenses_details: {
        Row: {
          accountId: number
          amount: number
          headerId: string
          id: number
          narration: string | null
        }
        Insert: {
          accountId: number
          amount: number
          headerId: string
          id?: number
          narration?: string | null
        }
        Update: {
          accountId?: number
          amount?: number
          headerId?: string
          id?: number
          narration?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "expenses_details_accountId_fkey"
            columns: ["accountId"]
            isOneToOne: false
            referencedRelation: "gl_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "expenses_details_headerId_fkey"
            columns: ["headerId"]
            isOneToOne: false
            referencedRelation: "expenses_headers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "expenses_details_headerId_fkey"
            columns: ["headerId"]
            isOneToOne: false
            referencedRelation: "vw_expenses"
            referencedColumns: ["id"]
          },
        ]
      }
      expenses_headers: {
        Row: {
          createdAt: string
          expenseDate: string
          expenseNo: number
          id: string
          payee: string
          paymentMethod: Database["public"]["Enums"]["payment_type"]
          paymentReference: string | null
          projectId: string | null
        }
        Insert: {
          createdAt?: string
          expenseDate: string
          expenseNo: number
          id?: string
          payee: string
          paymentMethod: Database["public"]["Enums"]["payment_type"]
          paymentReference?: string | null
          projectId?: string | null
        }
        Update: {
          createdAt?: string
          expenseDate?: string
          expenseNo?: number
          id?: string
          payee?: string
          paymentMethod?: Database["public"]["Enums"]["payment_type"]
          paymentReference?: string | null
          projectId?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "expenses_headers_projectId_fkey"
            columns: ["projectId"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
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
      gl_accounts: {
        Row: {
          accountName: string
          accountNo: string | null
          accountTypeId: number | null
          active: boolean
          createdAt: string
          editable: boolean | null
          id: number
          isBank: boolean
          isSubCategory: boolean
          parentId: number | null
        }
        Insert: {
          accountName: string
          accountNo?: string | null
          accountTypeId?: number | null
          active?: boolean
          createdAt?: string
          editable?: boolean | null
          id?: number
          isBank?: boolean
          isSubCategory?: boolean
          parentId?: number | null
        }
        Update: {
          accountName?: string
          accountNo?: string | null
          accountTypeId?: number | null
          active?: boolean
          createdAt?: string
          editable?: boolean | null
          id?: number
          isBank?: boolean
          isSubCategory?: boolean
          parentId?: number | null
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
          dueDate: string | null
          exclusiveAmount: number
          id: string
          inclusiveAmount: number | null
          invoiceDate: string
          invoiceNo: number | null
          isOpeningBal: boolean | null
          terms: number | null
          vat: number
          vatAmount: number
          vatType: Database["public"]["Enums"]["vat_type"]
        }
        Insert: {
          clientId: string
          createdAt?: string
          createdBy?: string
          dueDate?: string | null
          exclusiveAmount: number
          id?: string
          inclusiveAmount?: number | null
          invoiceDate: string
          invoiceNo?: number | null
          isOpeningBal?: boolean | null
          terms?: number | null
          vat?: number
          vatAmount?: number
          vatType?: Database["public"]["Enums"]["vat_type"]
        }
        Update: {
          clientId?: string
          createdAt?: string
          createdBy?: string
          dueDate?: string | null
          exclusiveAmount?: number
          id?: string
          inclusiveAmount?: number | null
          invoiceDate?: string
          invoiceNo?: number | null
          isOpeningBal?: boolean | null
          terms?: number | null
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
      invoice_payment_header: {
        Row: {
          clientId: string
          createdAt: string
          id: string
          paymentDate: string
          paymentMethod: Database["public"]["Enums"]["payment_type"]
          paymentReference: string
          totalAmount: number | null
        }
        Insert: {
          clientId: string
          createdAt?: string
          id?: string
          paymentDate: string
          paymentMethod: Database["public"]["Enums"]["payment_type"]
          paymentReference: string
          totalAmount?: number | null
        }
        Update: {
          clientId?: string
          createdAt?: string
          id?: string
          paymentDate?: string
          paymentMethod?: Database["public"]["Enums"]["payment_type"]
          paymentReference?: string
          totalAmount?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "invoice_payment_header_clientId_fkey"
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
          paymentId: string | null
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
          paymentId?: string | null
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
          paymentId?: string | null
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
          {
            foreignKeyName: "invoice_payments_paymentId_fkey"
            columns: ["paymentId"]
            isOneToOne: false
            referencedRelation: "invoice_payment_header"
            referencedColumns: ["id"]
          },
        ]
      }
      ledger: {
        Row: {
          account: string
          accountTypeId: number | null
          credit: number
          debit: number
          id: number
          isJournal: boolean
          journalNo: number | null
          narration: string | null
          parentAccount: string | null
          transactionDate: string
          transactionId: string | null
          transactionType: string
        }
        Insert: {
          account: string
          accountTypeId?: number | null
          credit?: number
          debit?: number
          id?: number
          isJournal?: boolean
          journalNo?: number | null
          narration?: string | null
          parentAccount?: string | null
          transactionDate: string
          transactionId?: string | null
          transactionType: string
        }
        Update: {
          account?: string
          accountTypeId?: number | null
          credit?: number
          debit?: number
          id?: number
          isJournal?: boolean
          journalNo?: number | null
          narration?: string | null
          parentAccount?: string | null
          transactionDate?: string
          transactionId?: string | null
          transactionType?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          active: Database["public"]["Enums"]["user_status_type"] | null
          contact: string | null
          email: string | null
          id: string
          username: string | null
        }
        Insert: {
          active?: Database["public"]["Enums"]["user_status_type"] | null
          contact?: string | null
          email?: string | null
          id: string
          username?: string | null
        }
        Update: {
          active?: Database["public"]["Enums"]["user_status_type"] | null
          contact?: string | null
          email?: string | null
          id?: string
          username?: string | null
        }
        Relationships: []
      }
      projects: {
        Row: {
          active: boolean
          createdAt: string
          description: string | null
          id: string
          projectName: string
        }
        Insert: {
          active?: boolean
          createdAt?: string
          description?: string | null
          id?: string
          projectName: string
        }
        Update: {
          active?: boolean
          createdAt?: string
          description?: string | null
          id?: string
          projectName?: string
        }
        Relationships: []
      }
      services: {
        Row: {
          accountId: number
          active: boolean
          createdAt: string
          description: string | null
          id: string
          serviceName: string
          serviceRate: number
        }
        Insert: {
          accountId: number
          active?: boolean
          createdAt?: string
          description?: string | null
          id?: string
          serviceName: string
          serviceRate: number
        }
        Update: {
          accountId?: number
          active?: boolean
          createdAt?: string
          description?: string | null
          id?: string
          serviceName?: string
          serviceRate?: number
        }
        Relationships: [
          {
            foreignKeyName: "services_accountId_fkey"
            columns: ["accountId"]
            isOneToOne: false
            referencedRelation: "gl_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      vw_expenses: {
        Row: {
          amount: number | null
          expenseDate: string | null
          expenseNo: number | null
          id: string | null
          payee: string | null
          paymentMethod: Database["public"]["Enums"]["payment_type"] | null
          paymentReference: string | null
        }
        Insert: {
          amount?: never
          expenseDate?: string | null
          expenseNo?: number | null
          id?: string | null
          payee?: string | null
          paymentMethod?: Database["public"]["Enums"]["payment_type"] | null
          paymentReference?: string | null
        }
        Update: {
          amount?: never
          expenseDate?: string | null
          expenseNo?: number | null
          id?: string | null
          payee?: string | null
          paymentMethod?: Database["public"]["Enums"]["payment_type"] | null
          paymentReference?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      get_account_details: {
        Args: {
          accid: number
        }
        Returns: {
          accountname: string
          accounttypeid: number
          parent: string
        }[]
      }
      get_client_statement: {
        Args: {
          client: string
          from_date: string
          to_date: string
        }
        Returns: {
          date: string
          reference: string
          debit: number
          credit: number
          balance: number
        }[]
      }
      get_expenses_report: {
        Args: {
          fdate: string
          tdate: string
          rtype: string
          accid?: number
          pid?: string
        }
        Returns: {
          expenseDate: string
          accountName: string
          payee: string
          paymentMethod: Database["public"]["Enums"]["payment_type"]
          paymentReference: string
          projectName: string
          amount: number
        }[]
      }
      get_invoice_bal: {
        Args: {
          invoice_id: string
        }
        Returns: number
      }
      get_invoice_with_balance_by_client: {
        Args: {
          client: string
        }
        Returns: {
          id: string
          invoiceno: number
          duedate: string
          invoiceamount: number
          invoicebalance: number
        }[]
      }
      get_invoices: {
        Args: {
          param: string
        }
        Returns: {
          id: string
          invoiceno: number
          invoicedate: string
          duedate: string
          clientname: string
          invoiceamount: number
          invoicebalance: number
        }[]
      }
      get_level: {
        Args: {
          level_id: number
        }
        Returns: number
      }
      get_outstanding_invoices: {
        Args: Record<PropertyKey, never>
        Returns: {
          name: string
          invoiceNo: number
          invoiceDate: string
          inclusiveAmount: number
          balance: number
          dueDate: string
          dif: number
        }[]
      }
      get_payment_report: {
        Args: {
          fdate: string
          tdate: string
          rtype: string
          cid?: string
        }
        Returns: {
          paymentDate: string
          name: string
          paymentMethod: Database["public"]["Enums"]["payment_type"]
          paymentReference: string
          totalAmount: number
        }[]
      }
      verify_user_password: {
        Args: {
          password: string
        }
        Returns: boolean
      }
    }
    Enums: {
      invoice_payment_type: "opening_balance" | "debit" | "credit"
      payment_type: "cash" | "mpesa" | "cheque" | "bank"
      user_status_type: "active" | "inactive" | "not_activated"
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

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
