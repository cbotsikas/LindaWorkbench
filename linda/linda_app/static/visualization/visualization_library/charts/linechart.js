/*
 * DIMPLE CHART LIBRARY
 * DATA FORMAT: [{"column1":"value1", "column2":"value2", ...}, {"column1":"value3", "column2":"value4", ...}, ...]
 * 
 */

var linechart = function() {

    function draw(configuration, visualisationContainerID) {
        console.log("### INITIALIZE VISUALISATION - LINE CHART");

        var container = $('#' + visualisationContainerID);
        container.empty();

        if (!(configuration.dataModule && configuration.datasourceLocation
                && configuration.xAxis && configuration.yAxis
                && configuration.orderBy)) {
            return $.Deferred().resolve().promise();
        }

        if ((configuration.xAxis.length === 0) || (configuration.yAxis.length === 0)) {
            return $.Deferred().resolve().promise();
        }

        var dataModule = configuration.dataModule;
        var location = configuration.datasourceLocation;

        var selection = {
            dimension: configuration.yAxis, // measure
            multidimension: configuration.xAxis.concat(configuration.addedSeries).concat(configuration.orderBy),
            group: [],
            gridlines: configuration.gridlines,
            hLabel: configuration.hLabel,
            vLabel: configuration.vLabel,
            ticks: configuration.ticks,
            tooltip: configuration.tooltip
        };

        console.log("VISUALISATION SELECTION FOR LINE CHART:");
        console.dir(selection);

        var svg = dimple.newSvg('#' + visualisationContainerID, container.width(), container.height());

        return dataModule.parse(location, selection).then(function(inputData) {
            var columnsHeaders = inputData[0];
            var data = rows(inputData);
            console.log("GENERATE INPUT DATA FORMAT FOR LINE CHART");
            console.dir(data);

            var chart = new dimple.chart(svg, data);

            var x = chart.addCategoryAxis("x", columnsHeaders[1]); // x axis: ordinal values
            var y=chart.addMeasureAxis("y", columnsHeaders[0]); // y axis: one measure (scale)  

            var series = null;

            if (configuration.orderBy.length > 0) {
                x.addOrderRule(columnsHeaders[columnsHeaders.length - 1]); // ordered values on x axis 
            } else if (configuration.addedSeries.length > 0) {
                series = columnsHeaders.slice(2);
            }

            chart.addSeries(series, dimple.plot.line);
            chart.addLegend("10%", "5%", "80%", 20, "right");
            
            //gridlines tuning
            x.showGridlines = selection.gridlines;
            y.showGridlines = selection.gridlines;
            //titles
            if (selection.hLabel ===""){
                selection.hLabel = columnsHeaders[1]; 
            }
            if (selection.vLabel ===""){
                selection.vLabel = columnsHeaders[0];
            }
            x.title = selection.hLabel;
            y.title = selection.vLabel;
            //ticks
            x.ticks = selection.ticks;
            y.ticks = selection.ticks;
            //tooltip
            if (selection.tooltip === false){
                chart.addSeries(series, dimple.plot.line).addEventHandler("mouseover",function(){});
            }
            
            chart.draw();
        });
    }

    function tune(config) {
        console.log("### TUNE LINE CHART");
    }

    function export_as_PNG() {
        return exportC3.export_PNG();
    }

    function export_as_SVG() {
        return exportC3.export_SVG();
    }

    function get_SVG() {
        setTimeout(function() {
            return exportC3.get_SVG();
        }, 2000);
    }

    return {
        export_as_PNG: export_as_PNG,
        export_as_SVG: export_as_SVG,
        get_SVG: get_SVG,
        draw: draw,
        tune: tune
    };
}();