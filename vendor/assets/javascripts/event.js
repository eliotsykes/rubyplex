(function () {
    var lines = [], printed = false, webruby, load_string_func;

    // Taken from http://stackoverflow.com/a/901144
    function getParameterByName(name) {
        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
            results = regex.exec(location.search);
        return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    }

    function getQueryLevel() {
        var level = parseInt(getParameterByName('level')) || 2;
        level = Math.min(2, level);
        level = Math.max(0, level);
        return level;
    }

    window.Module = {};
    window.Module['print'] = function (x) {
        lines.push(x);
        printed = true;
    };

    $(document).ready(function() {
        webruby = new WEBRUBY({print_level: getQueryLevel()});

        $("#submit-button").click(function() {
            lines = [];
            printed = false;

            webruby.run_source(editor.getValue());

            if (!printed) {
                window.Module['print']('<small><i>(no output)</i></small>');
            }

            var element = $("#results");
            if (!element) return; // perhaps during startup
            element.html(lines.join('<br>') + '<hr>' + element.html());

        });

        $("#clear-editor-button").click(function() {
            editor.session.setValue("");
        });

        $("#clear-console-button").click(function() {
            $("#results").empty();
        });

        window.onbeforeunload = function () {
            webruby.close();
        }
    });
}());