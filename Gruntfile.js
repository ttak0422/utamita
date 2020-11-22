module.exports = function (grunt) {
    grunt.loadNpmTasks("grunt-shell");
    grunt.initConfig({
        shell: {
            production: {
                command:
                    ['if [ -d "dist" ]; then rm -r dist;  fi'
                        , 'webpack --config webpack.utamita.ts --env isProduction=true'
                        , 'webpack --config webpack.config.ts --env isProduction=true'
                    ].join(' && ')
            },
            development: {
                command:
                    ['webpack --config webpack.utamita.ts'
                        , 'webpack --config webpack.config.ts'
                    ].join(' && ')
            }
        }
    });
    grunt.registerTask("default", ["shell:production"]);
    grunt.registerTask("dev", ["shell:development"]);

};  