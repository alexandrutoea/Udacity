import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import serializeForm from 'form-serialize';

import * as BooksAPI from '../BooksAPI';

import BookShelf from './BookShelf';

class SearchPage extends Component {
  static propTypes = {
    books: PropTypes.array,
    handleBookStatusUpdate: PropTypes.func.isRequired,
  }

  static defaultProps = {
    books: [],
  }

  state = {
    searchedList: [],
  }

  handleSearchSubmit(e) {
    // Handles submitting teh search form

    e.preventDefault();
    const values = serializeForm(e.target, { hash: true });
    // load books form API
    BooksAPI.search(values.searchTerm, 20).then((books) => {
      const searchedBooks = books;
      const currentBooks = this.props.books;

      // Set the parameters of books to match the ones on shelves if they match
      for (let i = 0; i < searchedBooks.length; i++) {
        for (let j = 0; j < currentBooks.length; j++) {
          if (searchedBooks[i].id === currentBooks[j].id) {
            searchedBooks[i].shelf = currentBooks[j].shelf;
            break;
          } else {
            searchedBooks[i].shelf = 'none';
          }
        }
      }

      this.setState({ searchedList: searchedBooks });
    });
  }

  render() {
    return (
      <div className='search-books'>
        <div className='search-books-bar'>
          <Link className='close-search' to='/'>Close</Link>
          <form onSubmit={ (e) => { this.handleSearchSubmit(e); } }>
            <div className='search-books-input-wrapper'>
              <input type='text' name='searchTerm' placeholder='Search by title or author' />
            </div>
          </form>
        </div>
        <div className='search-books-results'>
          <BookShelf
            bookShelfTitle='Search Results'
            books={ this.state.searchedList }
            handleStatusUpdate={ this.props.handleBookStatusUpdate }
          />
          <ol className='books-grid' />
        </div>
      </div>
    );
  }
}

export default SearchPage;
