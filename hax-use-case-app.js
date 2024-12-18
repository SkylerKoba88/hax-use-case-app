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
    this.useCaseId = "";
    this.searchValue = "";
    this.filteredResults = [];
    this.checkedFilters = [];
    this.renderUseCases = [];
    this.activeUseCase = false;
    this.updateResults(this.value);
  }

  // Lit reactive properties
  static get properties() {
    return {
      loading: { type: Boolean, reflect: true },
      useCases : {type: Array},
      searchValue : {type: String},
      filteredResults: {type: Array},
      checkedFilters: {type: Array},
      activeUseCase: {type: Boolean, reflect: true},
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
        width: 430px;
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
      .results {
        display: flex;
        flex-wrap: wrap;
        gap: 4px;
        width: 100%;
        padding: 8px;
        box-sizing: border-box;
      }
      .activeUseCase {
        background-color: blue;
      }
      use-cases-items {
        width: 100%;
        max-width: 240px;
      }
    `];
  }

  //reset filters
  resetFilters() {
    this.shadowRoot.querySelector('#input').value = '';
    this.searchValue = "";
    this.checkedFilters = [];
    const checkboxes = this.shadowRoot.querySelectorAll("input[type='checkbox']");
      checkboxes.forEach((checkbox) => {
        checkbox.checked = false;
      });
    this.filteredResults = this.useCases.map((useCase) => 
    html`
      <use-cases-items
        tag="${useCase.tag}"
        demoLink="${useCase.demoLink}"
        source="${useCase.source}"
        heading="${useCase.heading}"
        description="${useCase.description}"
        iconImage="${useCase.iconImage}"
        activeUseCase="${useCase.activeUseCase}"
      ></use-cases-items>
    `);
    this.requestUpdate();
  }
//filter results
//For the life of me I cannot get this to work with the way I set up my code
  filter() {
    this.searchValue = this.value?.toLowerCase() || ""; //declares search value to value in lowercase

    this.filteredResults = this.useCases.filter((useCase) => { //maps filteredResults
      const matchSearch = this.searchValue ? useCase.tag.toLowerCase().includes(this.searchValue) : true;

      const useCaseTag = useCase.tag?.toLowerCase() || "";
      const matchFilters = this.checkedFilters.length === 0
      ? true
      : this.checkedFilters.some((filter) => 
      useCase.useCaseTag?.toLowerCase() === filter.toLowerCase()
      );

      return matchSearch && matchFilters;
    })
    this.renderUseCases = this.filteredResults.map((useCase) => {
      const isSelected = this.activeUseCase === useCase.useCaseId; // Determine if this use case is active
      return html`
        <use-cases-items
          .tag="${useCase.tag}"
          .demoLink="${useCase.demoLink}"
          .source="${useCase.source}"
          .heading="${useCase.heading}"
          .description="${useCase.description}"
          .iconImage="${useCase.iconImage}"
          .isSelected="${isSelected}"
          @select-use-case="${() => this.selectUseCase(useCase.useCaseId)}"
        ></use-cases-items>
      `;
    });
    this.requestUpdate();
  }

  handleSearch(event) {
    this.searchValue = event.target.value.toLowerCase();
  }

  updateFilterState(e) {
    const filter = e.target.dataset.id;
    if (e.target.checked) {
      this.checkedFilters = [...this.checkedFilters, filter];
    } else {
      this.checkedFilters = this.checkedFilters.filter((item) => item !== filter);
    }
    console.log('Checked Filters:', this.checkedFilters);
    this.filter();
    console.log("Use Cases:", this.useCases.map(useCase => useCase.tag));
  }

  selectUseCase(useCaseId) {
    this.activeUseCase = this.activeUseCase === useCaseId ? null : useCaseId;
  
    // Update the state of each rendered item
    this.renderUseCases = this.useCases.map((useCase) => {
      const isSelected = this.activeUseCase === useCase.useCaseId; // Check if active
      return html`
        <use-cases-items
          .tag="${useCase.tag}"
          .demoLink="${useCase.demoLink}"
          .source="${useCase.source}"
          .heading="${useCase.heading}"
          .description="${useCase.description}"
          .iconImage="${useCase.iconImage}"
          .isSelected="${isSelected}"
          @select-use-case="${() => this.selectUseCase(useCase.useCaseId)}"
        ></use-cases-items>
      `;
    });
  
    this.requestUpdate();
  }

//render html
  render() {
    return html`
    <div id="content" style="display: inline-flex;">
    <div class="filter">
        <simple-icon-lite icon="icons:search"></simple-icon-lite>
        <input type="text" id="input" placeholder="Search templates here" @input='${this.inputChanged}'>
        <button id="reset" @click="${this.resetFilters}">Reset</button>
        <h5>Templates</h5>
        <div class="filterButtons">
          <label><input type="checkbox" data-id="portfolio" @change=${this.updateFilterState}>Portfolio</label>
          <label><input type="checkbox" data-id="blog" @change=${this.updateFilterState}>Blog</label>
          <label><input type="checkbox" data-id="research" @change=${this.updateFilterState}>Research Site</label>
          <label><input type="checkbox" data-id="resume" @change=${this.updateFilterState}>Resume</label>
          <label><input type="checkbox" data-id="course" @change=${this.updateFilterState}>Course</label>
        </div>
      </div>

      <div class="results">
        ${this.renderUseCases.length
          ? this.renderUseCases
          : html`<p>No templates available. Try searching or select a tag.</p>`}
      </div>
    </div>
      
      `;
  }
  inputChanged(e) {
    this.value = this.shadowRoot.querySelector('#input').value;
    this.searchValue = e.target.value.toLowerCase();
    this.filter();
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

  fetch(new URL('./lib/use-case-data.json', import.meta.url).href)
    .then(response => {
      if (!response.ok) throw new Error('Network response was not ok');
      return response.json();
    })
    .then(data => {
      if (Array.isArray(data.data)) {
        this.useCases = data.data.map((useCase) => ({
          useCaseId: useCase.id,
          tag: useCase.tag || "",
          demoLink: useCase.demo || "",
          source: useCase.image || "",
          heading: useCase.title || "",
          description: useCase.description || "",
          iconImage: useCase.attribute || ""
        }));

        this.filteredResults = [...this.useCases];  // Display all use cases initially
        this.filter(); // Apply filtering logic
      } else {
        console.error("Data format issue");
        this.useCases = [];
      }
      this.loading = false;
    })
    .catch(error => console.error("Fetch error:", error));
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