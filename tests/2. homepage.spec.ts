import { test } from '../utilities/test-setup';
import homepageData from '../data/homepageData.json'

test.beforeEach(async ({ page, homepagePage }) => {
    await page.goto(process.env.URL!);
    await homepagePage.validateThatHomepageIsDisplayed();
  });

  test.describe('T-002-ST-001: Homepage UI validations suite', () => {
    test('TC-001: Validating header functionality.', async ({ homepagePage }) => {
        await homepagePage.validateThatCategoryPanelIsDisplayed()
        await homepagePage.validateThatBrendsAreDisplayed(homepageData);
        await homepagePage.validateFeaturedProducts(homepageData);
    });
  })