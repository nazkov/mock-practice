import React, { useState } from 'react';
import cn from 'classnames';
import './App.scss';

import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';

export const App = () => {
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const getCategoryById = id => categoriesFromServer.find(c => c.id === id);
  const getUserById = id => usersFromServer.find(u => u.id === id);

  const filteredProducts = productsFromServer.filter(product => {
    const category = getCategoryById(product.categoryId);
    const user = getUserById(category?.ownerId);

    const matchesUser = selectedUserId ? user?.id === selectedUserId : true;
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    return matchesUser && matchesSearch;
  });

  const handleUserFilter = userId => setSelectedUserId(userId);
  const handleSearchChange = e => setSearchQuery(e.target.value);
  const handleClearSearch = () => setSearchQuery('');
  const handleResetFilters = () => {
    setSelectedUserId(null);
    setSearchQuery('');
  };

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Product Categories</h1>

        <div className="block">
          <nav className="panel">
            <p className="panel-heading">Filters</p>

            <p className="panel-tabs has-text-weight-bold">
              <a
                data-cy="FilterAllUsers"
                href="#/"
                className={cn({ 'is-active': selectedUserId === null })}
                onClick={() => handleUserFilter(null)}
              >
                All
              </a>

              {usersFromServer.map(user => (
                <a
                  key={user.id}
                  data-cy="FilterUser"
                  href="#/"
                  className={cn({ 'is-active': selectedUserId === user.id })}
                  onClick={() => handleUserFilter(user.id)}
                >
                  {user.name}
                </a>
              ))}
            </p>

            <div className="panel-block">
              <p className="control has-icons-left has-icons-right">
                <input
                  data-cy="SearchField"
                  type="text"
                  className="input"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>
                {searchQuery && (
                  <span className="icon is-right">
                    <button
                      data-cy="ClearButton"
                      type="button"
                      className="delete"
                      onClick={handleClearSearch}
                    />
                  </span>
                )}
              </p>
            </div>

            <div className="panel-block">
              <a
                data-cy="ResetAllButton"
                href="#/"
                className="button is-link is-outlined is-fullwidth"
                onClick={handleResetFilters}
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          {filteredProducts.length === 0 ? (
            <p data-cy="NoMatchingMessage">
              No products matching selected criteria
            </p>
          ) : (
            <table
              data-cy="ProductTable"
              className="table is-striped is-narrow is-fullwidth"
            >
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Product</th>
                  <th>Category</th>
                  <th>User</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map(product => {
                  const category = getCategoryById(product.categoryId);
                  const user = getUserById(category?.ownerId);

                  return (
                    <tr key={product.id} data-cy="Product">
                      <td className="has-text-weight-bold" data-cy="ProductId">
                        {product.id}
                      </td>
                      <td data-cy="ProductName">{product.name}</td>
                      <td data-cy="ProductCategory">
                        {category?.icon} - {category?.title}
                      </td>
                      <td
                        data-cy="ProductUser"
                        className={cn({
                          'has-text-link': user?.sex === 'm',
                          'has-text-danger': user?.sex === 'f',
                        })}
                      >
                        {user?.name}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
