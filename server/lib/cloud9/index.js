/**
 * @copyright 2010, Ajax.org Services B.V.
 * @license GPLv3 <http://www.gnu.org/licenses/gpl.txt>
 */
require("../../../common/paths");
var connect = require("connect");
var IdeServer = require("cloud9/server");

exports.main = function(projectDir, port, ip) {
    var commonProvider = function() {
        var common = connect.staticProvider(__dirname + "/../../../common");
        return function(req, resp, next) {
            var path = require("url").parse(req.url).pathname;
            if (path.indexOf("/common") === 0) {
                req.url = req.url.replace("/common", "");
                common(req, resp, next);
            }
            else {
                next();
            }
        };
    };
    server = connect.createServer(
        //connect.logger(),
        connect.conditionalGet(),
//        connect.gzip(),
        connect.staticProvider(__dirname + "/../../../client"),
        commonProvider()
    );

    if (ip === "all" || ip === "0.0.0.0")
        ip = null;

    server.listen(port, ip);
    new IdeServer(projectDir, server);
};

if (module === require.main) {
    exports.main(".", 3000, '127.0.0.1')
}