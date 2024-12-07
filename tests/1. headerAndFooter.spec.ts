import { test } from '../utilities/test-setup';
import navigationData from '../data/navigationData.json'
import { faker } from '@faker-js/faker';

test.beforeEach(async ({ page, homepagePage: homepagePage }) => {
  await page.goto(process.env.URL!);
  await homepagePage.validateThatHomepageIsDisplayed();
});

test.describe('T-001-ST-001: Header and Footer validations suite', () => {
  test('TC-001: Validating header functionality.', async ({ navigationFunctions }) => {

    await navigationFunctions.validateThatLogoIsDisplayed();
    await navigationFunctions.validateThatNavbarButtonNamesAreDisplayed();
    await navigationFunctions.validateThatButtonIsSelected(navigationData.navbarButtons.home);
    await navigationFunctions.clickOnTheNavbarButton(navigationData.navbarButtons.cart);
    await navigationFunctions.validateThatButtonIsSelected(navigationData.navbarButtons.cart);
    await navigationFunctions.clickOnTheLogoToNavigateToHomepage();
    await navigationFunctions.validateThatButtonIsSelected(navigationData.navbarButtons.home);
  });

  test('TC-002: Validating footer functionality.', async ({ navigationFunctions }) => {

    await navigationFunctions.validateThatFooterElementsAreDisplayed();
    await navigationFunctions.fillAndClickSubscribeToNewsletter(faker.internet.email());
  });
})

