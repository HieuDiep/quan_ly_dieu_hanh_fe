export interface NormalHeaderItem {
  text?: string,
  align?: string,
  sortable?: boolean,
  value?: string,
  type?: string,
  class?: string,
  filters: filterDefaultHeader,
  width?: string,
}
export interface filterDefaultHeader {
  type?: string,
  key?: string,
  placeholder?: string,
  defaultValue?: number|string|Record<string, unknown>,
  items?:string[]|Record<string, unknown>[],
  hasKey?:boolean,
  valueText?:string,
  keyText?:string,
}

