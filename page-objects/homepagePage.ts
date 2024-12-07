import { expect, Page, Locator } from '../utilities/test-setup';
import homepageData from '../data/homepageData.json';

export class HomePage {
    private readonly page: Page;
    private readonly womanButtonLocator: Locator;
    private readonly menButtonLocator: Locator;
    private readonly kidsButtonLocator: Locator;

    constructor(page: Page) {
        this.page = page;

        // Category panel locators:
        this.womanButtonLocator = page.getByRole('link', { name: ' Women' });
        this.menButtonLocator = page.getByRole('link', { name: ' Men' });
        this.kidsButtonLocator = page.getByRole('link', { name: ' Kids' });
    }

    /**
     * This method validates the homepage is displayed.
     */
    async validateThatHomepageIsDisplayed() {
        await expect(this.page).toHaveTitle(homepageData.title);
    }

    /**
     * This method validates the category panel on the homepage.
     */
    async validateThatCategoryPanelIsDisplayed() {
        await this.womanButtonLocator.isVisible();
        await this.menButtonLocator.isVisible();
        await this.kidsButtonLocator.isVisible();

        await expect(this.womanButtonLocator).toHaveCSS('text-transform', 'uppercase');
        await expect(this.menButtonLocator).toHaveCSS('text-transform', 'uppercase');
        await expect(this.kidsButtonLocator).toHaveCSS('text-transform', 'uppercase');

        let womenText = await this.womanButtonLocator.textContent();
        let menText = await this.menButtonLocator.textContent();
        let kidsText = await this.kidsButtonLocator.textContent();

        expect(womenText?.trim().toLowerCase()).toBe(homepageData.category[0].name.toLowerCase());
        expect(menText?.trim().toLowerCase()).toBe(homepageData.category[1].name.toLowerCase());
        expect(kidsText?.trim().toLowerCase()).toBe(homepageData.category[2].name.toLowerCase());
    }

    /**
     * This method validates the brands on the homepage.
     * @param homepageData: The data for the homepage.
     */
    async validateThatBrendsAreDisplayed(homepageData: any) {
        const brandNamesFromPage = await this.page.locator('.brands-name ul.nav li a').evaluateAll(anchors =>
            anchors.map(anchor => {
                const span = anchor.querySelector('span');
                const spanText = span?.textContent || '';
                return anchor.textContent?.replace(spanText, '').trim();
            })
        );

        const expectedBrandNames = homepageData.brands.map((brand: { name: string }) => brand.name.toUpperCase());

        const actualBrandNames = brandNamesFromPage.map(name => name?.toUpperCase());

        expect(actualBrandNames).toEqual(expectedBrandNames);
    }

    /**
     * This method validates the featured products on the homepage.
     * @param homepageData: The data for the homepage.
     */
    async validateFeaturedProducts(homepageData: any) {
        // Locate all child elements with class "col-sm-4" under the parent "features_items"
        const childElements = this.page.locator('.features_items .col-sm-4');

        // Get the count of child elements
        const childCount = await childElements.count();

        // Loop through each child element
        for (let i = 0; i < childCount; i++) {
            const child = childElements.nth(i);

            // Locate the "productinfo text-center" inside the child
            const productInfo = child.locator('.productinfo.text-center');

            // Verify the image exists
            await expect(productInfo.locator('img')).toBeVisible();

            // Verify the <h2> element contains text "Rs."
            await expect(productInfo.locator('h2')).toContainText('Rs.');

            // Verify the paragraph contains some string (non-empty text)
            const paragraphText = await productInfo.locator('p').textContent();
            expect(paragraphText?.trim().length).toBeGreaterThan(0);

            // Verify the button "Add to Cart" exists
            await expect(productInfo.locator('button:has-text("Add to Cart")')).toBeVisible();

            // Verify the button "View Product" exists outside "productinfo text-center"
            await expect(child.locator('button:has-text("View Product")')).toBeVisible();

            console.log(`Child element ${i + 1} verified successfully.`);
        }
    }
}
