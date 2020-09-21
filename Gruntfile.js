module.exports = function (grunt) {
    grunt.loadNpmTasks("grunt-shell");
    grunt.initConfig({
        shell: {
            command: 
                [ 'if [ -d "dist" ]; then rm -r dist;  fi'
                , 'webpack --config webpack.utamita.ts --mode=production'    
                , 'webpack --config webpack.config.ts --mode=production'    
                ].join(' && ')
        },
    });
    grunt.registerTask("default", ["shell"]);
};  