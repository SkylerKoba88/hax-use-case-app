/**
 * Copyright 2024 SkylerKoba88
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, html, css } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import '@haxtheweb/simple-icon/simple-icon.js';

export class UseCasesItems extends DDDSuper(I18NMixin(LitElement)) {

  constructor() {
    super();
    this.demoLink = '';
    this.source = '';
    this.heading = '';
    this.description = '';
    this.attributes = [];
    this.icon = '';
  }

  static get properties() {
    return {
        heading: {type: String},
        source: { type: String },
        description: { type: String },
        attributes: { type: Array},
    };
  }

  // Lit scoped styles
  static get styles() {
    return [css`
    :host {
        display: flex;
        flex-direction: column;
        height: auto;
        max-width: 240px;
        width: 240px;
        margin: 21px;
        font-family: var(--ddd-font-primary);
        background-color: var(--ddd-theme-default-nittanyNavy);
        font-weight: bold;
        text-align: left;
        padding: 8px;
        min-height: 270px;
        border-radius: var(--ddd-radius-sm);
        box-shadow: var(--ddd-boxShadow-md);
        text-align: center;
    }
  

    .image div {
    max-width: 240px;
    font-size: 12px;
    background-color: var(--ddd-theme-default-nittanyNavy);
    padding: 4px;
    flex-grow: 1;
    }
    .image:hover {
      opacity: 50%;
    }

    .image img {
    display: block;
    width: 240px;
    height: 200px;
    margin: auto;
    border-radius: var(--ddd-radius-sm);
    }
    a:link {
      color: var(--ddd-theme-defaut-slateMaxLight);
    }
    a:visited {
      color: var(--ddd-theme-defaut-slateMaxLight);
      text-decoration: none;
    }
    `];
  }
 
  // Lit render the HTML
  render() {
    return html`
    <div class="image">
      <a href="${this.demoLink}"><img src="${this.source}" alt="${this.heading}" ></a>
        <div>
          <h2>${this.heading}</h2>
          ${this.description}
          ${this.attributes.map((attribute, index) => html `
            <img src="${attribute[0]}">
          `)}
          <span> 
            <simple-icon-lite id="icon" icon="${this.icon}"></simple-icon-lite>
          </span>
        </div>
    </div>
    `;
  }
  static get tag() {
    return "use-cases-items";
  }
}

customElements.define(UseCasesItems.tag, UseCasesItems);