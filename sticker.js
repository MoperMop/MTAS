//@ts-check
export default class Sticker extends HTMLElement {
  static content = /** @type {HTMLTemplateElement} */ (document.querySelector("#sticker")).content;

  #image;

  constructor() {
    super();

    const shadow = this.attachShadow({ mode: "closed" });
    shadow.appendChild(Sticker.content.cloneNode(true));


    this.#image = /** @type {HTMLImageElement} */ (shadow.querySelector("img"));
    this.#image.src = this.getAttribute("src") ?? "";
    this.#image.setAttribute("width", this.getAttribute("width") || "");
    this.#image.setAttribute("height", this.getAttribute("height") || "");


    /** @type {HTMLAnchorElement} */ (shadow.querySelector("a")).href = this.getAttribute("src") ?? "";

    /** @type {HTMLInputElement} */ (shadow.querySelector("#print")).addEventListener("input", () => {
      if (this.hasAttribute("selected")) this.removeAttribute("selected");
      else this.setAttribute("selected", "");


      Sticker.printPopup.hidden = !Boolean(document.querySelector(`${Sticker.tagName}[selected]`))
    });
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


      selected.forEach(sticker => sticker.removeAttribute("selected"));


      this.printPopup.hidden = true;
    });


    this.printStylesheet.href = "print.css";
    this.printStylesheet.rel = "stylesheet";
  }
}