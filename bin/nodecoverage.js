#!/usr/bin/env node_g

var
  fs = require("fs"),
  sys = require("sys"),
  exec = require('child_process').exec;

var
  package_json,
  args = process.ARGV.slice(2),
  usage = "Usage: nodecoverage [options] <build|run>\n" +
          "Options:\n\n" +
          "  -h, --help     Show this help information\n" +
          "  -v, --version  Print nodecoverage's version\n";

// Read package.json file
try {
  package_json = fs.readFileSync("package.json");
} catch (e) {
  sys.puts("ERROR: Can't read package.json file.");
  process.exit(1);
}

// Parse package.json
try {
  package_json = JSON.parse(package_json);
} catch (e) {
  sys.puts("ERROR: Malformed package.json file.");
  process.exit(1);
}

function build() {
  sys.puts("Info: run build script");

  if (!package_json.scripts || !package_json.scripts.build) {
    sys.puts("ERROR: Build script isn't specified in package.json file.");
    process.exit(1);
  }

  sys.puts("Info: Build using `" + package_json.scripts.build + "`");

  var child = exec('CXX="g++ -fprofile-arcs -ftest-coverage" ' +
                   package_json.scripts.build,
                   function (error, stdout, stderr) {
    sys.puts("Stdout:\n" + stdout);
    sys.puts("Stderr:\n" + stderr);
    if (error !== null) {
      sys.puts("Exec error: " + error);
      process.exit(1);
    }
  });
}

// a very basic pseudo --options parser
args.forEach(function (arg) {
  if (arg === 'build') {
    build();
  } else if (arg === 'run') {
    sys.puts("ERROR: Not implemented yet.");
    process.exit(1);
  } else if ((arg === '-v') || (arg === '--version')) {
    package_json = fs.readFileSync(__dirname + '/../package.json', 'utf8');
    package_json = JSON.parse(package_json);
    sys.puts("Nodecoverage version: " + package_json.version);
    process.exit(0);
  } else if ((arg === '-h') || (arg === '--help')) {
    sys.puts(usage);
    process.exit(0);
  } else {
    sys.puts("ERROR: You must specify nodecoverage action.");
    sys.puts(usage);
    process.exit(0);
  }
});

