


jest.setTimeout(30000); //To stop Jest complaining



describe('GoCodeRemote homepage', () => {
    beforeAll(async () => {
        await page.goto('http://127.0.0.1:3000');
    });

    it('should return status code 200',  async() =>{

        page.on('response', response => {
            expect(response.status()).toEqual(200)
        });

    });

    it('should be titled "Go Code Remote"', async () => {
        await expect(page.title()).resolves.toMatch('Go Code Remote');
    });

    it('should have rendered at least 25 <tr>',  async() =>{

        await page.waitForSelector('table > tbody > tr > td');
        let rows = await page.$$('table > tbody > tr > td');

        expect(rows.length).toBeGreaterThanOrEqual(25)

    });
});
