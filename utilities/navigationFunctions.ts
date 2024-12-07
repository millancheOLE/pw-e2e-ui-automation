import { Page, Locator, expect } from '@playwright/test';
import navigationData from '../data/navigationData.json';

export class Navigation {
    private readonly page: Page;
    private readonly logo: Locator;
    private readonly navbar: Locator;
    private readonly subcribtionTextBox: Locator;
    private readonly subcribtionButton: Locator;
    private readonly subcribtionTextLabel: Locator;
    private readonly subcribtionTextDescription: Locator;
    private readonly successfulSubcribtionMessage: Locator;

    constructor(page: Page) {
        this.page = page;

        // Locators header:
        this.logo = page.getByAltText("Website for automation practice", { exact: true });
        this.navbar = page.locator('.nav.navbar-nav');

        // Locators footer:
        this.subcribtionTextLabel = page.getByText("Subscription", { exact: true });
        this.subcribtionTextBox = page.getByPlaceholder("Your email address");
        this.subcribtionButton = page.locator('#subscribe');
        this.subcribtionTextDescription = page.getByText("Get the most recent updates from our site", { exact: false });
        this.successfulSubcribtionMessage = page.locator('.alert-success.alert');
    }

    // ************** Header methods: ********************

    /**
     * This method is used to verify that the logo is visible in the header.
     */
    async validateThatLogoIsDisplayed() {
        await expect(this.logo).toBeVisible();
    }

    /**
     * This method is used to verify that the navbar buttons are visible and have the correct names.
     * Note: Intentionally wasn't checking spaces in the button names.
     */
    async validateThatNavbarButtonNamesAreDisplayed() {
        const listItems = this.navbar.locator('li');
        const expectedButtonNames = navigationData.navbarButtonNamesArray;
    
        for (const buttonName of expectedButtonNames) {
            const button = listItems.locator(`text=${buttonName}`);

            await expect(button).toBeVisible();
            expect(expectedButtonNames).toContain(buttonName);
        }
    }

    /**
     * This method is used to verify that the button is selected.
     * @param buttonName: The name of the button to be checked.
     */
    async validateThatButtonIsSelected(buttonName: string) {
        const listItems = this.navbar.locator('li');
        const count = await listItems.count();
    
        for (let i = 0; i < count; i++) {
            const textContent = await listItems.nth(i).textContent();
    
            if (textContent?.trim() === buttonName) {
                // Find the <a> element inside the matching <li> and check its style attribute.
                const linkElement = listItems.nth(i).locator('a');
                await expect(linkElement).toHaveAttribute('style', 'color: orange;');
                break;
            }
        }
    }
    
    /**
     * This method is used to navigate to the home page.
     */
    async clickOnTheLogoToNavigateToHomepage() {
        await this.logo.click();
        await expect(this.page).toHaveURL(process.env.URL!);
    }

    /**
     * This method is used to navigate to a specific page in the navbar.
     * @param buttonName: The name of the button to be clicked.
     */
    async clickOnTheNavbarButton(buttonName: string) {
        // Get all list items inside the navbar.
        const listItems = this.navbar.locator('li');

        // Loop through the list items and click the one that matches the buttonName.
        const count = await listItems.count();
        for (let i = 0; i < count; i++) {
            const textContent = await listItems.nth(i).textContent();
            if (textContent?.trim() === buttonName) {
                await listItems.nth(i).click();
                break;
            }
        }
    }

// ******************** Footer methods: ********************

/**
 * This method is used to verify that the footer elements are visible.
 */
    async validateThatFooterElementsAreDisplayed() {
        await expect(this.subcribtionTextLabel).toHaveText(navigationData.footerText.subscriptionLabel);
        await expect(this.subcribtionTextLabel).toHaveCSS('text-transform', 'uppercase');
        await expect(this.subcribtionTextDescription).toHaveText(navigationData.footerText.subcribtionTextDescription);
    }

    /**
     * This method is used to subscribe to the newsletter and check elements in the footer.
     * @param email: The email address to subscribe to the newsletter.
     */
    async fillAndClickSubscribeToNewsletter(email: string) {
        await this.subcribtionTextBox.fill(email);
        await this.subcribtionButton.click();
        await expect(this.successfulSubcribtionMessage).toBeVisible();
    }
}