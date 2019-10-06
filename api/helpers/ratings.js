function define(name, value) {
    Object.defineProperty(exports, name, {
        value:      value,
        enumerable: true
    });
}

define("LIKES", 5);
define("VIEWS", 1);
define("UPLOAD", 1);