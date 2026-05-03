// Public entry for `contentful-slideout`
export { ContentfulSlideout } from './components/slideout/ContentfulSlideout'
export type {
  ContentfulField,
  ContentfulSection,
  ContentfulEntry as ContentfulSlideoutEntry,
  ContentfulSlideoutProps,
} from './components/slideout/ContentfulSlideout'

export { FlexibleSlideout } from './components/slideout/FlexibleSlideout'
export type {
  SlideoutEntry,
  SlideoutEntryType,
  FlexibleSlideoutProps,
} from './components/slideout/FlexibleSlideout'

export { Portal } from './components/ui/Portal'

// Re-export shared types from the package types barrel
export type {
  ContentfulSys,
  ContentfulEntry,
  ContentfulAsset,
  BlogPostFields,
  AuthorFields,
  CategoryFields,
} from './types/contentful'

export type {
  ViewMode,
  PreviewConfiguration,
  EntryConfiguration,
  PreviewComponentProps,
  EntryTypeDefinition,
  PreviewState,
} from './types/preview'
