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
    this.tag = '';
    this.demoLink = '';
    this.source = '';
    this.heading = '';
    this.description = '';
    this.attributes = [];
    this.iconImage = '';
    this.isSelected = false;
    this.activeUseCase = '';
  }

  static get properties() {
    return {
        tag: {type: String},
        heading: {type: String},
        demoLink: {type: String},
        source: { type: String },
        description: { type: String },
        attributes: { type: Array},
        iconImage: {type: String},
        isSelected: {type: Boolean, reflected: true},
        activeUseCase: {type: String}
    };
  }

  // Lit scoped styles
  static get styles() {
    return [css`
    :host {
        display: flex;
        flex-direction: column;
        max-width: 240px;
        width: 240px;
        margin: 21px;
        font-family: var(--ddd-font-primary);
        background-color: var(--ddd-theme-default-white);
        font-weight: bold;
        padding:  8px;
        min-height: 270px;
        border: solid var(--ddd-theme-default-limestoneGray) 1px;
        border-radius: var(--ddd-radius-sm);
        box-shadow: var(--ddd-boxShadow-md);
        text-align: center;
    }
    :host([isSelected]) {
      background-color: var(--ddd-theme-default-creekLight) ;
    }
  
    .image div, .image img {
      width: 240px;
      background-color: transparent;
      border-radius: var(--ddd-radius-sm);
      justify-self: center;
    }

    .image div {
    font-size: 12px;
    padding: 4px;
    flex-grow: 1;
    }

    .image img {
    display: block;
    height: 150px;
    }
    a:link {
      color: var(--ddd-theme-defaut-slateMaxLight);
      text-decoration: none;
    }
    .imageContainer {
      position: relative;
    }
    .bottomRightText {
      position: absolute;
      bottom: 4px;
      right: 16px;
    }
    button {
      display: flex;
      font-size: 10px;
      padding: 8px;
      margin: 0px 4px 0px 4px;
      height: 16px;
      border-radius: var(--ddd-radius-xs);
      align-items: center;
      justify-content: center;
      color: white;
    }
    .select {
      background-color: var(--ddd-theme-default-coalyGray);
    }
    .select.selected {
      background-color: var(--ddd-theme-default-limestoneLight);
      color: black;
      
    }
    .continue {
      display: none;
      background-color: var(--ddd-theme-default-creekTeal);
    }
    .continue.visible {
      display: inline-flex;
    }
    `];
  }
 
  toggleDisplay() {
//todo: make selected button change between selected/select && different colors
//make continue button appear/disappear
    this.isSelected = !this.isSelected;
  }
  // Lit render the HTML
  render() {
    return html`
    <div class="image">
      <div class="imageContainer">
        <a href="${this.demoLink}" target="_blank"><img src="${this.source}" alt="${this.heading}" ></a>
        <p class="bottomRightText">Demo></p>
      </div>
      
        <div>
          <h2>${this.heading}</h2>
          ${this.description}
          ${this.attributes.map((attribute, index) => html `
            <img src="${attribute[0]}">
          `)}
          <div style="background-color: transparent; display: flex; padding: 8px;" class="cardBottom">
            <simple-icon-lite id="icon" aria-hidden="true" part="icon" icon="${this.iconImage}" dir="ltr"></simple-icon-lite>
            <button class="select ${this.isSelected ? 'selected' : ''}" @click=${this.toggleDisplay}>${this.isSelected ? 'Selected' : 'Select'}</button>
            <button class="continue ${this.isSelected ? 'visible' : ''}">Continue</button>
          </div>
          
        </div>
    </div>
    `;
  }
  static get tag() {
    return "use-cases-items";
  }
}

customElements.define(UseCasesItems.tag, UseCasesItems);