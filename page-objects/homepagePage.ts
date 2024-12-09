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
        // Locate all child elements within the featured products/items.
        const listOfProductsLocator = this.page.locator('.features_items .col-sm-4');

        // Get the count of child elements.
        const numberOfProductsInTheList = await listOfProductsLocator.count();

        // Verify all the products from the list of featured products/items.
        for (let i = 0; i < numberOfProductsInTheList; i++) {
            const product = listOfProductsLocator.nth(i);

            // Locate the product info block.
            const productInfoBlockLocator = product.locator('.productinfo.text-center');

            // Verify that the image is displayed.
            await expect(productInfoBlockLocator.locator('img')).toBeVisible();

            // Verify that the price is displayed and in right currency.
            const productPrice = await productInfoBlockLocator.locator('h2').textContent();
            expect(productPrice?.trim()).toContain(homepageData.featuresItemsBody[0].price);

            // Verify that product description has some text.
            const productDescription = await productInfoBlockLocator.locator('p').textContent();
            expect(productDescription?.trim().length).toBeGreaterThan(0);

            // Verify that the button "Add to Cart" is displayed and has the correct text.
            const addToCartButton = productInfoBlockLocator.locator('a.add-to-cart');
            await expect(addToCartButton).toBeVisible();
            const addToCartButtonText = await addToCartButton.textContent();
            expect(addToCartButtonText?.trim()).toBe(homepageData.featuresItemsBody[0].addToCartButton);

            // Verify that the button "View Product" is displayed and has the correct text.
            const viewProductButton = product.locator('ul.nav.nav-pills.nav-justified li a[href*="product_details"]');
            await expect(viewProductButton).toBeVisible();
            const viewProductButtonText = await viewProductButton.textContent();
            expect(viewProductButtonText?.trim()).toBe(homepageData.featuresItemsBody[0].viewProductButton);
        }
    }
}
