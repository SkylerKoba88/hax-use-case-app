/**
 * Copyright 2024 SkylerKoba88
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, html, css } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import "./use-cases-items";
import '@haxtheweb/simple-icon/simple-icon.js';

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
    this.renderUseCases = [];
  }

  // Lit reactive properties
  static get properties() {
    return {
      loading: { type: Boolean, reflect: true },
      useCases : {type: Array},
    };
  }

  // Lit scoped styles
  static get styles() {
    return [super.styles,
    css`
      :host {
        display: inline-flex;
        color: var(--ddd-theme-primary);
        background-color: var(--ddd-theme-accent);
        font-family: var(--ddd-font-navigation);
      }
      .filter {
        margin: var(--ddd-spacing-2);
        padding: var(--ddd-spacing-4);
      }
      .filterButtons {
        display: block;
      }
      .fButton {
        height: 16px;
      }
      button:active .fButton {
        background-color: blue;
      }
    `];
  }

  // Lit render the HTML
  render() {
    return html`
      <div class="filter">
        <simple-icon-lite icon="icons:search"></simple-icon-lite>
        <input type="text" id="input" placeholder="Search templates here" @input='${this.inputChanged}'>
        <div class="filterButtons">
          <h5>Templates</h5>
          <button class="fButton"></button> <p style="display:inline-flex;paddning: 8px;">Portfolio</p>
          <div style="display:block; height: 4px;"></div>
          <button class="fButton"></button> <p style="display:inline-flex;">Blog</p>
          <div style="display:block; height: 4px;"></div>
          <button class="fButton"></button> <p style="display:inline-flex;">Research Website</p>
          <div style="display:block; height: 4px;"></div>
          <button class="fButton"></button> <p style="display:inline-flex;">Resume</p>
          <div style="display:block; height: 4px;"></div>
          <button class="fButton"></button> <p style="display:inline-flex;">Course</p>
        </div>
      </div>
      <div class="results">
        ${this.renderUseCases || []}
      </div>
      <div class="results">
        <use-cases-items
        source="https://tse3.mm.bing.net/th?id=OIP.2R5E64tpisgS1-PjdIkY6wHaHa&pid=Api"
        heading="example"
        description="example"
        icon="icons:pregnant-woman"
        ></use-cases-items>
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
        this.renderUseCases = (data.useCases || []).map((ucase) => {
          return html `
          <use-cases-items
            demoLink="https://hax.cloud?use-case=${ucase[0].demo}"
            source="${ucase[0].image}"
            heading="${ucase[0].tag}"
            description="${ucase[0].description}"
            attribute="${ucase[0].attributes[0]}"
            icon="${ucase[0].attributes[0]}"
          ></use-cases-items>
        `
        });
        
      } else {
        console.error("Data format issue");
        this.useCases = [];
      }
      this.loading = false;
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