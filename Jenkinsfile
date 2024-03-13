#!/usr/bin/env groovy

pipeline {
  agent any

  tools {
    nodejs 'nodejs21'
  }

  stages {
    stage('clean workspace'){
            steps{
                cleanWs()
            }
    }
    stage('Build') {
      steps {
        echo "building docker images, now happening"
        // sh 'docker build -f Dockerfile.production-server -t aniketbhalla/vendor-dashboard-server .'
      }
    }
    stage('Deploy') {
      steps {
        echo 'app Deployed after build process after.'
      }
    }
  }
  post {
    always {
      echo 'The build is completed! Sent notification to Slack.'
    }
  }
}
