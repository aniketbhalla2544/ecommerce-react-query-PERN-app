#!/usr/bin/env groovy

pipeline {
  agent any

  environment {
  }

  stages {
    stage('Build') {
      steps {
        echo "docker images built"
        sh 'docker build -f Dockerfile.production-server -t aniketbhalla/vendor-dashboard-server .'
      }
    }

    stage('Deploy') {
      steps {
        echo 'app Deployed after build process.'
      }
    }
  }

  post {
    always {
      echo 'The build is completed! Sent notification to Slack.'
    }
  }
}
