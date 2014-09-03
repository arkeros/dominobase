// Generated on 2014-08-25 using generator-webapp 0.4.9
'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function (grunt) {

    // Load grunt tasks automatically
    require('load-grunt-tasks')(grunt);

    // Time how long tasks take. Can help when optimizing build times
    require('time-grunt')(grunt);

    // Configurable paths
    var config = {
        app: 'app',
        dist: 'dist'
    };

    // Define the configuration for all the tasks
    grunt.initConfig({

        // Project settings
        config: config,

        // Watches files for changes and runs tasks based on the changed files
        watch: {
            bower: {
                files: ['bower.json'],
                tasks: ['bowerInstall']
            },
            js: {
                files: ['<%= config.app %>/scripts/{,*/}*.js'],
                tasks: ['jshint'],
                options: {
                    livereload: true
                }
            },
            jstest: {
                files: ['test/spec/{,*/}*.js'],
                tasks: ['test:watch']
            },
            gruntfile: {
                files: ['Gruntfile.js']
            },
            compass:{
                files : ['<%= config.app %>/styles/{,*/}*.{scss,sass}'],
                tasks: ['compass:dist']
            },
            styles: {
                files: ['<%= config.app %>/styles/{,*/}*.css'],
                tasks: ['newer:copy:styles', 'autoprefixer']
            },
            livereload: {
                options: {
                    livereload: '<%= connect.options.livereload %>'
                },
                files: [
                    '<%= config.app %>/{,*/}*.html',
                    '.tmp/styles/{,*/}*.css',
                    '<%= config.app %>/images/{,*/}*'
                ]
            }
        },

        // The actual grunt server settings
        connect: {
            options: {
                port: 9000,
                open: true,
                livereload: 35729,
                // Change this to '0.0.0.0' to access the server from outside
                hostname: 'localhost'
            },
            livereload: {
                options: {
                    middleware: function(connect) {
                        return [
                            connect.static('.tmp'),
                            connect().use('/bower_components', connect.static('./bower_components')),
                            connect.static(config.app)
                        ];
                    }
                }
            },
            test: {
                options: {
                    open: false,
                    port: 9001,
                    middleware: function(connect) {
                        return [
                            connect.static('.tmp'),
                            connect.static('test'),
                            connect().use('/bower_components', connect.static('./bower_components')),
                            connect.static(config.app)
                        ];
                    }
                }
            },
            dist: {
                options: {
                    base: '<%= config.dist %>',
                    livereload: false
                }
            }
        },

        // Empties folders to start fresh
        clean: {
            dist: {
                files: [{
                    dot: true,
                    src: [
                        '.tmp',
                        '<%= config.dist %>/*',
                        '!<%= config.dist %>/.git*'
                    ]
                }]
            },
            server: '.tmp'
        },
        
    //http://stackoverflow.com/questions/16425728/yeoman-grunt-not-compiling-compass
      compass: {
        options: {
          sassDir: '<%= config.app %>/styles',
          cssDir: '.tmp/styles',
          imagesDir: 'images',
          javascriptsDir: '<%= config.app %>/scripts',
          fontsDir: '<%= config.app %>/styles/fonts',
//          importPath: '<%= config.app %>/components',
          relativeAssets: true
        },
        dist: {},
        server: {
          options: {
            debugInfo: true
          }
        }
      },
                
        // grunt-vulcanize
        vulcanize: {
            dist: {
                options: {
                    csp: true,
//                    inline: true,
                    strip: true,
//                    excludes: {
//                      imports: [
//                        "core-component-page.html"
//                      ]
//                    },
                },
                files: {
                    '<%= config.dist %>/index.html': '<%= config.dist %>/index.html'
                }
            },
        },          
                     

        remove: {
          unvulcanized: {
            fileList: ['<%= config.dist %>/index.html']
          },
          vulcanized: {
            fileList: ['<%= config.dist %>/vulcanized.html']
          }
        },

        // Make sure code styles are up to par and there are no obvious mistakes
        jshint: {
            options: {
                jshintrc: '.jshintrc',
                reporter: require('jshint-stylish')
            },
            all: [
                'Gruntfile.js',
                '<%= config.app %>/scripts/{,*/}*.js',
                '!<%= config.app %>/scripts/vendor/*',
                'test/spec/{,*/}*.js'
            ]
        },

        // Mocha testing framework configuration options
        mocha: {
            all: {
                options: {
                    run: true,
                    urls: ['http://<%= connect.test.options.hostname %>:<%= connect.test.options.port %>/index.html']
                }
            }
        },
//
//        // Compiles Sass to CSS and generates necessary files if requested
//        sass: {
//            options: {
//                includePaths: [
//                    'bower_components'
//                ]
//            },
//            dist: {
//                files: [{
//                    expand: true,
//                    cwd: '<%= config.app %>/styles',
//                    src: ['*.scss'],
//                    dest: '.tmp/styles',
//                    ext: '.css'
//                }]
//            },
//            server: {
//                files: [{
//                    expand: true,
//                    cwd: '<%= config.app %>/styles',
//                    src: ['*.scss'],
//                    dest: '.tmp/styles',
//                    ext: '.css'
//                }]
//            }
//        },

        // Add vendor prefixed styles
        autoprefixer: {
            options: {
                browsers: ['last 1 version']
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: '.tmp/styles/',
                    src: '{,*/}*.css',
                    dest: '.tmp/styles/'
                }]
            }
        },

        // Automatically inject Bower components into the HTML file
        bowerInstall: {
            app: {
                src: ['<%= config.app %>/index.html'],
                exclude: ['bower_components/bootstrap-sass-official/vendor/assets/javascripts/bootstrap.js']
            },
            sass: {
                src: ['<%= config.app %>/styles/{,*/}*.{scss,sass}']
            }
        },

        // Renames files for browser caching purposes
        rev: {
            dist: {
                files: {
                    src: [
                        '<%= config.dist %>/scripts/{,*/}*.js',
                        '<%= config.dist %>/styles/{,*/}*.css',
                        '<%= config.dist %>/images/{,*/}*.*',
                        '<%= config.dist %>/styles/fonts/{,*/}*.*',
                        '<%= config.dist %>/*.{ico,png}'
                    ]
                }
            }
        },

        // Reads HTML for usemin blocks to enable smart builds that automatically
        // concat, minify and revision files. Creates configurations in memory so
        // additional tasks can operate on them
        useminPrepare: {
            options: {
                dest: '<%= config.dist %>'
            },
            html: '<%= config.app %>/index.html'
        },

        // Performs rewrites based on rev and the useminPrepare configuration
        usemin: {
            options: {
                assetsDirs: ['<%= config.dist %>', '<%= config.dist %>/images']
            },
            html: ['<%= config.dist %>/{,*/}*.html'],
            css: ['<%= config.dist %>/styles/{,*/}*.css'],
        },

        // The following *-min tasks produce minified files in the dist folder
        imagemin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= config.app %>/images',
                    src: '{,*/}*.{gif,jpeg,jpg,png}',
                    dest: '<%= config.dist %>/images'
                }]
            }
        },

        svgmin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= config.app %>/images',
                    src: '{,*/}*.svg',
                    dest: '<%= config.dist %>/images'
                }]
            }
        },

        htmlmin: {
            dist: {
                options: {
                    collapseBooleanAttributes: true,
                    collapseWhitespace: true,
                    removeAttributeQuotes: true,
                    removeCommentsFromCDATA: true,
                    removeEmptyAttributes: true,
                    removeOptionalTags: true,
                    removeRedundantAttributes: true,
                    useShortDoctype: true
                },
                files: [{
                    expand: true,
                    cwd: '<%= config.dist %>',
                    src: '{,*/}*.html',
                    dest: '<%= config.dist %>'
                }]
            }
        },

        // By default, your `index.html`'s <!-- Usemin block --> will take care of
        // minification. These next options are pre-configured if you do not wish
        // to use the Usemin blocks.
        // cssmin: {
        //     dist: {
        //         files: {
        //             '<%= config.dist %>/styles/main.css': [
        //                 '.tmp/styles/{,*/}*.css',
        //                 '<%= config.app %>/styles/{,*/}*.css'
        //             ]
        //         }
        //     }
        // },
        // uglify: {
        //     dist: {
        //         files: {
        //             '<%= config.dist %>/scripts/scripts.js': [
        //                 '<%= config.dist %>/scripts/scripts.js'
        //             ]
        //         }
        //     }
        // },
        // concat: {
        //     dist: {}
        // },

        // Copies remaining files to places other tasks can use
        copy: {
            dist: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= config.app %>',
                    dest: '<%= config.dist %>',
                    src: [
                        '*.{ico,png,txt}',
                        '.htaccess',
                        'images/{,*/}*.webp',
                        '{,*/}*.html',
                        'styles/fonts/{,*/}*.*'
                    ]
//                }, {
//                    expand: true,
//                    dot: true,
//                    cwd: '.',
//                    src: ['bower_components/bootstrap-sass-official/vendor/assets/fonts/bootstrap/*.*'],
//                    dest: '<%= config.dist %>'
                }]
            },
            styles: {
                expand: true,
                dot: true,
                cwd: '<%= config.app %>/styles',
                dest: '.tmp/styles/',
                src: '{,*/}*.css'
            },
                vulcanized: {
                options: {
                    // move the csp js file into usemin block
                    process: function (content, srcpath) {
                      var useminComment = '<!-- build:js scripts/index.js -->';
                      function moveToUsemin(script) {
                        // extract the csp js script line
                        var cspStart = content.indexOf(script);
                        var cspEnd   = cspStart+script.length;
                        var cspJs = content.slice(cspStart,cspEnd); // CR

                        // cut it out
                        content = content.substring(0,cspStart-1).concat(
                            content.substring(cspEnd)
                        );

                        // insert it into the usemin block
                        var useminEnd = content.indexOf(useminComment)+useminComment.length; // next line
                        content = content
                            .substring(0,useminEnd) // end of useminComment
                            .concat(
                                '\n',
                                cspJs, // insert
                                '\n',
                                content.substring(useminEnd+1) // after end of useminComment
                            );
                      }

                      moveToUsemin('<script src="vulcanized.js"></script>');
                      moveToUsemin('<script src="bower_components/polymer/polymer.js"></script>');
                      moveToUsemin('<script src="bower_components/platform/platform.js"></script>');
                      return content;
                    }
                },
                src: 'dist/vulcanized.html',
                dest: 'dist/index.html',
            },
        },

        // Generates a custom Modernizr build that includes only the tests you
        // reference in your app
        modernizr: {
            dist: {
                devFile: 'bower_components/modernizr/modernizr.js',
                outputFile: '<%= config.dist %>/scripts/vendor/modernizr.js',
                files: {
                    src: [
                        '<%= config.dist %>/scripts/{,*/}*.js',
                        '<%= config.dist %>/styles/{,*/}*.css',
                        '!<%= config.dist %>/scripts/vendor/*'
                    ]
                },
                uglify: true
            }
        },

        // Run some tasks in parallel to speed up build process
        concurrent: {
            server: [
//                'sass:server',
                'copy:styles'
            ],
            test: [
                'copy:styles'
            ],
            dist: [
//                'sass',
                'copy:styles',
                'imagemin',
                'svgmin'
            ]
        }
    });


    grunt.registerTask('serve', function (target) {
        if (target === 'dist') {
            return grunt.task.run(['build', 'connect:dist:keepalive']);
        }

        grunt.task.run([
            'clean:server',
            'concurrent:server',
            'autoprefixer',
            'connect:livereload',
            'watch'
        ]);
    });

    grunt.registerTask('server', function (target) {
        grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
        grunt.task.run([target ? ('serve:' + target) : 'serve']);
    });

    grunt.registerTask('test', function (target) {
        if (target !== 'watch') {
            grunt.task.run([
                'clean:server',
                'concurrent:test',
                'autoprefixer'
            ]);
        }

        grunt.task.run([
            'connect:test',
            'mocha'
        ]);
    });

    grunt.registerTask('build', [
        'clean:dist',
        'compass:dist',
        'useminPrepare',
        'concurrent:dist',
        'autoprefixer',
        'concat',
        'cssmin',
        'uglify',
        'copy:dist',
        //https://github.com/davidmaxwaterman/yeoman-chromeapp/blob/master/Gruntfile.js
        

        
        'modernizr',
        'rev',
        'usemin',
        'vulcanize:dist',
//        'remove:unvulcanized',
//        'copy:vulcanized',
//        'remove:vulcanized',
//        'htmlmin'
    ]);

    grunt.registerTask('default', [
        'newer:jshint',
        'test',
        'build'
    ]);
    
    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-vulcanize');
    grunt.loadNpmTasks('grunt-remove');
};
