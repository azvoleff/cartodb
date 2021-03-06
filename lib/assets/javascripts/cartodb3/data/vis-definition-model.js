var _ = require('underscore');
var Backbone = require('backbone');

/**
 * Model that represents a visualization (v3)
 *
 * Even though a table might be represented as a Visualization in some cases, please use TableModel if you want to work
 * with the table data instead of adding table-specific methods here.
 */

var ALL_PRIVACY_OPTIONS = ['PUBLIC', 'LINK', 'PRIVATE', 'PASSWORD'];

module.exports = Backbone.Model.extend({

  initialize: function (attrs, opts) {
    if (!opts.configModel) throw new Error('configModel is required');

    this._configModel = opts.configModel;
  },

  urlRoot: function () {
    var baseUrl = this._configModel.get('base_url');
    var version = this._configModel.urlVersion('visualization');
    return baseUrl + '/api/' + version + '/viz';
  },

  isVisualization: function () {
    return this.get('type') === 'derived';
  },

  privacyOptions: function () {
    if (this.isVisualization()) {
      return ALL_PRIVACY_OPTIONS;
    } else {
      return _.reject(ALL_PRIVACY_OPTIONS, function (option) {
        return option === 'PASSWORD';
      });
    }
  }
});
