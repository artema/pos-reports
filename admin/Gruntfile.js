module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);
  var aws = grunt.file.readJSON('aws.json');
  
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concurrent: {
      dev: {
        tasks: ['nodemon:dev', 'watch'],
        options: {
          logConcurrentOutput: true
        }
      },
      debug: {
        tasks: ['nodemon:debug', 'watch', 'node-inspector:debug'],
        options: {
          logConcurrentOutput: true
        }
      }
    },
    nodemon: {
      options: {
        env: {
          PORT: 8081,
          NODE_ENV: 'development',
          DEBUG: 'connect:*,passport:*,admin:*',
          COOKIE_SECRET: '1234567890'
        },
        callback: function (nodemon) {
          nodemon.on('log', function (event) {
            console.log(event.colour);
          });
        }
      },
      dev: {
        script: 'server.js',
        options: {
          nodeArgs: []
        }
      },
      debug: {
        script: 'server.js',
        options: {
          nodeArgs: ['--debug-brk']
        }
      }
    },
    'node-inspector': {
      debug: {
        options: {
          'web-port': 3000,
          'web-host': 'localhost',
          'hidden': ['node_modules']
        }
      }
    },
    watch: {
      less: {
        files: 'public/less/*.less',
        tasks: ['buildcss'],
        options: {
          interrupt: true,
        }
      },
      js: {
        files: 'public/js/**/*.js',
        tasks: ['buildjs'],
        options: {
          interrupt: true,
        }
      }
    },
    clean: {
      dist: 'public/dist'
    },
    concat: {
      options: {
        process: function(src, filepath) {
          return '//' + filepath + grunt.util.linefeed + grunt.util.linefeed + src;
        }
      },
      js: {
        files: {
          'public/dist/shared.js': [
            'public/js/**/shared/**/*.js',
            'public/js/**/shared.js'
          ],
          'public/dist/panel.js': [
            'public/js/**/panel/**/*.js',
            'public/js/**/panel.js'
          ],
          'public/dist/signup.js': [
          'public/js/**/signup/**/*.js',
          'public/js/**/signup.js'
          ]
        }
      }
    },
    babel: {
      options: {
        sourceMap: 'inline'
      },
      client: {
        files: {
          'public/dist/panel.js': 'public/dist/panel.js',
          'public/dist/signup.js': 'public/dist/signup.js',
          'public/dist/shared.js': 'public/dist/shared.js'
        }
      }
    },
    uglify: {
      options: {
        mangle: false,
        sourceMap: true
      },
      dist: {
        files: [{
          expand: true,
          cwd: 'public/dist/',
          src: ['*.js', '!*.min.js'],
          dest: 'public/dist/',
          ext: '.min.js'
        }]
      }
    },
    less: {
      options: {
        cleancss: true,
        modifyVars: {
          imgPath: '"/public/images"'
        }
      },
      styles: {
        files: {
          "public/dist/styles.css": "public/less/styles.less"
        }
      }
    },
    cssmin: {
      dist: {
        files: [{
          expand: true,
          cwd: 'public/dist/',
          src: ['*.css', '!*.min.css'],
          dest: 'public/dist/',
          ext: '.min.css'
        }]
      }
    },
    zip: {
      deploy: {
        src: [
          'app/**/*',
          'config/**/*',
          'public/**/*',
          'views/**/*',
          'package.json',
          'server.js'
        ],
        dest: '.deploy/<%=pkg.version%>.zip'
      }
    },
    awsebtdeploy: {
      options: {
        applicationName: 'pos-admin',
        healthPage: '/robots.txt',
        region: 'eu-west-1',
        accessKeyId: aws.key,
        secretAccessKey: aws.secret,
        versionLabel: '<%=pkg.version%>',
        deployTimeoutMin: 5,
        healthPageTimeoutMin: 1,
        sourceBundle: '.deploy/<%=pkg.version%>.zip',
        s3: {
          bucket: 'elasticbeanstalk-eu-west-1-523266658163',
          key: '<%=pkg.name%> <%=pkg.version%>.zip'
        }
      },
      production: {
        options: {
          environmentCNAME: 'pos-reports-admin.elasticbeanstalk.com'
        }
      }
    },
    bump: {
      options: {
        files: ['package.json'],
        commit: false,
        createTag: false,
        push: false,
        updateConfigs: ['pkg']
      }
    }
  });

  grunt.registerTask('default', []);
  grunt.registerTask('build', ['clean', 'buildcss', 'buildjs']);
  grunt.registerTask('buildcss', ['less', 'cssmin']);
  grunt.registerTask('buildjs', ['concat:js', 'babel:client', 'uglify']);
  grunt.registerTask('dev', ['build', 'concurrent:dev']);
  grunt.registerTask('debug', ['build', 'concurrent:debug']);
  grunt.registerTask('deploy', ['build', 'bump', 'zip', 'awsebtdeploy:production']);
};
