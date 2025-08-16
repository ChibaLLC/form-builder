/// <reference types="vite/client" />

declare module '@chiballc/form-builder' {
  import { DefineComponent } from 'vue';
  
  const FormBuilderInterface: DefineComponent<{}, {}, any>;
  export default FormBuilderInterface;
  export { FormBuilderInterface };
}
