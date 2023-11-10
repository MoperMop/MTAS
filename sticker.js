//@ts-check
export default class Sticker extends HTMLElement {
  static content = /** @type {HTMLTemplateElement} */ (document.querySelector("#sticker")).content;

  #image;
  #print;

  constructor() {
    super();

    const shadow = this.attachShadow({ mode: "closed" });
    shadow.appendChild(Sticker.content.cloneNode(true));


    this.#image = /** @type {HTMLImageElement} */ (shadow.querySelector("img"));
    this.#image.src = this.getAttribute("src") ?? "";
    this.#image.setAttribute("width", this.getAttribute("width") || "");
    this.#image.setAttribute("height", this.getAttribute("height") || "");


    /** @type {HTMLAnchorElement} */ (shadow.querySelector("a")).href = this.getAttribute("src") ?? "";

    this.#print = /** @type {HTMLInputElement} */ (shadow.querySelector("#print"));
    this.#print.addEventListener("input", () => {
      this.selected = this.#print.checked;
    });
  }


  get selected() { return this.hasAttribute("selected"); }
  set selected(value) {
    if (value) this.setAttribute("selected", "");
    else this.removeAttribute("selected");

    this.#print.checked = value;


    Sticker.printPopup.hidden = !Boolean(document.querySelector(`${Sticker.tagName}[selected]`))
  }


  /**
   * print the given stickers
   * @param {...Sticker} stickers 
   */
  static print(...stickers) {
    const iframe = /** @type {HTMLIFrameElement & {contentDocument: Document}} */ (document.querySelector("#print-page"));

    iframe.contentDocument.body.append(...stickers.map(sticker => sticker.#image.cloneNode()));

    iframe.contentWindow?.print();
    iframe.contentDocument.body.innerHTML = "";
  }
  static printPopup = /** @type {HTMLElement} */ (document.querySelector("#print"));
  static printButton = /** @type {HTMLButtonElement} */ (this.printPopup.querySelector("button"));
  static printStylesheet = document.createElement("link");


  static tagName = "sticker-";
  static {
    customElements.define(this.tagName, this);


    this.printButton.addEventListener("click", () => {
      const selected = /** @type {Sticker[]} */ ([...document.querySelectorAll(`${this.tagName}[selected]`)])
      this.print(...selected);


      selected.forEach(sticker => sticker.selected = !sticker.selected);
    });


    this.printStylesheet.href = "print.css";
    this.printStylesheet.rel = "stylesheet";
  }
}