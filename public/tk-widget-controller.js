'use strict';

//import uiModules from 'ui/modules';
import { uiModules } from 'ui/modules';
import { AggResponseTabifyProvider } from 'ui/agg_response/tabify/tabify';


// get the kibana/tk-widget-vis module, and make sure that it requires the "kibana" module if it didn't already
const module = uiModules.get('kibana/tk-widget-vis', ['kibana']);

// Require TK_widget
const tk = require('tk-widget');

module.controller('TKWidgetVisController', function ($scope, $element, Private) {
    var hold = 0;
    var wold = 0;
    const tabifyAggResponse = Private(AggResponseTabifyProvider);
    var idchart = $element.children().find(".chartc3");
    var chart_labels = {};
    var parsed_data = [];
    $scope.$root.label_keys = [];
    $scope.$root.editorParams = {};
    var x_axis_values = [];
    var x_label = "";
    const message = 'This chart require more than one data point.';

    // Be alert to changes in vis_params
    $scope.$watch('vis.params', function (params) {

        if (!$scope.$root.show_chart) return;
        $scope.chartGen();
    });

    var data = {
        avoiding: {
            activated: false
        },
        competing: {
            activated: false
        },
        accomodating: {
            activated: false
        },
        compromising: {
            activated: false
        },
        collaborating: {
            activated: false
        }
    };
    // C3JS chart generator
    $scope.chartGen = function () {

        // change bool value
        $scope.$root.show_chart = true;

        // Generate and draw
        for (var i = 0; i < parsed_data.length; i++) {
            var esData = parsed_data[i];
            if (esData.length == 2) {
                var tk_key = esData[0];
                data[tk_key] = {
                    activated: false
                }
            }
        }
        var max = 0;
        var tkFinalKey = null;
        for (var i = 0; i < parsed_data.length; i++) {
            var esData = parsed_data[i];
            if (esData.length == 2) {
                var tk_key = esData[0];
                var tk_amount = esData[1];
                if (tk_amount > max) {
                    max = tk_amount;
                    tkFinalKey = tk_key;
                }
            }
        }
        if (tkFinalKey) {
            data[tkFinalKey].activated = true;
        }

        if (!$scope.chart) {
            $scope.chart = new tk.generate({'bindto': idchart[0], 'data': data});
        } else {
            $scope.chart.update(data);
        }

        // resize
        var elem = $(idchart[0]).closest('div.visualize-chart');
        var h = elem.height() - 50;
        var w = elem.width() - 50;

        if (!h) {
            h = 0;
        }

        if (!w) {
            w = 0;
        }

        if (h < 50) {
            h = 100;
        }

        if (w < 50) {
            w = 200;
        }

        $(idchart[0]).css('max-height', '155px');
        $(idchart[0]).css('height', '155px');
        $scope.chart.resize({height: h, width: w});

    };

    // Get data from ES
    $scope.processTableGroups = function (tableGroups) {
        tableGroups.tables.forEach(function (table) {
            table.columns.forEach(function (column, i) {

                var data = table.rows;
                var tmp = [];
                parsed_data = table.rows;

                for (var val in data) {
                    tmp.push(data[val][i]);
                }

                if (i > 0) {

                    $scope.$root.label_keys.push(column.title);
                    chart_labels[column.title] = column.title;
                    tmp.splice(0, 0, column.title);
                } else {
                    x_label = column.title;
                    x_axis_values.push(tmp);
                }

            });
        });

        $scope.$root.editorParams.label = chart_labels;
    };

    $scope.$watch('esResponse', function (resp) {
        if (resp) {

            if (!$scope.vis.aggs.bySchemaName['buckets']) {
                $scope.waiting = message;
                return;
            }

            $scope.$root.label_keys = [];
            $scope.processTableGroups(tabifyAggResponse($scope.vis, resp));

            // avoid reference between arrays!!!
            $scope.chartGen();
        }

    });

    // Automatic resizing of graphics
    $scope.$watch(
        function () {
            if (!$scope.chart) return;

            var elem = $(idchart[0]).closest('div.visualize-chart');
            var h = elem.height();
            var w = elem.width();

            if (!h) {
                h = 0;
            }

            if (!w) {
                w = 0;
            }

            if (h < 50) {
                h = 150;
            }

            if (w < 50) {
                w = 200;
            }

            $(idchart[0]).css('max-height', '155px');
            $(idchart[0]).css('height', '155px');
            if (idchart.length > 0 && h > 0 && w > 0) {

                if (hold != h || wold != w) {
                    $scope.chart.resize({height: h - 50, width: w - 50});
                    hold = elem.height();
                    wold = elem.width();
                }
            }
        },
        true
    );

});

