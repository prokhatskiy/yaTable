'use strict';

module.exports = function(grunt) {
    grunt.initConfig({
        //Watcher
        watch: {
            options : {
                livereload: true
            },
            css: {
                files: 'styl/**',
                tasks: ['stylus:css']
            },
            js: {
                files: 'js/*.js',
                tasks: ['concat:js']
            }
        },

        //Stylus task
        stylus: {
            css: {
                options: {
                    linenos : false,
                    urlfunc: 'embedurl'
                },
                files : {
                    'css/styles.css': 'styl/styles.styl'
                }
            }
        },

        //Open browser
        open : {
            browser : {
                path: 'http://localhost:4848'
            }
        },

        //Start server
        connect : {
            server : {
                options: {
                    port: '4848',
                    keepalive : false
                }
            }
        },

        //files concatinations
        concat : {
            js : {
                src: [
                    'js/TableModel.js',
                    'js/TableView.js',
                    'js/TableController.js',
                    'js/pubsub.js',
                    'js/app.js'
                ],
                dest: 'js/prod/scripts.js'
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-stylus');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-open');
    grunt.loadNpmTasks('grunt-contrib-connect');

    grunt.registerTask('default', ['connect', 'open', 'stylus:css', 'concat:js', 'watch']);
};