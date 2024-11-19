/**
 * Copyright 2024 SkylerKoba88
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, html, css } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import "./use-cases-items";

/**
 * `hax-use-case-app`
 * 
 * @demo index.html
 * @element hax-use-case-app
 */
export class HaxUseCaseApp extends DDDSuper(I18NMixin(LitElement)) {

  static get tag() {
    return "hax-use-case-app";
  }

  constructor() {
    super();
    this.value = null;
    this.loading = false;
    this.useCases = [];
    this.filterTitle = "Filter";
  }

  // Lit reactive properties
  static get properties() {
    return {
      filterTitle : {type: String},
      loading: { type: Boolean, reflect: true },
      useCases : {type: Array},
    };
  }

  // Lit scoped styles
  static get styles() {
    return [super.styles,
    css`
      :host {
        display: block;
        color: var(--ddd-theme-primary);
        background-color: var(--ddd-theme-accent);
        font-family: var(--ddd-font-navigation);
      }
      .filter {
        margin: var(--ddd-spacing-2);
        padding: var(--ddd-spacing-4);
      }
    `];
  }

  // Lit render the HTML
  render() {
    return html`
      <div class="filter">
        ${this.filterTitle}
        <input type="text" id="input" placeholder="Search templates here" @input='${this.inputChanged}'>
      </div>
      <div class="results">
        <use-cases-items
        source="https://tse3.mm.bing.net/th?id=OIP.2R5E64tpisgS1-PjdIkY6wHaHa&pid=Api"
        heading="example"
        description="example"
        >
        </use-cases-items>
        ${this.useCases.map((item, index) => html `
          <use-cases-items
            source="${item[0].image}"
            heading="${item[0].tag}"
            description="${item[0].description}"
            attributes.n="${item[0].attributes}"
          ></use-cases-items>
        `
        )}
      </div>
      `;
  }

  inputChanged(e) {
    this.value = this.shadowRoot.querySelector('#input').value;
  }
  updated(changedProperties) {
    if (changedProperties.has('value') && this.value) {
      this.updateResults(this.value);
      console.log(this.useCases);
    } else if (changedProperties.has('value') && !this.value) {
      this.useCases = [];
    }
  }

  updateResults(value) {
    this.loading = true;

    fetch(`./lib/use-cases.json`).then(d => d.ok ? d.json(): {}).then(data => {
      if (data) {
        this.useCases = [];
        this.useCases = data.data;
        this.loading = false;
      } else {
        console.error("Data format issue");
        this.useCases = [];
      }
    });
  }

  /**
   * haxProperties integration via file reference
   */
  static get haxProperties() {
    return new URL(`./lib/${this.tag}.haxProperties.json`, import.meta.url)
      .href;
  }
}

globalThis.customElements.define(HaxUseCaseApp.tag, HaxUseCaseApp);