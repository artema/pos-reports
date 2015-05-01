module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    lambda_invoke: {
      default: {
        options: {
        }
      }
    },
    lambda_deploy: {
      default: {
        options: {
          region: 'eu-west-1',
          profile: 'me'
        },
        function: 'pos-input'
      }
    },
    lambda_package: {
      default: {
      }
    }
  });

  grunt.registerTask('default', []);
  grunt.registerTask('test', ['lambda_invoke']);
  grunt.registerTask('deploy', ['lambda_package', 'lambda_deploy']);
};
