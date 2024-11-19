import { html, fixture, expect } from '@open-wc/testing';
import "../hax-use-case-app.js";

describe("HaxUseCaseApp test", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(html`
      <hax-use-case-app
        title="title"
      ></hax-use-case-app>
    `);
  });

  it("basic will it blend", async () => {
    expect(element).to.exist;
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});
