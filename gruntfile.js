module.exports = function(grunt) {
    require('time-grunt')(grunt);
    
    //grunt.loadNpmTasks('grunt-bower-task');

    grunt.initConfig({
        //
        // watch for changes
        //
        watch: {
            options: {
                atBegin: true
            },
            sass: {
                files: './origin/scss/*.{scss,sass}',
                tasks: ['compass:watch']
            },
            js: {
                files: ['./origin/js/*.js'],
                tasks: ['uglify:watch']
            }
        },

        //
        // sass compilation with compass
        //
        compass: {
            options: {
                require: 'breakpoint-slicer',
                sassDir: 'origin/scss',
                cssDir: 'properties/css',
                imagesDir: 'properties/images',
                specify: ['origin/scss/style.scss'],
                relativeAssets: true,
                noLineComments: true,
                bundleExec: true
            },
            watch: {
                options: {
                    environment: 'development',
                    noLineComments: false
                }
            },
            build: {
                options: {
                    outputStyle: 'compressed',
                    environment: 'production',
                    noLineComments: true
                }
            }
        },

        cssmin: {
            combine: {
                options: {
                    keepSpecialComments: 0
                },
                files: {
                    'properties/css/style.css': './properties/css/style.css'
                }
            }
        },

        concat: {
            appjs: {
                src : ['./origin/js/components/jquery/*.js',
                       './origin/js/components/angular/angular.min.js',
                       './origin/js/components/angular/angular.route.min.js',
                       './origin/js/components/angular/angular.touch.min.js',
                       './origin/js/components/wavesurfer/wavesurfer.min.stable.js'],
                dest : 'properties/js/libs.min.js'
            }
        },

        uglify: {
            watch: {
                files: {
                    'properties/js/audio-app.js': ['./origin/js/*.js']
                },
                options: {
                    compress: false,
                    mangle: false,
                    beautify: true
                }
            },
            build: {
                files: {
                    'properties/js/audio-app.js': ['./origin/js/*.js']
                },
                options: {
                    sourceMap: true,
                    preserveComments: false,
                    mangle: true,
                    compress: {
                        drop_console: true
                    }
                }
            },
            buildWaveMin: {
                files: {
                    'origin/js/components/wavesurfer/wavesurfer.min.js': ['./origin/js/components/wavesurfer/wavesurfer.js']
                },
                options: {
                    sourceMap: true,
                    preserveComments: false,
                    mangle: true,
                    compress: {
                        drop_console: true
                    }
                }  
            }
        },

        // Bower install/copy/move
        bowercopy: {
        options: {
            // Bower components folder will be removed afterwards 
            clean: true
        },
        // jQuery
        jquery: {
            options: {
                destPrefix: './origin/js/components/jquery/'
            },
            files: {
                'jquery.min.js': 'jquery/dist/jquery.min.js'
            }
        },
        // Angular files
        angular: {
            options: {
                destPrefix: './origin/js/components/angular/'
            },
            files: {
                'angular.min.js': 'angular/angular.min.js',
                'angular.route.min.js': 'angular-route/angular-route.min.js',
                'angular.touch.min.js': 'angular-touch/angular-touch.min.js'
            },
        }
    }

    });

    require('load-grunt-tasks')(grunt, {scope: 'devDependencies'});

    grunt.registerTask('default', ['watch']);

    grunt.registerTask('build', ['compass:build', 'uglify:build', 'cssmin']);

    //grunt.registerTask('bowr', ['bowercopy', 'build', 'uglify:buildWaveMin', 'concat:appjs']);
    grunt.registerTask('bowr', ['bowercopy', 'build', 'concat:appjs']);
};
