'use strict';

module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        eslint: {
            options: {
                configFile: ".eslintrc"
            },
            src: 'app/javascripts/**/*.js',
            test: 'test/javascripts/**/*.js'
        },
        webpack: {
            options: {
                module: {
                    loaders: [{
                        test: /.js?$/,
                        exclude: /node_modules/,
                        loader: 'babel',
                        query: {
                            presets: ['es2015']
                        }
                    }]
                },
                stats: {
                    colors: true,
                    modules: false,
                    reasons: true
                },
                progress: false,
                devtool: 'source-map'
            },
            main: {
                entry: './src/javascripts/main.js',
                output: {
                    path: 'public/javascripts/',
                    filename: 'main.js'
                }
            }
        },
        karma: {
            unit: {
                configFile: 'karma.conf.js'
            }
        },
        sass: {
            options: {
                //style: 'compressed'
            },
            dist: {
                files: {
                    'build/stylesheets/main.css': 'src/stylesheets/main.scss'
                }
            }
        },
        cssjoin: {
            dist: {
                files: {
                    'public/stylesheets/main.min.css': ['build/stylesheets/main.css']
                }
            }
        },
        copy: {
            fonts: {
                files: [
                    {
                        expand: true,
                        flatten: true,
                        cwd: 'node_modules/bootstrap/fonts',
                        src: '**',
                        dest: 'public/fonts/'
                    },
                    {
                        expand: true,
                        cwd: 'node_modules/flat-ui/fonts',
                        src: '**',
                        dest: 'public/fonts/'
                    },
                    {
                        expand: true,
                        flatten: true,
                        cwd: 'node_modules/font-awesome/fonts',
                        src: '**',
                        dest: 'public/fonts/'
                    }
                ]
            },
            javascripts: {
                files: [
                    {
                        expand: true,
                        flatten: true,
                        src: ['node_modules/jquery/dist/jquery.min.js'],
                        dest: 'public/javascripts/'
                    },
                    {
                        expand: true,
                        flatten: true,
                        src: ['node_modules/bootstrap/dist/js/bootstrap.min.js'],
                        dest: 'public/javascripts/'
                    }
                ]
            }
        }
    });

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks("gruntify-eslint");
    grunt.loadNpmTasks('grunt-babel');
    grunt.loadNpmTasks('grunt-webpack');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-cssjoin');

    // Tasks
    grunt.registerTask('angular', ['eslint', 'webpack']);
    grunt.registerTask('assets', ['sass', 'cssjoin', 'copy']);
    grunt.registerTask('test', ['karma']);

    grunt.registerTask('default', ['assets', 'angular', 'test']);

};
