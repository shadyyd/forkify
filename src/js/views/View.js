import icons from '../../img/icons.svg';
export default class View {
  _data;

  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renederError();

    this._data = data;
    const markup = this._generateMarkup();
    if (!render) return markup;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
  update(data) {
    this._data = data;
    const newMarkup = this._generateMarkup();
    const newDom = document.createRange().createContextualFragment(newMarkup);
    const newElements = Array.from(newDom.querySelectorAll('*'));
    //this creates a virtual dom with the new markup
    //this is the dom that the render method would render it
    // we only want to update the changed elements
    // so we need to select the current elements in the dom to compare it with the virtual one we created
    const curElements = Array.from(this._parentElement.querySelectorAll('*'));
    // console.log(curElements, newElements);
    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];
      // console.log(curEl, newEl.isEqualNode(curEl));

      // if the current element is not equal to the new element then replace the text of the current element with the new element
      // Note if there is a button changed inside the a div: the div and the button both will mark unequal so then we want to determine the nodes with text in it to replace that text . if we tried to replace any node marked with unequal it will not work
      if (
        !newEl.isEqualNode(curEl) &&
        newEl?.firstChild?.nodeValue.trim() !== ''
      ) {
        // console.log(curEl, newEl?.firstChild.nodeValue.trim());
        curEl.textContent = newEl.textContent;
      }
      // Now we have updated any text has changed but also we need to update changed attributes
      if (!newEl.isEqualNode(curEl)) {
        Array.from(newEl.attributes).forEach(attr => {
          curEl.setAttribute(attr.name, attr.value);
        });
      }
    });
  }

  _clear() {
    this._parentElement.innerHTML = '';
  }

  renederError(message = this._errorMessage) {
    const markup = `
          <div class="error">
          <div>
          <svg>
          <use href="${icons}#icon-alert-triangle"></use>
          </svg>
          </div>
          <p>${message}</p>
            </div>
            `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renederMessage(message = this._message) {
    const markup = `
        <div class="message">
        <div>
        <svg>
        <use href="src/img/icons.svg#icon-smile"></use>
        </svg>
        </div>
        <p>${message}</p>
        </div>
        `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderSpinner() {
    const markup = `
        <div class="spinner">
        <svg>
        <use href="${icons}#icon-loader"></use>
        </svg>
        </div>
        `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
}
