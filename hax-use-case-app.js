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
    this.value = "portfolio";
    this.loading = false;
    this.useCases = [];
    this.filteredResults = [];
    this.renderUseCases = [];
    this.updateResults(this.value);
  }

  // Lit reactive properties
  static get properties() {
    return {
      loading: { type: Boolean, reflect: true },
      useCases : {type: Array},
      filteredResults: {type: Array},
      renderUseCases: {type: Array}
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
        background-color: var(--ddd-theme-default-white);
        border-radius: var(--ddd-radius-xs);
      }
      .filterButtons {
        display: flex;
        flex-direction:column;
        gap: var(--ddd-spacing-2);
        width: 150px;
      }
      input[type="checked"] {
        background-color: blue;
      }
      input[type="text"] {
        background-color: var(--ddd-theme-default-limestoneLight);
        border: solid var(--ddd-theme-default-limestoneGray) 1px;
        border-radius: var(--ddd-radius-xs);
        height: 24px;
      }
      .tags label {
        margin-left: 8px;
        color: white;
        padding: 4px 8px;
        background-color: var(--ddd-theme-default-coalyGray);
        border-radius: var(--ddd-radius-sm);
      }
      .tg {
        display: none;
      }
      .tg.selected {
        display: inline-flex;
      }
      #reset {
        height: 24px;
      }
    `];
  }

  //reset filters
  resetFilters() {
    this.shadowRoot.querySelector('#input').value = '';
    this.value = null;

    const checkboxes = this.shadowRoot.querySelectorAll('.filterButtons input[type="checkbox"]');
    checkboxes.forEach(checkbox => (checkbox.checked = false));

    this.renderUseCases = this.useCases.map((useCase) => {
      return html`
        <use-cases-items
          tag="${useCase.tag}"
          demoLink="${useCase.demo}"
          source="${useCase.image}"
          heading="${useCase.title}"
          description="${useCase.description}"
          iconImage="${useCase.attribute}"
          activeUseCase="${useCase.activeUseCase}"
        ></use-cases-items>
      `;
    });
  }
//filter results
  filter() {

  }

//selected function to make only one item be selected at a time

//continue function to display pop-up

//render html
  render() {
    return html`
    <div class="tags">
      <label data-id="portfolio" class="tg">Portfolio</label>
      <label data-id="blog" class="tg">Blog</label>
      <label data-id="research" class="tg">Research Site</label>
      <label data-id="resume" class="tg">Resume</label>
      <label data-id="course" class="tg">Course</label>
    </div>
    <div id="content" style="display: inline-flex;">
    <div class="filter">
        <simple-icon-lite icon="icons:search"></simple-icon-lite>
        <input type="text" id="input" placeholder="Search templates here" @input='${this.inputChanged}'>
        <button id="reset" @click="${this.resetFilters}">Reset</button>
        <h5>Templates</h5>
        <div class="filterButtons">
          <label><input type="checkbox" data-id="portfolio" @change=${this.filter}>Portfolio</label>
          <label><input type="checkbox" data-id="blog" @change=${this.filter}>Blog</label>
          <label><input type="checkbox" data-id="research" @change=${this.filter}>Research Site</label>
          <label><input type="checkbox" data-id="resume" @change=${this.filter}>Resume</label>
          <label><input type="checkbox" data-id="course" @change=${this.filter}>Course</label>
        </div>
      </div>

      <div class="results">
        ${this.filteredResults = this.useCases.map((useCase) => html `
        <use-cases-items
            activeUseCase = "${useCase.id}"
            tag = "${useCase.tag}"
            demoLink = "${useCase.demo}"
            source = "${useCase.image}"
            heading = "${useCase.title}"
            description = "${useCase.description}"
            iconImage = "${useCase.attribute}">
          </use-cases-items>
        `
        )}
      </div>
      <div class="results">
        <use-cases-items
        tag = "course"
        demoLink="https://forallthings.bible/wp-content/uploads/2017/04/kjvbibleonline.png"
        source="https://forallthings.bible/wp-content/uploads/2017/04/kjvbibleonline.png"
        heading="Course"
        description="Unlock your creativity and technical skills by designing a dynamic website for your course, where you'll showcase your projects and share valuable resources."
        iconImage="icons:accessibility"
        ></use-cases-items>
        ${this.renderUseCases.length
          ? this.renderUseCases
          : html`<p>No templates available. Try searching or select a tag.</p>`}
      </div>
    </div>
      
      `;
  }
  inputChanged(e) {
    this.value = this.shadowRoot.querySelector('#input').value;
  }
  updated(changedProperties) {
    if (changedProperties.has('value') && this.value) {
      this.updateResults(this.value);
      console.log(this.renderUseCases);
    } else if (changedProperties.has('value') && !this.value) {
      this.renderUseCases = [];
    }
  }

//fetch results
  updateResults(value) {
    this.loading = true;

    fetch(new URL('./lib/use-case-data.json',import.meta.url).href).then(response => {
      if(!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();})
      .then(data => {
        if (Array.isArray(data.data)) {
          var results = data.data;
          this.renderUseCases = results.map(useCase => ({
            activeUseCase: useCase.id,
            tag: useCase.tag,
            demoLink: useCase.demo,
            source: useCase.image,
            heading: useCase.title,
            description: useCase.description,
            iconImage: useCase.attribute
          }));
          this.filteredResults = [];
        } else {
          console.error("Data format issue");
          console.log(data);
          this.filteredResults = [];
        }
        this.loading = false;
      })
      
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