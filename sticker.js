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

    /** @type {HTMLButtonElement} */ (shadow.querySelector("button")).addEventListener("click", () => {Sticker.print(this);});
  }


  /**
   * print the given stickers
   * @param {...Sticker} stickers 
   */
  static print(...stickers) {
    const iframe = document.createElement("iframe");
    iframe.hidden = true;
    document.body.appendChild(iframe);

    for (const sticker of stickers) {
      iframe.contentDocument?.body.appendChild(sticker.#image.cloneNode());
    }

    iframe.contentWindow?.print();
    iframe.remove();

    // prevent weird bug
    for (const sticker of stickers) sticker.#image.src += "";
  }


  static tagName = "sticker-";
  static { customElements.define(this.tagName, this); }
}