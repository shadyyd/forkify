import * as modal from './modal.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

import 'core-js/stable'; // polyfilling everything
import 'regenerator-runtime/runtime'; // pollyfilling async await

const controlRecipe = async function () {
  try {
    //getting recipe id
    const id = window.location.hash.slice(1);
    // console.log(id);

    if (!id) return;
    // mark selected recipe in ResultsView and in BookmarksView
    resultsView.update(modal.getSearchResultsPage());
    bookmarksView.update(modal.state.bookmarks);

    // spinner
    recipeView.renderSpinner();

    // loading recipe
    await modal.loadRecipe(id);

    //rendering recipe
    recipeView.render(modal.state.recipe);
  } catch (err) {
    console.error(err, 'sss');
    recipeView.renederError();
  }
};
const controlSearchResults = async function () {
  // Render spinner
  resultsView.renderSpinner();

  //getting query from searchView
  const query = searchView.getQuery();
  if (!query) return;

  // passing query to the modal
  await modal.loadSearchResult(query);

  //render results
  resultsView.render(modal.getSearchResultsPage());

  // render pagination
  paginationView.render(modal.state.search);
};

const controlPagination = function (goto) {
  // Render new page results
  resultsView.render(modal.getSearchResultsPage(goto));

  // Render new page buttons
  paginationView.render(modal.state.search);
};

const controlServings = function (newServing) {
  // Update the recipe servings (in state)
  modal.updateServings(newServing);

  // Update the recipe view
  recipeView.update(modal.state.recipe);
};

const controlAddBookmarks = function () {
  // Add or Remove Bookmarks
  if (!modal.state.recipe.bookmarked) modal.addBookmark(modal.state.recipe);
  else if (modal.state.recipe.bookmarked)
    modal.deleteBookmark(modal.state.recipe.id);
  // Update Recipe View
  recipeView.update(modal.state.recipe);
  // Render Bookmarks
  bookmarksView.render(modal.state.bookmarks);
};
const controlBookmarks = function () {
  bookmarksView.render(modal.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    // Show loading spinner
    addRecipeView.renderSpinner();

    // Upload the new recipe data
    await modal.uploadRecipe(newRecipe);
    console.log(modal.state.recipe);

    // Render recipe
    recipeView.render(modal.state.recipe);

    // Success message
    addRecipeView.renederMessage();

    // Render bookmark view
    bookmarksView.render(modal.state.bookmarks);

    // Change ID in URL
    window.history.pushState(null, '', `#${modal.state.recipe.id}`);

    // Close form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error('💥', err);
    addRecipeView.renderError(err.message);
  }
};

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipe);
  recipeView.addHandlerServings(controlServings);
  recipeView.addHandlerBookmark(controlAddBookmarks);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addClickHandler(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();
