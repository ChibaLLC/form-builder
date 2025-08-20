export interface FormField {
  id: string;
  type: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  validation?: ValidationRule[];
  options?: FieldOption[];
  props?: Record<string, any>;
  style?: Record<string, any>;
  columnSpan?: number;
  [key: string]: any;
}

export interface FieldOption {
  label: string;
  value: string | number;
}

export interface ValidationRule {
  type: "required" | "min" | "max" | "pattern" | "custom";
  value?: string | number;
  message: string;
}
export interface PageSchema {
  id: number;
  title: string;
  description?: string;
  fields: FormField[];
}
export interface FormSchema {
  id: number;
  title: string;
  description?: string;
  pages: PageSchema[];
  price: number;
  requireMerch: boolean;
  allowGroups: boolean;
  calculateTat: boolean;
  groupAmountPayable?: number;
  groupMemberLimit?: number;
  infoPromptMessage?: string;
}

export interface FormSettings {
  submitText?: string;
  resetText?: string;
  layout?: "vertical" | "horizontal" | "inline";
  spacing?: "tight" | "normal" | "loose";
  theme?: "light" | "dark" | "auto";
}

export interface DragItem {
  type: string;
  field?: FormField;
  fromIndex?: number;
}

export interface FieldDefinition {
  type: string;
  label: string;
  icon: string;
  category: string;
  defaultProps: Partial<FormField>;
  component: any;
  configComponent?: any;
}

export interface BuilderState {
  schema: FormSchema;
  selectedFieldId: string | null;
  draggedField: DragItem | null;
  previewMode: boolean;
}

export interface FormBuilderOptions {
  fields: FieldDefinition[];
  theme?: "light" | "dark" | "auto";
  allowPreview?: boolean;
  showFieldTypes?: boolean;
  maxFields?: number;
}
export interface Store {
  id: number;
  name: string;
  description?: string;
  items: StoreItem[];
}

export interface StoreItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  quantity: number;
  infinite: boolean;
  images: string[];
}
