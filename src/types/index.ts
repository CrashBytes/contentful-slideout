export * from './contentful'
export * from './preview'

declare global {
  interface Window {
    __CONTENTFUL_PREVIEW_SDK__?: any
  }
}

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}
