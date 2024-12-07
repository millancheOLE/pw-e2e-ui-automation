import { test as base, expect, Page, Locator } from '@playwright/test';
import { HomePage } from '../page-objects/homepagePage';
import { Navigation } from './navigationFunctions';

// Extend the base test with custom fixtures
type Fixtures = {
  homepagePage: HomePage;
  navigationFunctions: Navigation;
};

export const test = base.extend<Fixtures>({
  homepagePage: async ({ page }, use) => {
    const homepagePage = new HomePage(page);
    await use(homepagePage);
  },
  navigationFunctions: async ({ page }, use) => {
    const navigationFunctions = new Navigation(page);
    await use(navigationFunctions);
  },
});

export { expect, Page, Locator };