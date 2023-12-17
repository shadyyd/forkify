import View from './View';
import icons from '../../img/icons.svg';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  _generateMarkup() {
    // console.log(this._data);
    const curPage = this._data.page;
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );
    // last page
    if (curPage === numPages && numPages > 1) {
      return this._generatePageButton('prev', curPage);
    }
    // first and not only
    if (curPage === 1 && numPages > 1) {
      return this._generatePageButton('next', curPage);
    }
    // other pages
    if (curPage > 1 && curPage < numPages) {
      return `${this._generatePageButton(
        'prev',
        curPage
      )} ${this._generatePageButton('next', curPage)}`;
    }
    // first and only page
    return '';
  }
  _generatePageButton(type, curPage) {
    return `
        <button data-goto="${
          type === 'next' ? curPage + 1 : curPage - 1
        }" class="btn--inline pagination__btn--${
      type === 'next' ? 'next' : 'prev'
    }">
            ${type === 'next' ? `<span>Page ${curPage + 1}</span>` : ''}
            <svg class="search__icon">
                <use href="${icons}#icon-arrow-${
      type === 'next' ? 'right' : 'left'
    }"></use>
            </svg>
            ${type === 'prev' ? `<span>Page ${curPage - 1}</span>` : ''}
            
        </button>
    `;
  }
  addClickHandler(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;
      const goto = +btn.dataset.goto;
      handler(goto);
    });
  }
}

export default new PaginationView();
