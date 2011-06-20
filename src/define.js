/**
 * Minimal implementation of Modules/AsynchronousDefinition as described
 * in http://wiki.commonjs.org/wiki/Modules/AsynchronousDefinition
 *
 * For a more complete implementation use RequireJS
 * <http://requirejs.org/>.
 */

var define = (function() {
    var definitions = {},
        pending = [];

    /**
     * Given a list and a predicate, returns a pair of lists where the
     * first list contains all elements of the original list for which
     * the predicate evaluated to true, and the second returned list
     * contains other elements from the original list.
     */
    function partition(predicate, list) {
        var passed = list.filter(predicate);
        var failed = list.filter(function(e) {
            return !predicate(e);
        });

        return [passed, failed];
    }

    function addDefinition(id, object) {
        if (id) {
            definitions[id] = object;
        }
    }

    function dependenciesFor(module) {
        return module.dependencies.map(function(id) {
            return definitions[id];
        }).filter(function(dep) {
            return !!dep;
        });
    }

    function runPending() {
        var partitioned = partition(function(module) {
            return dependenciesFor(module).length !== module.dependencies.length;
        }, pending);

        pending = partitioned[0];
        var satisfied = partitioned[1];

        satisfied.forEach(function(module) {
            var dependencies = dependenciesFor(module);
            addDefinition(module.id, module.factory.apply(null, dependencies));
        });

        if (satisfied.length > 0) {
            runPending();
        }
    }

    function define(/* [id], [dependencies], factory */) {
        var id, dependencies, factory
          , args = Array.prototype.slice.call(arguments)
          , asyncModule;

        if (args.length > 1 && typeof args[0] == 'string') {
            id = args.shift();
        }

        if (args.length > 1 && args[0] && typeof args[0].length == 'number') {
            dependencies = args.shift();
        }

        factory = args.shift();

        if (typeof factory == 'function') {
            pending.push({
                id: id,
                dependencies: dependencies || [],
                factory: factory
            });
            runPending();

        } else if (factory) {
            addDefinition(id, factory);
            runPending();

        } else {
            throw "no module definition was given";
        }
    }

    define.amd = {};

    return define;
})();
