var _ = require('underscore');
var Backbone = require('backbone');
var QueryRowsCollection = require('../../../../../javascripts/cartodb3/data/query-rows-collection');
var QueryColumnsCollection = require('../../../../../javascripts/cartodb3/data/query-columns-collection');
var QuerySchemaModel = require('../../../../../javascripts/cartodb3/data/query-schema-model');
var TableView = require('../../../../../javascripts/cartodb3/components/table/table-view');

describe('components/table/table-view', function () {
  beforeEach(function () {
    this.configModel = new Backbone.Model();
    this.configModel.getSqlApiUrl = function () { return ''; };

    this.modals = {
      create: function () {}
    };

    spyOn(QuerySchemaModel.prototype, 'fetch');
    this.querySchemaModel = new QuerySchemaModel({
      status: 'unfetched'
    }, {
      configModel: this.configModel
    });

    spyOn(QueryRowsCollection.prototype, 'fetch');
    this.rowsCollection = new QueryRowsCollection([], {
      configModel: this.configModel,
      querySchemaModel: this.querySchemaModel
    });

    spyOn(QueryColumnsCollection.prototype, 'fetch');
    this.columnsCollection = new QueryColumnsCollection([], {
      configModel: this.configModel,
      querySchemaModel: this.querySchemaModel
    });

    this.view = new TableView({
      modals: this.modals,
      rowsCollection: this.rowsCollection,
      columnsCollection: this.columnsCollection,
      querySchemaModel: this.querySchemaModel
    });
  });

  it('should create table-view-model', function () {
    expect(this.view._tableViewModel).toBeDefined();
  });

  describe('fetch', function () {
    it('should fetch query-schema-model if it is unfetched', function () {
      expect(QuerySchemaModel.prototype.fetch).toHaveBeenCalled();
    });

    it('should fetch rows data if query-schema-model is already fetched', function () {
      spyOn(TableView.prototype, '_fetchRowsData');
      this.querySchemaModel.set('status', 'fetched');
      var view = new TableView({
        modals: this.modals,
        rowsCollection: this.rowsCollection,
        columnsCollection: this.columnsCollection,
        querySchemaModel: this.querySchemaModel
      });
      expect(TableView.prototype._fetchRowsData).toHaveBeenCalled();
      expect(view).toBeDefined();
    });
  });

  describe('render', function () {
    beforeEach(function () {
      this.view.render();
    });

    it('should render head and body', function () {
      expect(_.size(this.view._subviews)).toBe(2);
    });
  });

  describe('bind', function () {
    it('should reset table view attributes when query has changed', function () {
      this.view._tableViewModel.set({
        page: 3,
        order_by: 'description',
        sort_order: 'desc'
      });
      this.querySchemaModel.set('query', 'SELECT * FROM new_table');
      expect(this.view._tableViewModel.get('page')).toBe(0);
      expect(this.view._tableViewModel.get('order_by')).toBe('');
      expect(this.view._tableViewModel.get('sort_order')).toBe('asc');
    });

    it('should fetch new rows when query fetch has finished', function () {
      this.querySchemaModel.set('status', 'fetched');
      expect(QueryRowsCollection.prototype.fetch).toHaveBeenCalled();
    });

    describe('on table model view changes', function () {
      beforeEach(function () {
        this.querySchemaModel.set('status', 'fetched');
      });

      it('should fetch new rows when table order changes', function () {
        this.view._tableViewModel.set('order_by', 'cartodb_id');
        expect(QueryRowsCollection.prototype.fetch).toHaveBeenCalled();
      });

      it('should fetch new rows when table sort changes', function () {
        this.view._tableViewModel.set('sort_order', 'desc');
        expect(QueryRowsCollection.prototype.fetch).toHaveBeenCalled();
      });
    });
  });

  it('should have no leaks', function () {
    this.view.render();
    expect(this.view).toHaveNoLeaks();
  });

  afterEach(function () {
    this.view.clean();
  });
});
