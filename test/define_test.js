/*globals define */

module("define");

test("executes code", 1, function() {
    define(function() {
        ok(true, "executed module definition");
    });
});

test("exports a module", 1, function() {
    var definition = {};

    define('obj', function() {
        return definition;
    });

    define(['obj'], function(obj) {
        strictEqual(obj, definition, "imported implementation of 'obj'");
    });
});

test("resolves multiple dependencies", 2, function() {
    var implementation1 = {}
      , implementation2 = {};

    define('module1', function() {
        return implementation1;
    });

    define('module2', function() {
        return implementation2;
    });

    define(['module1', 'module2'], function(module1, module2) {
        strictEqual(module1, implementation1, "got implementation for module1");
        strictEqual(module2, implementation2, "got implementation for module2");
    });
});

test("resolves dependencies that are provided out of order", 2, function() {
    var implementationA = {}
      , implementationB = {};

    define(['moduleB'], function(moduleB) {
        strictEqual(moduleB, implementationB, "got implementation for moduleB");
    });

    define('moduleB', ['moduleA'], function(moduleA) {
        strictEqual(moduleA, implementationA, "got implementation for moduleA");
        return implementationB;
    });

    define('moduleA', function() {
        return implementationA;
    });
});

test("accept an object as a module definition", 1, function() {
    var definition = {};

    define('awesomeModule', definition);

    define(['awesomeModule'], function(module) {
        strictEqual(module, definition, "got implementation for awesomeModule");
    });
});

test("resolves dependencies that are provided asynchronously", 1, function() {
    stop(100);

    var asyncDefinition = {};

    define(['asyncModule'], function(asyncModule) {
        strictEqual(asyncModule, asyncDefinition, "got implementation for asyncModule");
        start();
    });

    setTimeout(function() {
        define('asyncModule', asyncDefinition);
    }, 10);
});

test("includes 'amd' property", 1, function() {
    equal(typeof define.amd, 'object', "define.amd is an object");
});
