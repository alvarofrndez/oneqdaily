// src/config/site.ts

export type SiteMode = 'live' | 'launch' | 'maintenance';

const siteMode = process.env.SITE_MODE;

export const SITE_MODE: SiteMode =
  siteMode === 'launch' ||
  siteMode === 'maintenance' ||
  siteMode === 'live'
    ? siteMode
    : 'live';