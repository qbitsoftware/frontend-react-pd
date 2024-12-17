/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

import { createFileRoute } from '@tanstack/react-router'

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as VoistlusedIndexImport } from './routes/voistlused/index'
import { Route as UudisedIndexImport } from './routes/uudised/index'
import { Route as LoginIndexImport } from './routes/login/index'
import { Route as KontaktIndexImport } from './routes/kontakt/index'
import { Route as VoistlusedTournamentidImport } from './routes/voistlused/$tournamentid'
import { Route as UudisedBlogidImport } from './routes/uudised/$blogid'
import { Route as TournamentsTournamentidImport } from './routes/tournaments/$tournamentid'
import { Route as TestPageImport } from './routes/test/page'

// Create Virtual Routes

const AboutLazyImport = createFileRoute('/about')()
const IndexLazyImport = createFileRoute('/')()

// Create/Update Routes

const AboutLazyRoute = AboutLazyImport.update({
  id: '/about',
  path: '/about',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/about.lazy').then((d) => d.Route))

const IndexLazyRoute = IndexLazyImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/index.lazy').then((d) => d.Route))

const VoistlusedIndexRoute = VoistlusedIndexImport.update({
  id: '/voistlused/',
  path: '/voistlused/',
  getParentRoute: () => rootRoute,
} as any)

const UudisedIndexRoute = UudisedIndexImport.update({
  id: '/uudised/',
  path: '/uudised/',
  getParentRoute: () => rootRoute,
} as any)

const LoginIndexRoute = LoginIndexImport.update({
  id: '/login/',
  path: '/login/',
  getParentRoute: () => rootRoute,
} as any)

const KontaktIndexRoute = KontaktIndexImport.update({
  id: '/kontakt/',
  path: '/kontakt/',
  getParentRoute: () => rootRoute,
} as any)

const VoistlusedTournamentidRoute = VoistlusedTournamentidImport.update({
  id: '/voistlused/$tournamentid',
  path: '/voistlused/$tournamentid',
  getParentRoute: () => rootRoute,
} as any)

const UudisedBlogidRoute = UudisedBlogidImport.update({
  id: '/uudised/$blogid',
  path: '/uudised/$blogid',
  getParentRoute: () => rootRoute,
} as any)

const TestPageRoute = TestPageImport.update({
  id: '/test/page',
  path: '/test/page',
  getParentRoute: () => rootRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexLazyImport
      parentRoute: typeof rootRoute
    }
    '/about': {
      id: '/about'
      path: '/about'
      fullPath: '/about'
      preLoaderRoute: typeof AboutLazyImport
      parentRoute: typeof rootRoute
    }
    '/test/page': {
      id: '/test/page'
      path: '/test/page'
      fullPath: '/test/page'
      preLoaderRoute: typeof TestPageImport
      parentRoute: typeof rootRoute
    }
    '/tournaments/$tournamentid': {
      id: '/tournaments/$tournamentid'
      path: '/tournaments/$tournamentid'
      fullPath: '/tournaments/$tournamentid'
      preLoaderRoute: typeof TournamentsTournamentidImport
      parentRoute: typeof rootRoute
    }
    '/uudised/$blogid': {
      id: '/uudised/$blogid'
      path: '/uudised/$blogid'
      fullPath: '/uudised/$blogid'
      preLoaderRoute: typeof UudisedBlogidImport
      parentRoute: typeof rootRoute
    }
    '/voistlused/$tournamentid': {
      id: '/voistlused/$tournamentid'
      path: '/voistlused/$tournamentid'
      fullPath: '/voistlused/$tournamentid'
      preLoaderRoute: typeof VoistlusedTournamentidImport
      parentRoute: typeof rootRoute
    }
    '/kontakt/': {
      id: '/kontakt/'
      path: '/kontakt'
      fullPath: '/kontakt'
      preLoaderRoute: typeof KontaktIndexImport
      parentRoute: typeof rootRoute
    }
    '/login/': {
      id: '/login/'
      path: '/login'
      fullPath: '/login'
      preLoaderRoute: typeof LoginIndexImport
      parentRoute: typeof rootRoute
    }
    '/uudised/': {
      id: '/uudised/'
      path: '/uudised'
      fullPath: '/uudised'
      preLoaderRoute: typeof UudisedIndexImport
      parentRoute: typeof rootRoute
    }
    '/voistlused/': {
      id: '/voistlused/'
      path: '/voistlused'
      fullPath: '/voistlused'
      preLoaderRoute: typeof VoistlusedIndexImport
      parentRoute: typeof rootRoute
    }
  }
}

// Create and export the route tree

export interface FileRoutesByFullPath {
  '/': typeof IndexLazyRoute
  '/about': typeof AboutLazyRoute
  '/test/page': typeof TestPageRoute
  '/tournaments/$tournamentid': typeof TournamentsTournamentidRoute
  '/uudised/$blogid': typeof UudisedBlogidRoute
  '/voistlused/$tournamentid': typeof VoistlusedTournamentidRoute
  '/kontakt': typeof KontaktIndexRoute
  '/login': typeof LoginIndexRoute
  '/uudised': typeof UudisedIndexRoute
  '/voistlused': typeof VoistlusedIndexRoute
}

export interface FileRoutesByTo {
  '/': typeof IndexLazyRoute
  '/about': typeof AboutLazyRoute
  '/test/page': typeof TestPageRoute
  '/tournaments/$tournamentid': typeof TournamentsTournamentidRoute
  '/uudised/$blogid': typeof UudisedBlogidRoute
  '/voistlused/$tournamentid': typeof VoistlusedTournamentidRoute
  '/kontakt': typeof KontaktIndexRoute
  '/login': typeof LoginIndexRoute
  '/uudised': typeof UudisedIndexRoute
  '/voistlused': typeof VoistlusedIndexRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/': typeof IndexLazyRoute
  '/about': typeof AboutLazyRoute
  '/test/page': typeof TestPageRoute
  '/tournaments/$tournamentid': typeof TournamentsTournamentidRoute
  '/uudised/$blogid': typeof UudisedBlogidRoute
  '/voistlused/$tournamentid': typeof VoistlusedTournamentidRoute
  '/kontakt/': typeof KontaktIndexRoute
  '/login/': typeof LoginIndexRoute
  '/uudised/': typeof UudisedIndexRoute
  '/voistlused/': typeof VoistlusedIndexRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths:
    | '/'
    | '/about'
    | '/test/page'
    | '/tournaments/$tournamentid'
    | '/uudised/$blogid'
    | '/voistlused/$tournamentid'
    | '/kontakt'
    | '/login'
    | '/uudised'
    | '/voistlused'
  fileRoutesByTo: FileRoutesByTo
  to:
    | '/'
    | '/about'
    | '/test/page'
    | '/tournaments/$tournamentid'
    | '/uudised/$blogid'
    | '/voistlused/$tournamentid'
    | '/kontakt'
    | '/login'
    | '/uudised'
    | '/voistlused'
  id:
    | '__root__'
    | '/'
    | '/about'
    | '/test/page'
    | '/tournaments/$tournamentid'
    | '/uudised/$blogid'
    | '/voistlused/$tournamentid'
    | '/kontakt/'
    | '/login/'
    | '/uudised/'
    | '/voistlused/'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  IndexLazyRoute: typeof IndexLazyRoute
  AboutLazyRoute: typeof AboutLazyRoute
  TestPageRoute: typeof TestPageRoute
  TournamentsTournamentidRoute: typeof TournamentsTournamentidRoute
  UudisedBlogidRoute: typeof UudisedBlogidRoute
  VoistlusedTournamentidRoute: typeof VoistlusedTournamentidRoute
  KontaktIndexRoute: typeof KontaktIndexRoute
  LoginIndexRoute: typeof LoginIndexRoute
  UudisedIndexRoute: typeof UudisedIndexRoute
  VoistlusedIndexRoute: typeof VoistlusedIndexRoute
}

const rootRouteChildren: RootRouteChildren = {
  IndexLazyRoute: IndexLazyRoute,
  AboutLazyRoute: AboutLazyRoute,
  TestPageRoute: TestPageRoute,
  TournamentsTournamentidRoute: TournamentsTournamentidRoute,
  UudisedBlogidRoute: UudisedBlogidRoute,
  VoistlusedTournamentidRoute: VoistlusedTournamentidRoute,
  KontaktIndexRoute: KontaktIndexRoute,
  LoginIndexRoute: LoginIndexRoute,
  UudisedIndexRoute: UudisedIndexRoute,
  VoistlusedIndexRoute: VoistlusedIndexRoute,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/",
        "/about",
        "/test/page",
        "/tournaments/$tournamentid",
        "/uudised/$blogid",
        "/voistlused/$tournamentid",
        "/kontakt/",
        "/login/",
        "/uudised/",
        "/voistlused/"
      ]
    },
    "/": {
      "filePath": "index.lazy.tsx"
    },
    "/about": {
      "filePath": "about.lazy.tsx"
    },
    "/test/page": {
      "filePath": "test/page.tsx"
    },
    "/tournaments/$tournamentid": {
      "filePath": "tournaments/$tournamentid.tsx"
    },
    "/uudised/$blogid": {
      "filePath": "uudised/$blogid.tsx"
    },
    "/voistlused/$tournamentid": {
      "filePath": "voistlused/$tournamentid.tsx"
    },
    "/kontakt/": {
      "filePath": "kontakt/index.tsx"
    },
    "/login/": {
      "filePath": "login/index.tsx"
    },
    "/uudised/": {
      "filePath": "uudised/index.tsx"
    },
    "/voistlused/": {
      "filePath": "voistlused/index.tsx"
    }
  }
}
ROUTE_MANIFEST_END */
