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
      .
    `];
  }

  toggleTagDisplay(e) {
    const id = e.target.closest('label').querySelector('input').dataset.id;
    const tag = this.shadowRoot.querySelector(`.tags [data-id="${id}"]`);
  
    if (e.target.checked) {
      tag.classList.add('selected');
    } else {
      tag.classList.remove('selected');
    }

    const tagId = e.target.dataset.id;
  const checked = e.target.checked;

  this.renderUseCases = this.useCases.filter((useCase) =>
    checked ? useCase.tag === tagId : true
  ).map((filteredUseCase) => {
    return html`
      <use-cases-items
        tag="${filteredUseCase.tag}"
        demoLink="${filteredUseCase.demo}"
        source="${filteredUseCase.image}"
        heading="${filteredUseCase.title}"
        description="${filteredUseCase.description}"
        icon="${filteredUseCase.attributes[0]}"
        activeUseCase="${filteredUseCase.activeUseCase}"
      ></use-cases-items>
    `;
  });
  }
  // Lit render the HTML
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
        <h5>Templates</h5>
        <div class="filterButtons">
          <label><input type="checkbox" data-id="portfolio" @change=${this.toggleTagDisplay}>Portfolio</label>
          <label><input type="checkbox" data-id="blog" @change=${this.toggleTagDisplay}>Blog</label>
          <label><input type="checkbox" data-id="research" @change=${this.toggleTagDisplay}>Research Site</label>
          <label><input type="checkbox" data-id="resume" @change=${this.toggleTagDisplay}>Resume</label>
          <label><input type="checkbox" data-id="course" @change=${this.toggleTagDisplay}>Course</label>
        </div>
      </div>
      <div class="results">
        ${this.renderUseCases || []}
      </div>
      <div class="results">
        <use-cases-items
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
      console.log(this.useCases);
    } else if (changedProperties.has('value') && !this.value) {
      this.useCases = [];
    }
  }

  updateResults(value) {
    this.loading = true;

    fetch('./lib/use-case-data/json').then(d => d.ok ? d.json(): {}).then(data => {
      if (data && Array.isArray(data.data)) {
        this.useCases = [];
        this.useCases = data.data;
        console.log(useCases);
        this.renderUseCases = data.data.map((useCase) => {
          return html`
            <use-cases-items
              activeUseCase="${this.useCase.id}"
              tag="${useCase.tag}"
              demoLink="${useCase.demo}"
              source="${useCase.image}"
              heading="${useCase.title}"
              description="${useCase.description}"
              icon="${useCase.attributes[0]}"
            ></use-cases-items>
          `;
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